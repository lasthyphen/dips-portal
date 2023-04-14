import { ParseDIPsService } from "./services/parse-dips.service";
import { DIPsService } from "./services/dips.service";
export declare class ParseDIPsCommand {
    private readonly parseDIPsService;
    private readonly dipsService;
    constructor(parseDIPsService: ParseDIPsService, dipsService: DIPsService);
    drop(): Promise<void>;
    parse(): Promise<void>;
    dropUp(): Promise<void>;
}
