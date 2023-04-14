import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import markdownToTxt from 'markdown-to-txt';
import { isValidObjectId, Model } from "mongoose";
import { BinaryArrayOperator, BinaryOperator, Filters, PaginationQueryDto } from "../dto/query.dto";
import { Language, DIP, DIPsDoc } from "../entities/dips.entity";
import { IGitFile, IDIPs } from "../interfaces/dips.interface";
import { ParseQueryService } from "./parse-query.service";

@Injectable()
export class DIPsService {
  constructor(
    @InjectModel(DIP.name)
    private readonly dipsDoc: Model<DIPsDoc>,
    private readonly parseQueryService: ParseQueryService
  ) { }

  async groupProposal(): Promise<any> {
    return await this.dipsDoc.aggregate([
      { $match: { proposal: { $ne: "" } } },
      { $group: { _id: "$proposal" } },
    ]);
  }

  cleanSearchField(search: string): string {
    const searchCleaned = (search || "").replace(/[\u202F\u00A0]/gmi, " ").trim();
    return searchCleaned;
  }

  async searchAll({
    paginationQuery,
    order,
    search,
    filter,
    select,
    language,
  }) {

    //  const value=this.cleanSearchField(search);
    const buildFilter = await this.buildFilter(search, filter, language);

    const { limit, page } = paginationQuery;

    const selectedLanguageItems = await this.dipsDoc
      .find(buildFilter)
      .select(select)
      .sort(order)
      .skip(page * limit)
      .limit(limit)
      .lean()
      .exec();

    if (language === Language.English) return selectedLanguageItems;

    const defaultLanguageItems = await this.searchAll({
      paginationQuery,
      order,
      search,
      filter,
      select,
      language: Language.English,
    });

    return defaultLanguageItems.map((item) => {
      const existingItem = selectedLanguageItems.find(
        (selectedItem) => selectedItem.dipName === item.dipName
      );
      return existingItem || item;
    });
  }

  async findAll(
    paginationQuery?: PaginationQueryDto,
    order?: string,
    search?: string,
    filter?: Filters,
    select?: string,
    language?: Language
  ): Promise<any> {

    const cleanedSearch = this.cleanSearchField(search);

    const buildFilter = await this.buildFilter(
      cleanedSearch,
      filter,
      Language.English
    );

    const total = await this.dipsDoc.countDocuments(buildFilter).exec();

    if (select) {
      const items = await this.searchAll({
        paginationQuery,
        order,
        search: cleanedSearch,
        filter,
        select,
        language,
      });

      return { items, total };
    }

    const defaultSelect = [
      "-__v",
      "-file",
      "-sections",
      "-sectionsRaw",
      "-dipName_plain",
      "-filename_plain",
      "-proposal_plain",
      "-title_plain",
      "-sectionsRaw_plain",
    ];

    const items = await this.searchAll({
      paginationQuery,
      order,
      search: cleanedSearch,
      filter,
      select: defaultSelect,
      language,
    });

    return { items, total };
  }

  private buildContainFilters(filters: BinaryOperator[]) {
    const sourceContain = {};
    filters.forEach(element => {
      const newValue = this.validField(element.field, element.value.toString());
      sourceContain[`${this.searcheableField(element.field)}`] = {
        $regex: new RegExp(`${newValue}`),
        $options: "i",
      };
    });
    return sourceContain;
  }

  private buildEqualsFilters(filters: BinaryOperator[]) {
    const sourceEquals = {};
    filters.forEach(element => {
      const newValue = this.validField(element.field, element.value);
      sourceEquals[`${this.searcheableField(element.field)}`] = newValue;
    });
    return sourceEquals;
  }

  private buildInArrayFilters(filters: BinaryArrayOperator[]) {
    const sourceInArray = {};

    filters.forEach(element => {
      if (Array.isArray(element.value)) {
        const searcheableField: string = this.searcheableField(element.field);

        element.value.forEach(value => {
          const newValue = this.validField(element.field, value);

          if (!sourceInArray[searcheableField]) {
            sourceInArray[searcheableField] = {
              $in: [newValue],
            };
          } else {
            sourceInArray[searcheableField].$in.push(newValue);
          }
        });
      }
    });
    
    return sourceInArray;
  }

  private buildNotContainFilters(filters: BinaryOperator[]) {
    const sourceNotContain = {};
    filters.forEach(element => {
      const newValue = this.validField(element.field, element.value.toString());
      sourceNotContain[`${this.searcheableField(element.field)}`] = {
        $not: {
          $regex: new RegExp(`${newValue}`),
          $options: "i",
        },
      };
    });
    return sourceNotContain;
  }

