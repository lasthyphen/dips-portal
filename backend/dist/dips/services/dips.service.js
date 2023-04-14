"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIPsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const markdown_to_txt_1 = require("markdown-to-txt");
const mongoose_2 = require("mongoose");
const dips_entity_1 = require("../entities/dips.entity");
const parse_query_service_1 = require("./parse-query.service");
let DIPsService = class DIPsService {
    constructor(dipsDoc, parseQueryService) {
        this.dipsDoc = dipsDoc;
        this.parseQueryService = parseQueryService;
    }
    async groupProposal() {
        return await this.dipsDoc.aggregate([
            { $match: { proposal: { $ne: "" } } },
            { $group: { _id: "$proposal" } },
        ]);
    }
    cleanSearchField(search) {
        const searchCleaned = (search || "").replace(/[\u202F\u00A0]/gmi, " ").trim();
        return searchCleaned;
    }
    async searchAll({ paginationQuery, order, search, filter, select, language, }) {
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
        if (language === dips_entity_1.Language.English)
            return selectedLanguageItems;
        const defaultLanguageItems = await this.searchAll({
            paginationQuery,
            order,
            search,
            filter,
            select,
            language: dips_entity_1.Language.English,
        });
        return defaultLanguageItems.map((item) => {
            const existingItem = selectedLanguageItems.find((selectedItem) => selectedItem.dipName === item.dipName);
            return existingItem || item;
        });
    }
    async findAll(paginationQuery, order, search, filter, select, language) {
        const cleanedSearch = this.cleanSearchField(search);
        const buildFilter = await this.buildFilter(cleanedSearch, filter, dips_entity_1.Language.English);
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
    buildContainFilters(filters) {
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
    buildEqualsFilters(filters) {
        const sourceEquals = {};
        filters.forEach(element => {
            const newValue = this.validField(element.field, element.value);
            sourceEquals[`${this.searcheableField(element.field)}`] = newValue;
        });
        return sourceEquals;
    }
    buildInArrayFilters(filters) {
        const sourceInArray = {};
        filters.forEach(element => {
            if (Array.isArray(element.value)) {
                const searcheableField = this.searcheableField(element.field);
                element.value.forEach(value => {
                    const newValue = this.validField(element.field, value);
                    if (!sourceInArray[searcheableField]) {
                        sourceInArray[searcheableField] = {
                            $in: [newValue],
                        };
                    }
                    else {
                        sourceInArray[searcheableField].$in.push(newValue);
                    }
                });
            }
        });
        return sourceInArray;
    }
    buildNotContainFilters(filters) {
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
    buildNotEqualsFilters(filters) {
        const sourceNotEquals = {};
        filters.forEach(element => {
            const newValue = this.validField(element.field, element.value);
            sourceNotEquals[`${this.searcheableField(element.field)}`] = {
                $ne: newValue,
            };
        });
        return sourceNotEquals;
    }
    async buildFilter(searchText, filter, language) {
        let source = {
            language: language || dips_entity_1.Language.English,
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
                        Object.assign(Object.assign({}, source), query),
                    ],
                };
            }
            else {
                const cleanSearchText = searchText.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                source["sectionsRaw_plain"] = { '$regex': new RegExp(`${cleanSearchText}`), '$options': 'i' };
            }
        }
        return source;
    }
    buildSmartMongoDBQuery(ast) {
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
    validField(field, value) {
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
                return this.escapeRegExp(value);
            default:
                throw new Error(`Invalid filter field (${field})`);
        }
    }
    addSearcheableFields(item) {
        for (const key in item) {
            const value = item[key];
            if (value) {
                switch (key) {
                    case "dipName":
                    case "filename":
                    case "proposal":
                    case "title":
                        item[`${key}_plain`] = (0, markdown_to_txt_1.default)(value);
                        break;
                    case "sectionsRaw":
                        item['sectionsRaw_plain'] = [];
                        value.forEach(element => {
                            item['sectionsRaw_plain'].push((0, markdown_to_txt_1.default)(element));
                        });
                }
            }
        }
        return item;
    }
    searcheableField(field) {
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
    async findOneByDipName(dipName, language) {
        if (!language) {
            language = dips_entity_1.Language.English;
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
    async smartSearch(field, value, language) {
        if (!language) {
            language = dips_entity_1.Language.English;
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
    async findOneByFileName(filename, language) {
        if (!language) {
            language = dips_entity_1.Language.English;
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
    async getSummaryByDipName(dipName, language) {
        if (!language) {
            language = dips_entity_1.Language.English;
        }
        return this.dipsDoc
            .findOne({ dipName_plain: dipName, language })
            .select(["sentenceSummary", "paragraphSummary", "title", "dipName"])
            .exec();
    }
    async getSummaryByDipComponent(dipComponent, language) {
        if (!language) {
            language = dips_entity_1.Language.English;
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
    async findByProposal(proposal, language) {
        if (!language) {
            language = dips_entity_1.Language.English;
        }
        return this.dipsDoc
            .find({ proposal_plain: proposal, language })
            .select(["title", "dipName"])
            .sort("dip subproposal")
            .exec();
    }
    create(dIPs) {
        return this.dipsDoc.create(this.addSearcheableFields(dIPs));
    }
    insertMany(dips) {
        const dipsUpdated = dips.map(element => {
            return this.addSearcheableFields(element);
        });
        return this.dipsDoc.insertMany(dipsUpdated);
    }
    async getAll() {
        var e_1, _a;
        const files = new Map();
        try {
            for (var _b = __asyncValues(this.dipsDoc
                .find([{ $sort: { filename: 1 } }])
                .select(["hash", "filename"])
                .cursor()), _c; _c = await _b.next(), !_c.done;) {
                const doc = _c.value;
                files.set(doc.filename, doc);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return files;
    }
    async deleteManyByIds(ids) {
        await this.dipsDoc.deleteMany({ _id: { $in: ids } });
    }
    async dropDatabase() {
        return await this.dipsDoc.db.dropDatabase();
    }
    async update(id, dIPs) {
        return this.dipsDoc
            .findOneAndUpdate({ _id: id }, { $set: this.addSearcheableFields(dIPs) }, { new: true, useFindAndModify: false })
            .lean(true);
    }
    async setDipsFather(dips) {
        return this.dipsDoc
            .updateMany({ dipName: { $in: dips } }, { $set: { dipFather: true } }, { new: true, useFindAndModify: false })
            .lean(true);
    }
    async remove(id) {
        return this.dipsDoc.deleteOne({ _id: id }).lean(true);
    }
    async getDipLanguagesAvailables(dipName) {
        return this.dipsDoc.find({ dipName }, "dipName language").exec();
    }
    escapeRegExp(input) {
        return input.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&");
    }
};
DIPsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dips_entity_1.DIP.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        parse_query_service_1.ParseQueryService])
], DIPsService);
exports.DIPsService = DIPsService;
//# sourceMappingURL=dips.service.js.map