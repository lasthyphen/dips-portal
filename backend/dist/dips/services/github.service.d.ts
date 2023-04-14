import { ConfigService } from "@nestjs/config";
import { GraphQLClient, RequestDocument } from "graphql-request";
export declare class GithubService {
    private configService;
    graphQLClient: GraphQLClient;
    githubRepository: string;
    githubRepositoryOwner: string;
    githubRepositoryId: string;
    private readonly logger;
    constructor(configService: ConfigService);
    pullRequests(pullRequests: RequestDocument, after?: string): Promise<any>;
    pullRequestsLast(pullRequestsLast: any, last: number): Promise<any>;
    openIssue(openIssue: any, title: string, body: string): Promise<any>;
}