  private buildNotEqualsFilters(filters: BinaryOperator[]) {
    const sourceNotEquals = {};
    filters.forEach(element => {
      const newValue = this.validField(element.field, element.value);
      sourceNotEquals[`${this.searcheableField(element.field)}`] = {
        $ne: newValue,
      };
    });
    return sourceNotEquals;
  }

  // Function to build filter*
  async buildFilter(
    searchText: string,
    filter?: Filters,
    language?: Language
  ): Promise<any> {
    let source: any = {
      language: language || Language.English,
    };

    for (const key in filter) {
      if (filter[key] && Array.isArray(filter[key])) {
        switch (key) {
          case 'contains':
            Object.assign(source, this.buildContainFilters(filter.contains));
            break;
          case 'equals':
            Object.assign(source, this.buildEqualsFilters(filter.equals));
            break;
          case 'inarray':
            Object.assign(source, this.buildInArrayFilters(filter.inarray));
            break;
          case 'notcontains':
            Object.assign(source, this.buildNotContainFilters(filter.notcontains));
            break;
          case 'notequals':
            Object.assign(source, this.buildNotEqualsFilters(filter.notequals));
            break;
        }
      }
    }

    if (searchText) {
      if (searchText.startsWith("$")) {
        const ast = await this.parseQueryService.parse(searchText);
        const query = this.buildSmartMongoDBQuery(ast);
        source = {
          $and: [
            {
              ...source,
              ...query,
            },
          ],
        };
      } else {
        const cleanSearchText = searchText.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');

        source["sectionsRaw_plain"] = { '$regex': new RegExp(`${cleanSearchText}`), '$options': 'i' };
      }
    }
    return source;
  }

  buildSmartMongoDBQuery(ast: any): any {
    const or = /or/gi;
    const and = /and/gi;
    const not = /not/gi;

    switch (ast.type) {
      case 'LITERAL':
        if (ast.name.includes("#")) {
          return { tags: { $in: [ast.name.replace("#", "")] } };
        }

        if (ast.name.includes("@")) {
          return {
            status: {
              $regex: new RegExp(`${ast.name.replace("@", "")}`),
              $options: "i",
            },
          };
        }
        break;
      case 'OPERATION':
        if (or.exec(ast.op)) {
          return {
            $or: ast.left.map(item => {
              return this.buildSmartMongoDBQuery(item);
            }),
          };
        }

        if (and.exec(ast.op)) {
          return {
            $and: ast.left.map(item => {
              return this.buildSmartMongoDBQuery(item);
            }),
          };
        }

        if (not.exec(ast.op)) {
          if (ast.left.includes("#")) {
            return { tags: { $nin: [ast.left.replace("#", "")] } };
          }
          if (ast.left.includes("@")) {
            return {
              status: {
                $not: {
                  $regex: new RegExp(`${ast.left.replace("@", "")}`),
                  $options: "i",
                },
              },
            };
          }
        }
        break;
    }
    throw new Error("Database query not supportted");
  }

  validField(field: string, value: any): any {

    switch (field) {
      case "status":
      case "dipName":
      case "filename":
      case "proposal":
      case "dip":
      case "tags":
      case "contributors":
      case "author":
      case "dipFather":
      case "sectionsRaw":
        return value;
      case "title":
        return this.escapeRegExp(value)
      default:
        throw new Error(`Invalid filter field (${field})`);
    }
  }

  addSearcheableFields(item): any {
    for (const key in item) {
      const value = item[key];

      if (value) {
        switch (key) {
          case "dipName":
          case "filename":
          case "proposal":
          case "title":
            item[`${key}_plain`] = markdownToTxt(value);
            break;
          case "sectionsRaw":
            item['sectionsRaw_plain'] = [];
            value.forEach(element => {
              item['sectionsRaw_plain'].push(markdownToTxt(element));
            });
        }
      }
    }

    return item;
  }

  searcheableField(field: string): string {
    switch (field) {
      case "dipName":
      case "filename":
      case "proposal":
      case "title":
      case "sectionsRaw":
        return `${field}_plain`;
      default:
        return field;
    }
  }

  async findOneByDipName(dipName: string, language: Language): Promise<DIP> {
    if (!language) {
      language = Language.English;
    }

    return this.dipsDoc
      .findOne({ dipName_plain: dipName, language })
      .select([
        "-__v",
        "-file",
        "-dipName_plain",
        "-filename_plain",
        "-proposal_plain",
        "-title_plain",
        "-sectionsRaw_plain",
      ])
      .exec();
  }

