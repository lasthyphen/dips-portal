import { readFile } from "fs/promises";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  IGitFile,
  ISynchronizeData,
  IPreamble,
} from "../interfaces/dips.interface";
import { DIPsService } from "./dips.service";

import { SimpleGitService } from "./simple-git.service";

import { Env } from "@app/env";
import { MarkedService } from "./marked.service";
import { Component, DIP, Reference } from "../entities/dips.entity";
import { GithubService } from "./github.service";
import { PullRequestService } from "./pull-requests.service";
import {
  openIssue,
  pullRequests,
  pullRequestsAfter,
  pullRequestsCount,
  pullRequestsLast,
} from "../graphql/definitions.graphql";
import { Filters, PaginationQueryDto } from "../dto/query.dto";

@Injectable()
export class ParseDIPsService {
  baseDir: string;

  private readonly logger = new Logger(ParseDIPsService.name);

  constructor(
    private simpleGitService: SimpleGitService,
    private dipsService: DIPsService,
    private configService: ConfigService,
    private githubService: GithubService,
    private markedService: MarkedService,
    private pullRequestService: PullRequestService
  ) {
    this.baseDir = `${process.cwd()}/${this.configService.get<string>(
      Env.FolderRepositoryName
    )}`;
  }

  loggerMessage(message: string) {
    this.logger.log(message);
  }

  async parse(): Promise<boolean> {
    const branch = this.configService.get(Env.RepoBranch);

    try {
      await this.simpleGitService.pull("origin", branch);

      const result: any = await Promise.all([
        this.simpleGitService.getFiles(),
        this.dipsService.getAll(),
        this.pullRequestService.count(),
        this.githubService.pullRequests(pullRequestsCount),
      ]);

      const synchronizeData: ISynchronizeData = await this.synchronizeData(
        result[0],
        result[1]
      );

      await this.simpleGitService.saveMetaVars();

      if (result[2] === 0) {
        let data = await this.githubService.pullRequests(pullRequests);
        await this.pullRequestService.create(
          data?.repository?.pullRequests?.nodes
        );

        while (data?.repository?.pullRequests?.pageInfo?.hasNextPage) {
          data = await this.githubService.pullRequests(
            pullRequestsAfter,
            data?.repository?.pullRequests?.pageInfo?.endCursor
          );
          await this.pullRequestService.create(
            data?.repository?.pullRequests?.nodes
          );
        }
      } else {
        if (result[3].repository.pullRequests.totalCount - result[2] > 0) {
          const data = await this.githubService.pullRequestsLast(
            pullRequestsLast,
            result[3].repository.pullRequests.totalCount - result[2]
          );
          await this.pullRequestService.create(
            data?.repository?.pullRequests?.nodes
          );
        }

        this.logger.log(
          `Total news pull request ===> ${result[3].repository.pullRequests.totalCount - result[2]
          }`
        );
      }

      this.logger.log(
        `Synchronize Data ===> ${JSON.stringify(synchronizeData)}`
      );

      const dips = await this.dipsService.groupProposal();

      this.logger.log(
        `Dips with subproposals data ===> ${JSON.stringify(dips)}`
      );

      if (dips.length > 0) {
        await this.dipsService.setDipsFather(dips.map((d) => d._id));
      }

      await this.updateSubproposalCountField();

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async parseDIP(item, isNewDIP: boolean): Promise<DIP> {
    const dir = `${this.baseDir}/${item.filename}`;

    this.logger.log(`Parse ${isNewDIP ? 'new ' : ''}dip item update => ${item.filename}`);

    const fileString = await readFile(dir, "utf-8");
    return this.parseLexerData(fileString, item)
  }

  async deleteDipsFromMap(filesDB: Map<string, IGitFile>) {
    // Remove remaining items
    const deleteItems: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, value] of filesDB.entries()) {
      deleteItems.push(value._id);
    }

    await this.dipsService.deleteManyByIds(deleteItems);
  }

