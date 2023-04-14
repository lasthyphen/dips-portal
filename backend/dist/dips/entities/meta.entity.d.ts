import { Document } from 'mongoose';
export declare type MetaDocument = Meta & Document;
export declare class Meta {
    language: string;
    translations: string;
}
export declare const MetaSchema: import("mongoose").Schema<Document<Meta, any, any>, import("mongoose").Model<Document<Meta, any, any>, any, any>, undefined, {}>;
