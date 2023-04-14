export declare class PaginationQueryDto {
    limit: number;
    page: number;
}
export declare class Filters {
    contains?: BinaryOperator[];
    notcontains?: BinaryOperator[];
    equals?: BinaryOperator[];
    notequals?: BinaryOperator[];
    inarray?: BinaryArrayOperator[];
}
export declare class BinaryOperator {
    field: string;
    value: string;
}
export declare class BinaryArrayOperator {
    field: string;
    value: string[];
}