  async updateIfDifferentHash(fileDB, item) {
    if (fileDB.hash !== item.hash) {
      const dip: DIP = await this.parseDIP(item, false);

      if (dip) {
        try {
          await this.dipsService.update(fileDB._id, dip);
        } catch (error) {
          this.logger.error(error.message);
        }
      }
      return true;
    }
    return false;
  }

  async synchronizeData(
    filesGit: IGitFile[],
    filesDB: Map<string, IGitFile>
  ): Promise<ISynchronizeData> {
    const synchronizeData: ISynchronizeData = {
      creates: 0,
      deletes: 0,
      updates: 0,
    };
    const createItems = [];

    const errors = [];

    for (const item of filesGit) {
      if (!filesDB.has(item.filename)) {
        try {
          const dip = await this.parseDIP(item, true);
          if (dip?.dip === undefined || !dip?.dipName) {

            errors.push({ dipPath: item.filename });

            this.logger.log(
              `Dips with problems to parse ==> ${(dip?.dip, dip?.dipName, dip?.filename)
              }`
            );
          }

          if (dip) {
            createItems.push(dip);
          }
        } catch (error) {
          this.logger.log(error.message);
          continue;
        }
      } else {
        const isUpdated = await this.updateIfDifferentHash(
          filesDB.get(item.filename),
          item,
        );
        isUpdated && synchronizeData.updates++;
        filesDB.delete(item.filename);
      }
    }

    if (errors.length) {
      await this.sendIssue(errors);
    }

    // Remove remaining items
    await this.deleteDipsFromMap(filesDB);

    synchronizeData.deletes = filesDB.size;
    synchronizeData.creates = createItems.length;

    await this.dipsService.insertMany(createItems);
    return synchronizeData;
  }

  async sendIssue(errors: any[]) {

    const startOfBody = `
# Some problems where found on this DIPS:
`;

    const body = errors.map((error, index) => {
      return `

>DIP Path: ${error.dipPath}

${errors.length === index + 1 ? '' : '---'}

`;

    });

    const response = await this.githubService.openIssue(
      openIssue,
      "DIPs with problems to parse",
      startOfBody + body.join("\n")
    );

    console.log(response);

  }


  getComponentsSection(data: string): string {
    const startDataIndex = data.search(/\*\*\s*DIP\d+[ca]1[\s:]*/gim);

    if (startDataIndex === -1) {
      return "";
    }
    const dataRemainingText = data.substring(startDataIndex);

    const endIndex = dataRemainingText.search(/^#{2}[^#\n]*$/gim);

    if (endIndex === -1) {
      return dataRemainingText;
    }

    const componentText = dataRemainingText.substring(0, endIndex);

    return componentText;
  }

  getDataFromComponentText(componentText: string): Component[] {
    const regexComp = /^\*\*(?<cName>DIP\d+[ca]\d+):\s?(?<cTitle>.*)\*\*/im;
    const regexToGetComponentTitle = /^\*\*DIP\d+[ca]\d+:\s?.*\*\*/gim;

    const componentHeaders = componentText.match(regexToGetComponentTitle);
    const splitedData = componentText.split(regexToGetComponentTitle);

    return componentHeaders?.map((item, index) => {
      const matches = item.match(regexComp).groups;
      const cBody = splitedData[index + 1].trim().split(/^#/gm)[0];

      return {
        cName: matches.cName.trim(),
        cTitle: matches.cTitle.trim(),
        cBody,
      };
    });
  }

  parseDipsNamesComponentsSubproposals(data, isOnComponentSummary) {
    let raw = data.raw;

    if (isOnComponentSummary) {
      const sumaryRaw = raw?.replace(/\*\*\s?DIP\d+[ac]\d+:.*\*\*/gi, (item) => {
        const dipComponent = item.match(/DIP\d+[ac]\d+/gi)[0];

        const dipName = dipComponent.match(/DIP\d+/gi)[0];
        const cleanItem = item?.replace(/\*\*/g, "");

        return `[${cleanItem}](dips/details/${dipName}#${dipComponent})`;
      });

      const cleaned = sumaryRaw?.replace(/]\([^\)]+\)/gm, (item) =>
        item?.replace(/]\([^\)]+/gm, (ite) => ite + ` "NON-SMART-LINK"`)
      );
      return cleaned;
    }

