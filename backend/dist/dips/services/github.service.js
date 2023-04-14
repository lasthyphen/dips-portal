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
var GithubService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubService = void 0;
const env_1 = require("../../env");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_request_1 = require("graphql-request");
let GithubService = GithubService_1 = class GithubService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GithubService_1.name);
        const endpoint = this.configService.get(env_1.Env.GithubUrlApiEndpoint);
        const token = this.configService.get(env_1.Env.GitAccessApiToken);
        this.githubRepository = this.configService.get(env_1.Env.GithubRepository);
        this.githubRepositoryOwner = this.configService.get(env_1.Env.GithubRepositoryOwner);
        this.githubRepositoryId = this.configService.get(env_1.Env.GithubRepositoryId);
        this.graphQLClient = new graphql_request_1.GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }
    async pullRequests(pullRequests, after) {
        return this.graphQLClient.request(pullRequests, {
            name: this.githubRepository,
            owner: this.githubRepositoryOwner,
            after,
        });
    }
    async pullRequestsLast(pullRequestsLast, last) {
        return this.graphQLClient.request(pullRequestsLast, {
            name: this.githubRepository,
            owner: this.githubRepositoryOwner,
            last,
        });
    }
    async openIssue(openIssue, title, body) {
        return this.graphQLClient.request(openIssue, {
            repositoryId: this.githubRepositoryId,
            title,
            body,
        });
    }
};
GithubService = GithubService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GithubService);
exports.GithubService = GithubService;
//# sourceMappingURL=github.service.js.map