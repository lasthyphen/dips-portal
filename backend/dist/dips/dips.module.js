"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIPsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const dips_entity_1 = require("./entities/dips.entity");
const dips_controller_1 = require("./dips.controller");
const dips_service_1 = require("./services/dips.service");
const parse_dips_service_1 = require("./services/parse-dips.service");
const simple_git_service_1 = require("./services/simple-git.service");
const marked_service_1 = require("./services/marked.service");
const github_service_1 = require("./services/github.service");
const pull_request_entity_1 = require("./entities/pull-request.entity");
const pull_requests_service_1 = require("./services/pull-requests.service");
const dips_command_1 = require("./dips.command");
const parse_query_service_1 = require("./services/parse-query.service");
const meta_entity_1 = require("./entities/meta.entity");
let DIPsModule = class DIPsModule {
};
DIPsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: dips_entity_1.DIP.name,
                    collection: dips_entity_1.DIP.name,
                    useFactory: () => {
                        const schema = dips_entity_1.DIPsSchema;
                        return schema;
                    },
                },
                {
                    name: pull_request_entity_1.PullRequest.name,
                    collection: pull_request_entity_1.PullRequest.name,
                    useFactory: () => {
                        const schema = pull_request_entity_1.PullRequestSchema;
                        return schema;
                    },
                },
                {
                    name: meta_entity_1.Meta.name,
                    collection: meta_entity_1.Meta.name,
                    useFactory: () => {
                        const schema = meta_entity_1.MetaSchema;
                        return schema;
                    },
                },
            ]),
        ],
        controllers: [dips_controller_1.DIPsController],
        providers: [
            dips_service_1.DIPsService,
            simple_git_service_1.SimpleGitService,
            parse_dips_service_1.ParseDIPsService,
            parse_query_service_1.ParseQueryService,
            marked_service_1.MarkedService,
            github_service_1.GithubService,
            pull_requests_service_1.PullRequestService,
            dips_command_1.ParseDIPsCommand,
        ],
    })
], DIPsModule);
exports.DIPsModule = DIPsModule;
//# sourceMappingURL=dips.module.js.map