    if (data.type === "heading") {
      return raw;
    }

    //#region Helper functions
    const processToken = (pattern, item, processLink) =>
      item?.replace(pattern, (match) => processLink(match)?.replace(/`/g, ""));

    const parseDipNames = (item) =>
      item?.replace(
        /DIP\d+/gi,
        (item) => `[${item}](dips/details/${item} "smart-Dip")`
      );

    const parseDipComponent = (item) =>
      item?.replace(/DIP\d+[ca]\d+/gi, (item) => {
        const dipFather = item.match(/DIP\d+/gi)[0];
        return `[${item}](dips/details/${dipFather}#${item} "smart-Component")`;
      });

    const parseDipSubproposal = (item) =>
      item?.replace(
        /DIP\d+[ca]\d+-SP\d/gi,
        (item) => `[${item}](dips/details/${item} "smart-Subproposal")`
      );
    //#endregion

    raw = processToken(/[\s`(]DIP\d+[)\.\*,\s`:]/gi, raw, parseDipNames);

    raw = processToken(
      /[\s`(]DIP\d+[ca]\d+[)\.\*,\s`:]/gi,
      raw,
      parseDipComponent
    );

    raw = processToken(
      /[\s`(]DIP\d+[ca]\d+-SP\d[\.\*),\s`:]/gi,
      raw,
      parseDipSubproposal
    );

    return raw;
  }

  private parseReferenceList(items: any[]): Reference[] {
    const references: Reference[] = [];
    for (const item of items) {
      for (const list of item.tokens) {
        if (list.tokens) {
          references.push(
            ...list.tokens
              .filter((d) => d.href)
              .map((f) => {
                return {
                  name: f.text,
                  link: f.href,
                };
              })
          );
        }
      }
    }
    return references;
  }

  private parseReferencesTokens(item: any): Reference[] {
    switch (item.type) {
      case "text":
        if (item.text.trim()) {
          return [{
            name: item.text,
            link: "",
          }];
        }
        break;
      case "link":
        return [{
          name: item.text,
          link: item.href,
        }];
      default:
        if (item.tokens) {
          return item.tokens.map((d) => {
            return { name: d.text, link: d.href || d.text };
          });
        }
    }
    return [];
  }

  private parseReferences(next): Reference[] {
    if (next.type === "list") {
      return this.parseReferenceList(next.items);
    }

    if (next?.tokens) {
      const references: Reference[] = [];
      for (const item of next?.tokens) {
        references.push(...this.parseReferencesTokens(item));

      }
      return references;
    }
    return []
  }

  private parseParagraphSummary(list: any[]): string {
    const paragraphSummaryArray = [];

    for (
      let index = 0;
      index < list.length &&
      list[index].type !== "heading" &&
      list[index].depth !== 2;
      index++
    ) {
      paragraphSummaryArray.push(list[index].raw);
    }

    return paragraphSummaryArray.join("").trim();
  }

  private parseNotTitleHeading(
    list: any[],
    dip: DIP,
    item: IGitFile,
  ) {
    let isOnComponentSummary: boolean = false;
    let preamble: IPreamble;
    switch (list[0]?.text) {
      case "Preamble":
        if (item.filename.includes("-")) {
          preamble = this.parsePreamble(list[1]?.text, true);

          preamble.dip = parseInt(dip.proposal?.replace("DIP", ""));
          dip.dipName = preamble.dipName;
          dip.subproposal = this.setSubproposalValue(dip.dipName);
        } else {
          preamble = this.parsePreamble(list[1]?.text);
        }
        break;
      case "Sentence Summary":
        dip.sentenceSummary = list[1].raw;
        break;
      case "Paragraph Summary":
        dip.paragraphSummary = this.parseParagraphSummary(list.slice(1, list.length + 1));
        break;
      case "References":
        dip.references = this.parseReferences(list[1])
        break;
      default:
        if (list[0].text.toLowerCase().includes("component summary")) {
          isOnComponentSummary = true;
        }
    }
    return { dip, preamble, isOnComponentSummary };
  }

