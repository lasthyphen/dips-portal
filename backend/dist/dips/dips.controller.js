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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIPsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const dips_service_1 = require("./services/dips.service");
const parse_dips_service_1 = require("./services/parse-dips.service");
const pull_requests_service_1 = require("./services/pull-requests.service");
const env_1 = require("../env");
const query_dto_1 = require("./dto/query.dto");
const dips_entity_1 = require("./entities/dips.entity");
const simple_git_service_1 = require("./services/simple-git.service");
let DIPsController = class DIPsController {
    constructor(dipsService, parseDIPsService, pullRequestService, simpleGitService, configService) {
        this.dipsService = dipsService;
        this.parseDIPsService = parseDIPsService;
        this.pullRequestService = pullRequestService;
        this.simpleGitService = simpleGitService;
        this.configService = configService;
    }
    async findAll(limit, page, order, select, lang, search, filter) {
        try {
            const paginationQueryDto = {
                limit: +limit || 10,
                page: +page,
            };
            return await this.dipsService.findAll(paginationQueryDto, order, search, filter, select, lang);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOneByDipName(dipName, lang) {
        let dip = await this.dipsService.findOneByDipName(dipName, lang);
        if (!dip) {
            dip = await this.dipsService.findOneByDipName(dipName, dips_entity_1.Language.English);
            if (!dip) {
                throw new common_1.NotFoundException(`DIPs with name ${dipName} not found`);
            }
        }
        let subproposals = [];
        if (!dip.proposal) {
            subproposals = await this.dipsService.findByProposal(dip.dipName);
        }
        try {
            const pullRequests = await this.pullRequestService.aggregate(dip.filename);
            const languagesAvailables = await this.dipsService.getDipLanguagesAvailables(dipName);
            const metaVars = await this.simpleGitService.getMetaVars();
            return { dip, pullRequests, subproposals, languagesAvailables, metaVars };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async smartSearch(field, value, lang) {
        try {
            return await this.dipsService.smartSearch(field, value, lang);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOneBy(field, value, lang) {
        let dip;
        switch (field) {
            case "filename":
                dip = await this.dipsService.findOneByFileName(value, lang);
                if (!dip && (!lang || lang !== dips_entity_1.Language.English)) {
                    dip = await this.dipsService.findOneByFileName(value, dips_entity_1.Language.English);
                    if (!dip) {
                        throw new common_1.NotFoundException(`DIP with ${field} ${value} not found`);
                    }
                }
                return dip;
            case "dipName":
            case "dipSubproposal":
                dip = await this.dipsService.getSummaryByDipName(value, lang);
                if (!dip && (!lang || lang !== dips_entity_1.Language.English)) {
                    dip = await this.dipsService.getSummaryByDipName(value, dips_entity_1.Language.English);
                    if (!dip) {
                        throw new common_1.NotFoundException(`DIP with ${field} ${value} not found`);
                    }
                }
                return dip;
            case "dipComponent":
                if (!value.match(/DIP\d+[ac]\d+/gi)) {
                    throw new common_1.NotFoundException(`DIP component not in the standard format, i.e. DIP10c5`);
                }
                dip = await this.dipsService.getSummaryByDipComponent(value, lang);
                if (!dip || dip.components.length !== 1
                    && (!lang || lang !== dips_entity_1.Language.English)) {
                    dip = await this.dipsService.getSummaryByDipComponent(value, dips_entity_1.Language.English);
                    if (!dip || dip.components.length !== 1) {
                        throw new common_1.NotFoundException(`DIP with ${field} ${value} not found`);
                    }
                }
                return dip;
            default:
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: `Field ${field} not found`,
                }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async callback({ headers, body }) {
        try {
            const secretToken = this.configService.get(env_1.Env.WebhooksSecretToken);
            const hmac = crypto.createHmac("sha1", secretToken);
            const selfSignature = hmac.update(JSON.stringify(body)).digest("hex");
            const comparisonSignature = `sha1=${selfSignature}`;
            const signature = headers["x-hub-signature"];
            if (!signature) {
                return false;
            }
            const source = Buffer.from(signature);
            const comparison = Buffer.from(comparisonSignature);
            if (!crypto.timingSafeEqual(source, comparison)) {
                return false;
            }
            this.parseDIPsService.loggerMessage("Webhooks works");
            return this.parseDIPsService.parse();
        }
        catch (error) {
            this.parseDIPsService.loggerMessage("Webhooks ERROR");
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Get)("findall"),
    (0, swagger_1.ApiOperation)({
        summary: "Find all dips",
        description: "This is return array of dips by the custom params defined (limite, page, order, select, lang, search, filter).",
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Limit per page, default value 10",
        type: Number,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "page",
        description: "Page, default value equal to zero",
        type: Number,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "order",
        description: `Fields the dips will be ordered by, i.e. 'title -dip', means: order property title ASC and dip DESC`,
        type: String,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "select",
        description: `Select files to get output`,
        type: String,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "lang",
        description: `Lang selected for the files to return. If file language not found, it default to english version`,
        enum: dips_entity_1.Language,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "search",
        description: 'The search field treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes (") that specifies a phrase',
        type: String,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "filter",
        description: "Filter field with various filter patterns. (contains, notcontains, equals, notequals, inarray)",
        required: false,
        type: 'object',
        schema: {
            type: 'object',
            example: {
                filter: {
                    contains: [{ field: "", value: "" }],
                    notcontains: [{ field: "", value: "" }],
                    equals: [{ field: "dip", value: -1 }],
                    notequals: [{ field: "dip", value: -1 }],
                    inarray: [{ field: "dipName", value: ["DIP0", "DIP1", "DIP2", "DIP3", "DIP4", "DIP5"] }],
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: [dips_entity_1.Dips],
        status: 200,
        description: "successful operation",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        type: dips_entity_1.ErrorObjectModel,
        description: "Semantic error, for instance when a given dip is not found",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bad request" }),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("order")),
    __param(3, (0, common_1.Query)("select")),
    __param(4, (0, common_1.Query)("lang")),
    __param(5, (0, common_1.Query)("search")),
    __param(6, (0, common_1.Query)("filter")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, query_dto_1.Filters]),
    __metadata("design:returntype", Promise)
], DIPsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("findone"),
    (0, swagger_1.ApiOperation)({
        summary: "Find one dip",
        description: "This is return a dip by name (dipName parameter)",
    }),
    (0, swagger_1.ApiQuery)({
        name: "lang",
        description: `Lang selected for the file to return. If file language not found, it default to english version`,
        enum: dips_entity_1.Language,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "dipName",
        description: `Dip name you want looking for`,
        type: String,
        required: false,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        status: 200,
        type: dips_entity_1.Dips,
        description: "successful operation",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        type: dips_entity_1.ErrorObjectModel,
        description: "Semantic error, for instance when a given dip is not found",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bad request" }),
    __param(0, (0, common_1.Query)("dipName")),
    __param(1, (0, common_1.Query)("lang")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DIPsController.prototype, "findOneByDipName", null);
__decorate([
    (0, common_1.Get)("smart-search"),
    (0, swagger_1.ApiOperation)({
        summary: "Find array dips match with parameters",
        description: "This is return a array of dips. You can search by ```tags``` and ```status```",
    }),
    (0, swagger_1.ApiQuery)({
        type: String,
        name: "field",
        description: "Field the smart search is execute by. You can use tags or status",
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        type: String,
        name: "value",
        description: "Value to execute the smart search",
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: "lang",
        description: `Lang selected for the files to return. If file language not found, it default to english version`,
        enum: dips_entity_1.Language,
        required: false,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: [dips_entity_1.Dips],
        status: 200,
        description: "successful operation",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        type: dips_entity_1.ErrorObjectModel,
        description: "Semantic error, for instance when a given dip is not found",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bad request" }),
    __param(0, (0, common_1.Query)("field")),
    __param(1, (0, common_1.Query)("value")),
    __param(2, (0, common_1.Query)("lang")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DIPsController.prototype, "smartSearch", null);
__decorate([
    (0, common_1.Get)("findone-by"),
    (0, swagger_1.ApiOperation)({
        summary: "Find one dip that match with parameters ",
        description: `Search by different types of field example  (field: filename , value:dip1 ) return dip
  `,
    }),
    (0, swagger_1.ApiQuery)({
        type: String,
        name: "field",
        description: 'Field the search is execute by.',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        type: String,
        name: "value",
        description: 'Value to execute the search',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: "lang",
        description: `Lang selected for the files to return. If file language not found, it default to english version`,
        enum: dips_entity_1.Language,
        required: false,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: dips_entity_1.Dips,
        status: 200,
        description: "successful operation",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        type: dips_entity_1.ErrorObjectModel,
        description: "Semantic error, for instance when a given dip is not found",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bad request" }),
    __param(0, (0, common_1.Query)("field")),
    __param(1, (0, common_1.Query)("value")),
    __param(2, (0, common_1.Query)("lang")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DIPsController.prototype, "findOneBy", null);
__decorate([
    (0, common_1.Post)("callback"),
    (0, swagger_1.ApiOperation)({
        summary: "Call back to check the hash ",
        description: "This call back to check that the hash is correct signed",
    }),
    (0, swagger_1.ApiQuery)({
        name: "headers",
        description: 'Headers to check the hash. x-hub-signature is needed',
        type: 'object',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: "body",
        description: 'Callback body to check the hash',
        type: 'object',
        required: true,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: Boolean,
        status: 200,
        description: "successful operation",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        type: dips_entity_1.ErrorObjectModel,
        description: "Semantic error, for instance when a given dip is not found",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bad request" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DIPsController.prototype, "callback", null);
DIPsController = __decorate([
    (0, common_1.Controller)("dips"),
    (0, swagger_1.ApiTags)("dips"),
    __metadata("design:paramtypes", [dips_service_1.DIPsService,
        parse_dips_service_1.ParseDIPsService,
        pull_requests_service_1.PullRequestService,
        simple_git_service_1.SimpleGitService,
        config_1.ConfigService])
], DIPsController);
exports.DIPsController = DIPsController;
//# sourceMappingURL=dips.controller.js.map