  async smartSearch(
    field: string,
    value: string,
    language: Language
  ): Promise<DIP[]> {
    if (!language) {
      language = Language.English;
    }

    switch (field) {
      case "tags":
        return this.dipsDoc.aggregate([
          { $unwind: "$tags" },
          {
            $match: {
              tags: {
                $regex: new RegExp(`^${value}`),
                $options: "i",
              },
              language: language,
            },
          },
          { $group: { _id: { tags: "$tags" }, tag: { $first: "$tags" } } },
          { $project: { _id: 0, tag: "$tag" } },
        ]);

      case "status":
        return this.dipsDoc.aggregate([
          {
            $match: {
              status: {
                $regex: new RegExp(`^${value}`),
                $options: "i",
              },
              language: language,
            },
          },
          {
            $group: {
              _id: { status: "$status" },
              status: { $first: "$status" },
            },
          },
          { $project: { _id: 0, status: "$status" } },
        ]);

      default:
        throw new Error(`Field ${field} invalid`);
    }
  }

  async findOneByFileName(filename: string, language: Language): Promise<DIP> {
    if (!language) {
      language = Language.English;
    }

    const filter = {
      filename_plain: {
        $regex: new RegExp(filename),
        $options: "i",
      },
      language,
    };

    return this.dipsDoc.findOne(filter).select([
      "-__v",
      "-file",
      "-dipName_plain",
      "-filename_plain",
      "-proposal_plain",
      "-title_plain",
      "-sectionsRaw_plain",
    ]).exec();
  }

  async getSummaryByDipName(dipName: string, language: Language): Promise<DIP> {
    if (!language) {
      language = Language.English;
    }

    return this.dipsDoc
      .findOne({ dipName_plain: dipName, language })
      .select(["sentenceSummary", "paragraphSummary", "title", "dipName"])
      .exec();
  }

  async getSummaryByDipComponent(
    dipComponent: string,
    language: Language
  ): Promise<DIP> {
    if (!language) {
      language = Language.English;
    }
    const dipName = dipComponent.match(/DIP\d+/gi)[0];

    return this.dipsDoc
      .findOne({ dipName_plain: dipName, language })
      .select({
        sentenceSummary: 1,
        paragraphSummary: 1,
        title: 1,
        dipName: 1,
        components: { $elemMatch: { cName: dipComponent } },
      })
      .exec();
  }

  async findByProposal(
    proposal: string,
    language?: Language
  ): Promise<DIP[]> {
    if (!language) {
      language = Language.English;
    }

    return this.dipsDoc
      .find({ proposal_plain: proposal, language })
      .select(["title", "dipName"])
      .sort("dip subproposal")
      .exec();
  }

  create(dIPs: IDIPs): Promise<DIP> {
    return this.dipsDoc.create(
      this.addSearcheableFields(dIPs),
    );
  }

  insertMany(dips: DIP[] | any): Promise<any> {
    const dipsUpdated = dips.map(element => {
      return this.addSearcheableFields(element);
    });
    return this.dipsDoc.insertMany(dipsUpdated);
  }

  async getAll(): Promise<Map<string, IGitFile>> {
    const files = new Map();

    for await (const doc of this.dipsDoc
      .find([{ $sort: { filename: 1 } }])
      .select(["hash", "filename"])
      .cursor()) {
      files.set(doc.filename, doc);
    }

    return files;
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    await this.dipsDoc.deleteMany({ _id: { $in: ids } });
  }

  async dropDatabase(): Promise<void> {
    return await this.dipsDoc.db.dropDatabase();
  }

  async update(id: string, dIPs: DIP): Promise<DIP> {
    return this.dipsDoc
      .findOneAndUpdate(
        { _id: id },
        { $set: this.addSearcheableFields(dIPs) },
        { new: true, useFindAndModify: false }
      )
      .lean(true);
  }

  async setDipsFather(dips: string[]): Promise<any> {
    return this.dipsDoc
      .updateMany(
        { dipName: { $in: dips } },
        { $set: { dipFather: true } },
        { new: true, useFindAndModify: false }
      )
      .lean(true);
  }

  async remove(
    id: string
  ): Promise<{
    n: number;
    ok: number;
    deletedCount: number;
  }> {
    return this.dipsDoc.deleteOne({ _id: id }).lean(true);
  }

  async getDipLanguagesAvailables(dipName: string): Promise<any> {
    return this.dipsDoc.find({ dipName }, "dipName language").exec();
  }

  escapeRegExp(input: string): string {
    return input.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }
}