  private extractDipNumberFromDipName(dipName: string): string {
    return dipName?.replace(/\d+/g, (number: string) => {
      const numb = parseInt(number);// avoid the starter 0 problem
      const decimalPlaces = 4;

      if (!isNaN(numb)) {
        const parsed = numb.toString();
        return "0".repeat(decimalPlaces - parsed.length) + parsed;
      }
      return number;
    });
  }

  parseLexerData(fileString: string, item: IGitFile): DIP {
    const list: any[] = this.markedService.markedLexer(fileString);
    let preamble: IPreamble;
    const sectionsRaw: string[] = [];

    let dip: DIP = {
      hash: item.hash,
      file: fileString,
      language: item.language,
      filename: item.filename,
      sections: [],
      sectionsRaw: [],
      references: [],
    };
    const dipNumberMatch = item.filename.match(/(?<dipNumber>DIP\d+)\//i);
    if (!dipNumberMatch) {
      throw new Error("DIP filename not inside a DIP folder");
    }
    const dipFatherNumber = dipNumberMatch.groups.dipNumber.toUpperCase();

    if (item.filename.includes("-")) {
      dip.proposal = dipFatherNumber;
    } else {
      dip.dipName = dipFatherNumber;

      // Only the dipsFathers
      const componentSummary: string = this.getComponentsSection(fileString);
      const components: Component[] = this.getDataFromComponentText(
        componentSummary
      );
      dip.components = components;
    }

    let title: string;

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      let isOnComponentSummary = false;

      if (element?.type === "heading") {
        const matchDipComponentName = element?.text?.match(
          /^(?<dipComponent>DIP\d+[ca]\d+)\s?:/i
        );
        const dipComponent = matchDipComponentName?.groups?.dipComponent;
        if (dipComponent) {
          dip.sections.push({
            heading: element?.text,
            depth: element?.depth,
            dipComponent,
          });
        } else {
          dip.sections.push({
            heading: element?.text,
            depth: element?.depth,
          });
        }

        switch (`${element?.depth}`) {
          case '1':
            title = element?.text;
            break;
          case '2':
            const parsed = this.parseNotTitleHeading(
              list.slice(i, list.length + 1),
              dip,
              item,
            );
            preamble = parsed?.preamble || preamble;
            dip = {
              ...dip,
              ...parsed.dip
            };
            isOnComponentSummary = parsed.isOnComponentSummary;
            break;
        }
      }
      sectionsRaw.push(
        this.parseDipsNamesComponentsSubproposals(element, isOnComponentSummary)
      );
    }

    if (!preamble) {
      this.logger.log(`Preamble empty ==> ${JSON.stringify(item)}`);
      return;
    }

    dip.author = preamble.author;
    dip.contributors = preamble.contributors;
    dip.dateProposed = preamble.dateProposed;
    dip.dateRatified = preamble.dateRatified;
    dip.dependencies = preamble.dependencies;
    dip.extra = preamble.extra;
    dip.dip = preamble.dip;
    dip.replaces = preamble.replaces;
    dip.status = preamble.status;
    dip.title = preamble.preambleTitle || title;
    dip.types = preamble.types;
    dip.tags = preamble.tags;
    dip.subproposalsCount = 0;
    dip.votingPortalLink = preamble.votingPortalLink;
    dip.forumLink = preamble.forumLink;
    dip.dipCodeNumber = this.extractDipNumberFromDipName(dip.dipName);
    dip.sectionsRaw = sectionsRaw;

    return dip;
  }

  setSubproposalValue(dipName: string): number {
    let acumulate: any = "";

    for (const item of dipName.split("c")) {
      if (item.includes("DIP")) {
        acumulate = acumulate + item?.replace("DIP", "");
      } else if (item.includes("SP")) {
        acumulate =
          acumulate +
          item
            .split("SP")
            .map((d) => {
              if (d.length === 1) {
                return `0${d}`;
              }
              return d;
            })
            .reduce((a, b) => a + b);
      }
    }

    return parseInt(acumulate);
  }

