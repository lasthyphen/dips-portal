import { Model } from "mongoose";
import { Filters, PaginationQueryDto } from "../dto/query.dto";
import { Language, DIP, DIPsDoc } from "../entities/dips.entity";
import { IGitFile, IDIPs } from "../interfaces/dips.interface";
import { ParseQueryService } from "./parse-query.service";
export declare class DIPsService {
    private readonly dipsDoc;
    private readonly parseQueryService;
    constructor(dipsDoc: Model<DIPsDoc>, parseQueryService: ParseQueryService);
    groupProposal(): Promise<any>;
    cleanSearchField(search: string): string;
    searchAll({ paginationQuery, order, search, filter, select, language, }: {
        paginationQuery: any;
        order: any;
        search: any;
        filter: any;
        select: any;
        language: any;
    }): any;
    findAll(paginationQuery?: PaginationQueryDto, order?: string, search?: string, filter?: Filters, select?: string, language?: Language): Promise<any>;
    private buildContainFilters;
    private buildEqualsFilters;
    private buildInArrayFilters;
    private buildNotContainFilters;
    private buildNotEqualsFilters;
    buildFilter(searchText: string, filter?: Filters, language?: Language): Promise<any>;
    buildSmartMongoDBQuery(ast: any): any;
    validField(field: string, value: any): any;
    addSearcheableFields(item: any): any;
    searcheableField(field: string): string;
    findOneByDipName(dipName: string, language: Language): Promise<DIP>;
    smartSearch(field: string, value: string, language: Language): Promise<DIP[]>;
    findOneByFileName(filename: string, language: Language): Promise<DIP>;
    getSummaryByDipName(dipName: string, language: Language): Promise<DIP>;
    getSummaryByDipComponent(dipComponent: string, language: Language): Promise<DIP>;
    findByProposal(proposal: string, language?: Language): Promise<DIP[]>;
    create(dIPs: IDIPs): Promise<DIP>;
    insertMany(dips: DIP[] | any): Promise<any>;
    getAll(): Promise<Map<string, IGitFile>>;
    deleteManyByIds(ids: string[]): Promise<void>;
    dropDatabase(): Promise<void>;
    update(id: string, dIPs: DIP): Promise<DIP>;
    setDipsFather(dips: string[]): Promise<any>;
    remove(id: string): Promise<{
        n: number;
        ok: number;
        deletedCount: number;
    }>;
    getDipLanguagesAvailables(dipName: string): Promise<any>;
    escapeRegExp(input: string): string;
}