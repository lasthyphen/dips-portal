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
var ParseDIPsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseDIPsService = void 0;
const promises_1 = require("fs/promises");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const dips_service_1 = require("./dips.service");
const simple_git_service_1 = require("./simple-git.service");
const env_1 = require("../../env");
const marked_service_1 = require("./marked.service");
const github_service_1 = require("./github.service");
const pull_requests_service_1 = require("./pull-requests.service");
const definitions_graphql_1 = require("../graphql/definitions.graphql");
let ParseDIPsService = ParseDIPsService_1 = class ParseDIPsService {
    constructor(simpleGitService, dipsService, configService, githubService, markedService, pullRequestService) {
        this.simpleGitService = simpleGitService;
        this.dipsService = dipsService;
        this.configService = configService;
        this.githubService = githubService;
        this.markedService = markedService;
        this.pullRequestService = pullRequestService;
        this.logger = new common_1.Logger(ParseDIPsService_1.name);
        this.baseDir = `${process.cwd()}/${this.configService.get(env_1.Env.FolderRepositoryName)}`;
    }
    loggerMessage(message) {
        this.logger.log(message);
    }
    async parse() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const branch = this.configService.get(env_1.Env.RepoBranch);
        try {
            await this.simpleGitService.pull("origin", branch);
            const result = await Promise.all([
                this.simpleGitService.getFiles(),
                this.dipsService.getAll(),
                this.pullRequestService.count(),
                this.githubService.pullRequests(definitions_graphql_1.pullRequestsCount),
            ]);
            const synchronizeData = await this.synchronizeData(result[0], result[1]);
            await this.simpleGitService.saveMetaVars();
            if (result[2] === 0) {
                let data = await this.githubService.pullRequests(definitions_graphql_1.pullRequests);
                await this.pullRequestService.create((_b = (_a = data === null || data === void 0 ? void 0 : data.repository) === null || _a === void 0 ? void 0 : _a.pullRequests) === null || _b === void 0 ? void 0 : _b.nodes);
                while ((_e = (_d = (_c = data === null || data === void 0 ? void 0 : data.repository) === null || _c === void 0 ? void 0 : _c.pullRequests) === null || _d === void 0 ? void 0 : _d.pageInfo) === null || _e === void 0 ? void 0 : _e.hasNextPage) {
                    data = await this.githubService.pullRequests(definitions_graphql_1.pullRequestsAfter, (_h = (_g = (_f = data === null || data === void 0 ? void 0 : data.repository) === null || _f === void 0 ? void 0 : _f.pullRequests) === null || _g === void 0 ? void 0 : _g.pageInfo) === null || _h === void 0 ? void 0 : _h.endCursor);
                    await this.pullRequestService.create((_k = (_j = data === null || data === void 0 ? void 0 : data.repository) === null || _j === void 0 ? void 0 : _j.pullRequests) === null || _k === void 0 ? void 0 : _k.nodes);
                }
            }
            else {
                if (result[3].repository.pullRequests.totalCount - result[2] > 0) {
                    const data = await this.githubService.pullRequestsLast(definitions_graphql_1.pullRequestsLast, result[3].repository.pullRequests.totalCount - result[2]);
                    await this.pullRequestService.create((_m = (_l = data === null || data === void 0 ? void 0 : data.repository) === null || _l === void 0 ? void 0 : _l.pullRequests) === null || _m === void 0 ? void 0 : _m.nodes);
                }
                this.logger.log(`Total news pull request ===> ${result[3].repository.pullRequests.totalCount - result[2]}`);
            }
            this.logger.log(`Synchronize Data ===> ${JSON.stringify(synchronizeData)}`);
            const dips = await this.dipsService.groupProposal();
            this.logger.log(`Dips with subproposals data ===> ${JSON.stringify(dips)}`);
            if (dips.length > 0) {
                await this.dipsService.setDipsFather(dips.map((d) => d._id));
            }
            await this.updateSubproposalCountField();
            return true;
        }
        catch (error) {
            this.logger.error(error);
            return false;
        }
    }
    async parseDIP(item, isNewDIP) {
        const dir = `${this.baseDir}/${item.filename}`;
        this.logger.log(`Parse ${isNewDIP ? 'new ' : ''}dip item update => ${item.filename}`);
        const fileString = await (0, promises_1.readFile)(dir, "utf-8");
        return this.parseLexerData(fileString, item);
    }
    async deleteDipsFromMap(filesDB) {
        const deleteItems = [];
        for (const [_, value] of filesDB.entries()) {
            deleteItems.push(value._id);
        }
        await this.dipsService.deleteManyByIds(deleteItems);
    }
    async updateIfDifferentHash(fileDB, item) {
        if (fileDB.hash !== item.hash) {
            const dip = await this.parseDIP(item, false);
            if (dip) {
                try {
                    await this.dipsService.update(fileDB._id, dip);
                }
                catch (error) {
                    this.logger.error(error.message);
                }
            }
            return true;
        }
        return false;
    }
    async synchronizeData(filesGit, filesDB) {
        const synchronizeData = {
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
                    if ((dip === null || dip === void 0 ? void 0 : dip.dip) === undefined || !(dip === null || dip === void 0 ? void 0 : dip.dipName)) {
                        errors.push({ dipPath: item.filename });
                        this.logger.log(`Dips with problems to parse ==> ${(dip === null || dip === void 0 ? void 0 : dip.dip, dip === null || dip === void 0 ? void 0 : dip.dipName, dip === null || dip === void 0 ? void 0 : dip.filename)}`);
                    }
                    if (dip) {
                        createItems.push(dip);
                    }
                }
                catch (error) {
                    this.logger.log(error.message);
                    continue;
                }
            }
            else {
                const isUpdated = await this.updateIfDifferentHash(filesDB.get(item.filename), item);
                isUpdated && synchronizeData.updates++;
                filesDB.delete(item.filename);
            }
        }
        if (errors.length) {
            await this.sendIssue(errors);
        }
        await this.deleteDipsFromMap(filesDB);
        synchronizeData.deletes = filesDB.size;
        synchronizeData.creates = createItems.length;
        await this.dipsService.insertMany(createItems);
        return synchronizeData;
    }
    async sendIssue(errors) {
        const startOfBody = `
# Some problems where found on this DIPS:
`;
        const body = errors.map((error, index) => {
            return `

>DIP Path: ${error.dipPath}

${errors.length === index + 1 ? '' : '---'}

`;
        });
        const response = await this.githubService.openIssue(definitions_graphql_1.openIssue, "DIPs with problems to parse", startOfBody + body.join("\n"));
        console.log(response);
    }
    getComponentsSection(data) {
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
    getDataFromComponentText(componentText) {
        const regexComp = /^\*\*(?<cName>DIP\d+[ca]\d+):\s?(?<cTitle>.*)\*\*/im;
        const regexToGetComponentTitle = /^\*\*DIP\d+[ca]\d+:\s?.*\*\*/gim;
        const componentHeaders = componentText.match(regexToGetComponentTitle);
        const splitedData = componentText.split(regexToGetComponentTitle);
        return componentHeaders === null || componentHeaders === void 0 ? void 0 : componentHeaders.map((item, index) => {
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
            const sumaryRaw = raw === null || raw === void 0 ? void 0 : raw.replace(/\*\*\s?DIP\d+[ac]\d+:.*\*\*/gi, (item) => {
                const dipComponent = item.match(/DIP\d+[ac]\d+/gi)[0];
                const dipName = dipComponent.match(/DIP\d+/gi)[0];
                const cleanItem = item === null || item === void 0 ? void 0 : item.replace(/\*\*/g, "");
                return `[${cleanItem}](dips/details/${dipName}#${dipComponent})`;
            });
            const cleaned = sumaryRaw === null || sumaryRaw === void 0 ? void 0 : sumaryRaw.replace(/]\([^\)]+\)/gm, (item) => item === null || item === void 0 ? void 0 : item.replace(/]\([^\)]+/gm, (ite) => ite + ` "NON-SMART-LINK"`));
            return cleaned;
        }
        if (data.type === "heading") {
            return raw;
        }
        const processToken = (pattern, item, processLink) => item === null || item === void 0 ? void 0 : item.replace(pattern, (match) => { var _a; return (_a = processLink(match)) === null || _a === void 0 ? void 0 : _a.replace(/`/g, ""); });
        const parseDipNames = (item) => item === null || item === void 0 ? void 0 : item.replace(/DIP\d+/gi, (item) => `[${item}](dips/details/${item} "smart-Dip")`);
        const parseDipComponent = (item) => item === null || item === void 0 ? void 0 : item.replace(/DIP\d+[ca]\d+/gi, (item) => {
            const dipFather = item.match(/DIP\d+/gi)[0];
            return `[${item}](dips/details/${dipFather}#${item} "smart-Component")`;
        });
        const parseDipSubproposal = (item) => item === null || item === void 0 ? void 0 : item.replace(/DIP\d+[ca]\d+-SP\d/gi, (item) => `[${item}](dips/details/${item} "smart-Subproposal")`);
        raw = processToken(/[\s`(]DIP\d+[)\.\*,\s`:]/gi, raw, parseDipNames);
        raw = processToken(/[\s`(]DIP\d+[ca]\d+[)\.\*,\s`:]/gi, raw, parseDipComponent);
        raw = processToken(/[\s`(]DIP\d+[ca]\d+-SP\d[\.\*),\s`:]/gi, raw, parseDipSubproposal);
        return raw;
    }
    parseReferenceList(items) {
        const references = [];
        for (const item of items) {
            for (const list of item.tokens) {
                if (list.tokens) {
                    references.push(...list.tokens
                        .filter((d) => d.href)
                        .map((f) => {
                        return {
                            name: f.text,
                            link: f.href,
                        };
                    }));
                }
            }
        }
        return references;
    }
    parseReferencesTokens(item) {
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
    parseReferences(next) {
        if (next.type === "list") {
            return this.parseReferenceList(next.items);
        }
        if (next === null || next === void 0 ? void 0 : next.tokens) {
            const references = [];
            for (const item of next === null || next === void 0 ? void 0 : next.tokens) {
                references.push(...this.parseReferencesTokens(item));
            }
            return references;
        }
        return [];
    }
    parseParagraphSummary(list) {
        const paragraphSummaryArray = [];
        for (let index = 0; index < list.length &&
            list[index].type !== "heading" &&
            list[index].depth !== 2; index++) {
            paragraphSummaryArray.push(list[index].raw);
        }
        return paragraphSummaryArray.join("").trim();
    }
    parseNotTitleHeading(list, dip, item) {
        var _a, _b, _c, _d;
        let isOnComponentSummary = false;
        let preamble;
        switch ((_a = list[0]) === null || _a === void 0 ? void 0 : _a.text) {
            case "Preamble":
                if (item.filename.includes("-")) {
                    preamble = this.parsePreamble((_b = list[1]) === null || _b === void 0 ? void 0 : _b.text, true);
                    preamble.dip = parseInt((_c = dip.proposal) === null || _c === void 0 ? void 0 : _c.replace("DIP", ""));
                    dip.dipName = preamble.dipName;
                    dip.subproposal = this.setSubproposalValue(dip.dipName);
                }
                else {
                    preamble = this.parsePreamble((_d = list[1]) === null || _d === void 0 ? void 0 : _d.text);
                }
                break;
            case "Sentence Summary":
                dip.sentenceSummary = list[1].raw;
                break;
            case "Paragraph Summary":
                dip.paragraphSummary = this.parseParagraphSummary(list.slice(1, list.length + 1));
                break;
            case "References":
                dip.references = this.parseReferences(list[1]);
                break;
            default:
                if (list[0].text.toLowerCase().includes("component summary")) {
                    isOnComponentSummary = true;
                }
        }
        return { dip, preamble, isOnComponentSummary };
    }
    extractDipNumberFromDipName(dipName) {
        return dipName === null || dipName === void 0 ? void 0 : dipName.replace(/\d+/g, (number) => {
            const numb = parseInt(number);
            const decimalPlaces = 4;
            if (!isNaN(numb)) {
                const parsed = numb.toString();
                return "0".repeat(decimalPlaces - parsed.length) + parsed;
            }
            return number;
        });
    }
    parseLexerData(fileString, item) {
        var _a, _b;
        const list = this.markedService.markedLexer(fileString);
        let preamble;
        const sectionsRaw = [];
        let dip = {
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
        }
        else {
            dip.dipName = dipFatherNumber;
            const componentSummary = this.getComponentsSection(fileString);
            const components = this.getDataFromComponentText(componentSummary);
            dip.components = components;
        }
        let title;
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let isOnComponentSummary = false;
            if ((element === null || element === void 0 ? void 0 : element.type) === "heading") {
                const matchDipComponentName = (_a = element === null || element === void 0 ? void 0 : element.text) === null || _a === void 0 ? void 0 : _a.match(/^(?<dipComponent>DIP\d+[ca]\d+)\s?:/i);
                const dipComponent = (_b = matchDipComponentName === null || matchDipComponentName === void 0 ? void 0 : matchDipComponentName.groups) === null || _b === void 0 ? void 0 : _b.dipComponent;
                if (dipComponent) {
                    dip.sections.push({
                        heading: element === null || element === void 0 ? void 0 : element.text,
                        depth: element === null || element === void 0 ? void 0 : element.depth,
                        dipComponent,
                    });
                }
                else {
                    dip.sections.push({
                        heading: element === null || element === void 0 ? void 0 : element.text,
                        depth: element === null || element === void 0 ? void 0 : element.depth,
                    });
                }
                switch (`${element === null || element === void 0 ? void 0 : element.depth}`) {
                    case '1':
                        title = element === null || element === void 0 ? void 0 : element.text;
                        break;
                    case '2':
                        const parsed = this.parseNotTitleHeading(list.slice(i, list.length + 1), dip, item);
                        preamble = (parsed === null || parsed === void 0 ? void 0 : parsed.preamble) || preamble;
                        dip = Object.assign(Object.assign({}, dip), parsed.dip);
                        isOnComponentSummary = parsed.isOnComponentSummary;
                        break;
                }
            }
            sectionsRaw.push(this.parseDipsNamesComponentsSubproposals(element, isOnComponentSummary));
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
    setSubproposalValue(dipName) {
        let acumulate = "";
        for (const item of dipName.split("c")) {
            if (item.includes("DIP")) {
                acumulate = acumulate + (item === null || item === void 0 ? void 0 : item.replace("DIP", ""));
            }
            else if (item.includes("SP")) {
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
    parsePreamble(preambleData, subproposal = false) {
        const preamble = {};
        let flag = true;
        preambleData.split("\n").forEach((preambleLine, idx, arr) => {
            if (!preambleLine.includes(":")) {
                return false;
            }
            const keyValue = [
                preambleLine.substring(0, preambleLine.indexOf(":")),
                preambleLine.substring(preambleLine.indexOf(":") + 1).trim()
            ];
            if (subproposal && flag && preambleLine.includes("-SP")) {
                const re = /[: #-]/gi;
                preamble.dipName = preambleLine === null || preambleLine === void 0 ? void 0 : preambleLine.replace(re, "");
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
                    preamble.extra = [...((preamble === null || preamble === void 0 ? void 0 : preamble.extra) || []), keyValue[1].trim()];
                    break;
                case "Type":
                    preamble.types = keyValue[1].trim();
                    break;
                case "Status":
                    const status = keyValue[1].trim();
                    if (status === "Request For Comments (RFC)" ||
                        status === "Request for Comments" ||
                        status === "Request for Comments (RFC)" ||
                        status === "Request for Comment (RFC)" ||
                        status === "RFC") {
                        preamble.status = "RFC";
                    }
                    else if (status === "Rejected (Failed Inclusion Poll July 2020)" ||
                        status === "Rejected") {
                        preamble.status = "Rejected";
                    }
                    else {
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
    async parseSections(file) {
        return this.markedService.markedLexer(file);
    }
    async updateSubproposalCountField() {
        try {
            const paginationQueryDto = {
                limit: 0,
                page: 0,
            };
            const filter = {
                equals: [{
                        field: "proposal",
                        value: "",
                    }],
            };
            const dips = await this.dipsService.findAll(paginationQueryDto, "", "", filter, "_id dipName proposal");
            const forLoop = async () => {
                for (let element of dips.items) {
                    const filterSubp = {
                        equals: [{
                                field: "proposal",
                                value: element.dipName,
                            }],
                    };
                    const subproposals = await this.dipsService.findAll(paginationQueryDto, "", "", filterSubp, "_id dipName proposal");
                    element.subproposalsCount = subproposals.total;
                    await this.dipsService.update(element._id, element);
                }
            };
            await forLoop();
        }
        catch (error) {
            this.logger.error(error);
        }
    }
};
ParseDIPsService = ParseDIPsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [simple_git_service_1.SimpleGitService,
        dips_service_1.DIPsService,
        config_1.ConfigService,
        github_service_1.GithubService,
        marked_service_1.MarkedService,
        pull_requests_service_1.PullRequestService])
], ParseDIPsService);
exports.ParseDIPsService = ParseDIPsService;
//# sourceMappingURL=parse-dips.service.js.map