  parsePreamble(preambleData: string, subproposal = false): IPreamble {
    const preamble: IPreamble = {};

    let flag = true;

    preambleData.split("\n").forEach((preambleLine: string, idx: number, arr: string[]) => {
      if (!preambleLine.includes(":")) {
        return false;
      }

      const keyValue = [
        preambleLine.substring(0, preambleLine.indexOf(":")),
        preambleLine.substring(preambleLine.indexOf(":") + 1).trim()
      ];


      if (subproposal && flag && preambleLine.includes("-SP")) {
        const re = /[: #-]/gi;
        preamble.dipName = preambleLine?.replace(re, "");

        flag = false;
        subproposal = false;
        return false;
      }

      switch (keyValue[0]) {
        case "DIP#":
          if (isNaN(+keyValue[1].trim())) {
            preamble.dip = -1;
            break;
          }
          preamble.dip = +keyValue[1].trim();
          break;
        case "Title":
          preamble.preambleTitle = keyValue[1].trim();
          break;
        case "Contributors":
          preamble.contributors = keyValue[1]
            .split(",")
            .map((data) => data.trim());
          break;
        case "Dependencies":
          preamble.dependencies = keyValue[1]
            .split(",")
            .map((data) => data.trim());
          break;
        case "Author(s)":
        case "Author":
          preamble.author = keyValue[1].split(",").map((data) => data.trim());
          if (!preamble.author.slice().pop()) {
            let index = idx + 1;
            let line = arr[index];
            while (line && !line.includes(":")) {
              const authors = line.split(",").map(a => a.trim());
              preamble.author.push(...authors);
              index++;
              line = arr[index];
            }

            preamble.author = preamble.author.filter(a => !!a);
          }
          break;
        case "Tags":
        case "tags":
          preamble.tags = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "Replaces":
          preamble.replaces = keyValue[1].trim();
          break;
        case "Extra":
          preamble.extra = [...(preamble?.extra || []), keyValue[1].trim()];
          break;
        case "Type":
          preamble.types = keyValue[1].trim();
          break;
        case "Status":
          const status = keyValue[1].trim();

          if (
            status === "Request For Comments (RFC)" ||
            status === "Request for Comments" ||
            status === "Request for Comments (RFC)" ||
            status === "Request for Comment (RFC)" ||
            status === "RFC"
          ) {
            preamble.status = "RFC";
          } else if (
            status === "Rejected (Failed Inclusion Poll July 2020)" ||
            status === "Rejected"
          ) {
            preamble.status = "Rejected";
          } else {
            preamble.status = status;
          }
          break;
        case "Date Proposed":
          preamble.dateProposed = keyValue[1].trim();
          break;
        case "Date Ratified":
          preamble.dateRatified = keyValue[1].trim();
          break;

        case "Ratification Poll URL":
          preamble.votingPortalLink = keyValue.slice(1).join(":").trim();
          break;
        case "Forum URL":
          preamble.forumLink = keyValue.slice(1).join(":").trim();
          break;
        default:
          return false;
      }
      return true;
    });

    return preamble;
  }

  async parseSections(file: string): Promise<any> {
    return this.markedService.markedLexer(file);
  }

  async updateSubproposalCountField(): Promise<void> {
    try {
      const paginationQueryDto: PaginationQueryDto = {
        limit: 0,
        page: 0,
      };
      const filter: Filters = {
        equals: [{
          field: "proposal",
          value: "",
        }],
      };
      const dips: {
        items: any[];
        total: number;
      } = await this.dipsService.findAll(
        paginationQueryDto,
        "",
        "",
        filter,
        "_id dipName proposal"
      );

      const forLoop = async () => {
        for (let element of dips.items) {
          const filterSubp: Filters = {
            equals: [{
              field: "proposal",
              value: element.dipName,
            }],
          };
          const subproposals: {
            items: any[];
            total: number;
          } = await this.dipsService.findAll(
            paginationQueryDto,
            "",
            "",
            filterSubp,
            "_id dipName proposal"
          );
          element.subproposalsCount = subproposals.total;
          await this.dipsService.update(element._id, element as DIP);
        }
      };
      await forLoop();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
