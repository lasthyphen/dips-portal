import { ConfigService } from "@nestjs/config";
import { DIPsService } from "./services/dips.service";
import { ParseDIPsService } from "./services/parse-dips.service";
import { PullRequestService } from "./services/pull-requests.service";
import { Filters } from "./dto/query.dto";
import { Language } from "./entities/dips.entity";
import { SimpleGitService } from "./services/simple-git.service";
export declare class DIPsController {
    private dipsService;
    private parseDIPsService;
    private pullRequestService;
    private simpleGitService;
    private configService;
    constructor(dipsService: DIPsService, parseDIPsService: ParseDIPsService, pullRequestService: PullRequestService, simpleGitService: SimpleGitService, configService: ConfigService);
    findAll(limit?: string, page?: string, order?: string, select?: string, lang?: Language, search?: string, filter?: Filters): Promise<any>;
    findOneByDipName(dipName: string, lang?: Language): Promise<{
        dip: import("./entities/dips.entity").DIP;
        pullRequests: any;
        subproposals: any[];
        languagesAvailables: any;
        metaVars: import("./entities/meta.entity").MetaDocument[];
    }>;
    smartSearch(field: string, value: string, lang?: Language): Promise<import("./entities/dips.entity").DIP[]>;
    findOneBy(field: string, value: string, lang?: Language): Promise<any>;
    callback({ headers, body }: any): Promise<boolean>;
}
