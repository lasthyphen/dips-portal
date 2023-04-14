import { ConfigService } from "@nestjs/config";
import { PullResult, Response, SimpleGit } from "simple-git";
import { IGitFile } from "../interfaces/dips.interface";
import { Language } from "../entities/dips.entity";
import { MetaDocument } from "../entities/meta.entity";
import { Model } from "mongoose";
export declare class SimpleGitService {
    private readonly metaDocument;
    private configService;
    git: SimpleGit;
    private readonly logger;
    baseDir: string;
    constructor(metaDocument: Model<MetaDocument>, configService: ConfigService);
    cloneRepository(): Response<string>;
    pull(remote?: string, branch?: string): Promise<PullResult>;
    getFiles(): Promise<IGitFile[]>;
    getLanguage(filename: string): Language;
    saveMetaVars(): Promise<void>;
    getMetaVars(): Promise<MetaDocument[]>;
}
