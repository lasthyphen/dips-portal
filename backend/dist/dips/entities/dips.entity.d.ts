import { Document } from "mongoose";
export declare enum Language {
    English = "en",
    Spanish = "es"
}
export declare type DIPsDoc = DIP & Document;
export declare class Section {
    heading: string;
    depth: string;
    dipComponent?: string;
}
export declare class Reference {
    name: string;
    link: string;
}
export declare class Component {
    cName: string;
    cTitle: string;
    cBody: string;
}
export declare class DIP {
    file: string;
    filename: string;
    hash: string;
    language?: Language;
    dip?: number;
    dipName?: string;
    subproposal?: number;
    dipFather?: boolean;
    title?: string;
    extra?: string[];
    proposal?: string;
    author?: string[];
    contributors?: string[];
    tags?: string[];
    status?: string;
    types?: string;
    dateProposed?: string;
    dateRatified?: string;
    dependencies?: string[];
    replaces?: string;
    sentenceSummary?: string;
    paragraphSummary?: string;
    sections?: Section[];
    sectionsRaw?: string[];
    references?: Reference[];
    components?: Component[];
    subproposalsCount?: number;
    votingPortalLink?: string;
    forumLink?: string;
    dipCodeNumber?: string;
    sectionsRaw_plain?: string[];
    proposal_plain?: string;
    title_plain?: string;
    dipName_plain?: string;
    filename_plain?: string;
}
export declare class Dips {
    file: string;
    filename: string;
    hash: string;
    language?: Language;
    dip?: number;
    dipName?: string;
    subproposal?: number;
    dipFather?: boolean;
    title?: string;
    proposal?: string;
    author?: string[];
    contributors?: string[];
    tags?: string[];
    status?: string;
    types?: string;
    dateProposed?: string;
    dateRatified?: string;
    dependencies?: string[];
    replaces?: string;
    sentenceSummary?: string;
    paragraphSummary?: string;
    sections?: Section[];
    sectionsRaw?: string[];
    references?: Reference[];
    components?: Component[];
    subproposalsCount?: number;
    votingPortalLink?: string;
    forumLink?: string;
    dipCodeNumber?: string;
    sectionsRaw_plain?: string[];
    proposal_plain?: string;
    title_plain?: string;
    dipName_plain?: string;
    filename_plain?: string;
}
export declare class ErrorObject {
    statusCode?: number;
    message?: string;
    error?: string;
}
export declare class ErrorObjectModel {
    statusCode?: number;
    message?: string;
    error?: string;
}
export declare const DIPsSchema: import("mongoose").Schema<Document<DIP, any, any>, import("mongoose").Model<Document<DIP, any, any>, any, any>, undefined, {}>;
export declare const ErrorModelSchema: import("mongoose").Schema<Document<ErrorObject, any, any>, import("mongoose").Model<Document<ErrorObject, any, any>, any, any>, undefined, {}>;
