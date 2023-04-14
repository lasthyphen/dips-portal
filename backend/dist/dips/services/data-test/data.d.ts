import { Filters } from "@app/dips/dto/query.dto";
import { Component, Language, DIP, Reference } from "@app/dips/entities/dips.entity";
import { IGitFile, IPreamble, ISynchronizeData } from "@app/dips/interfaces/dips.interface";
import { RequestDocument } from "graphql-request";
import { PullResult } from "simple-git";
export declare const dipNumber_1: any;
export declare const dipNumber_2: any;
export declare const paragraphSummaryMock: string;
export declare const authorMock: string[];
export declare const contributorsMock: string[];
export declare const dateProposedMock: string;
export declare const dateRatifiedMock: string;
export declare const dependenciesMock: string[];
export declare const votingPortalLinkMock: string;
export declare const replacesMock: string;
export declare const statusMock: string;
export declare const titleMock: string;
export declare const typesMock: string;
export declare const forumLinkMock: string;
export declare const tagsMock: string;
export declare const extraMock: string;
export declare const errorDropMock: string;
export declare const tagsMock_1: string;
export declare const tagsMock_2: string;
export declare const tagsMock_3: string;
export declare const limitMock: string;
export declare const pageMock: string;
export declare const orderMock: string;
export declare const selectMock: string;
export declare const languageMock: Language;
export declare const searchMock: string;
export declare const fieldMock: string;
export declare const valueMock: string;
export declare const filtersMock: Filters;
export declare const metaVarsMock: {
    language: string;
    translations: string;
}[];
export declare const pullRequestMock: {
    name: any;
};
export declare const dipNameMock: string;
export declare const parseResultMock: boolean;
export declare const requestCallBackMock: {
    headers: {
        "x-hub-signature": any;
    };
    body: {
        field: any;
    };
};
export declare const requestCallBackNotHeaderMock: {
    headers: {};
    body: {
        field: any;
    };
};
export declare const searchFieldMock: string;
export declare const parseMock: string;
export declare const builtFilterMock: {
    [x: string]: Language | {
        $regex: RegExp;
        $options: string;
    };
    language: Language;
};
export declare const builtContainsFilterMock: {
    [x: string]: {
        $regex: RegExp;
        $options: string;
    };
};
export declare const builtEqualsFilterMock: {
    [x: string]: string;
};
export declare const builtInArrayFilterMock: {
    [x: string]: {
        $in: string[];
    };
};
export declare const builtNotContainsFilterMock: {
    [x: string]: {
        $not: {
            $regex: RegExp;
            $options: string;
        };
    };
};
export declare const builtNotEqualFilterMock: {
    [x: string]: {
        $ne: string;
    };
};
export declare const tagMock: string;
export declare const tagsQueryMock: {
    type: string;
    name: string;
};
export declare const builtTagFilterMock: {
    tags: {
        $in: string[];
    };
};
export declare const statusQueryMock: {
    type: string;
    name: string;
};
export declare const builtStatusFilterMock: {
    status: {
        $regex: RegExp;
        $options: string;
    };
};
export declare const orQueryMock: {
    type: string;
    op: string;
    left: {
        type: string;
        name: string;
    }[];
};
export declare const builtOrFilterMock: {
    $or: ({
        tags: {
            $in: string[];
        };
    } | {
        status: {
            $regex: RegExp;
            $options: string;
        };
    })[];
};
export declare const notTagQueryMock: {
    type: string;
    op: string;
    left: string;
};
export declare const builtNotTagFilterMock: {
    tags: {
        $nin: string[];
    };
};
export declare const notStatusQuery: {
    type: string;
    op: string;
    left: string;
};
export declare const builtNotStatusFilterMock: {
    status: {
        $not: {
            $regex: RegExp;
            $options: string;
        };
    };
};
export declare const andQueryMock: {
    type: string;
    op: string;
    left: ({
        type: string;
        op: string;
        left: {
            type: string;
            name: string;
        }[];
    } | {
        type: string;
        op: string;
        left: string;
    })[];
};
export declare const builtAndFilterMock: {
    $and: ({
        $or: ({
            tags: {
                $in: string[];
            };
        } | {
            status: {
                $regex: RegExp;
                $options: string;
            };
        })[];
    } | {
        tags: {
            $nin: string[];
        };
    } | {
        status: {
            $not: {
                $regex: RegExp;
                $options: string;
            };
        };
    })[];
};
export declare const dipToBeSearcheableMock: DIP;
export declare const dipSearcheableMock: DIP;
export declare const fileNameMock: string;
export declare const proposalMock: string;
export declare const deleteDipresult: {
    n: any;
    ok: any;
    deletedCount: any;
};
export declare const countPullRequestMock: number;
export declare const insertManyMock: boolean;
export declare const cloneMessageMock: string;
export declare const pullMock: PullResult;
export declare const pullErrorMock: string;
export declare const hashMock: string;
export declare const rawResultMock: string;
export declare const longerRawResultMock: string;
export declare const getFilesResultMock: {
    filename: string;
    hash: string;
    language: Language;
}[];
export declare const getLongerFilesResultMock: {
    filename: string;
    hash: string;
    language: Language;
}[];
export declare const languageFileNameMock: string;
export declare const readFileResultMock: string;
export declare const translationMetaVarsMock: {
    language: Language;
    translations: string;
}[];
export declare const errorReadFileMock: string;
export declare const dipMock: {
    filename: any;
    hash: any;
    language: any;
    file: any;
    _id: any;
};
export declare const synchronizeDataMock: ISynchronizeData;
export declare const gitFileMock: IGitFile;
export declare const dipMapMock: Map<string, IGitFile>;
export declare const mapKeyMock: string;
export declare const edgesMock: string;
export declare const totalCountMock: number;
export declare const countMock: number;
export declare const headingOutComponentSummaryParsed: string;
export declare const componentSummaryParsed: string;
export declare const componentSummaryParsed_1: string;
export declare const titleParsed: string;
export declare const filesGitMock: IGitFile[];
export declare const dipWithoutNameMock: {
    dip: any;
    dipName: any;
    filename: any;
    hash: any;
    language: any;
    file: any;
    _id: any;
};
export declare const referenceMock: Reference;
export declare const sectionNameMock: string;
export declare const markedListMock: any[];
export declare const parseStringMock: string;
export declare const openIssuemock: string;
export declare const components: Component[];
export declare const componentSummary: string;
export declare const dipFile: string;
export declare const dipData: {
    hash: any;
    file: string;
    filename: string;
    sentenceSummary: string;
    paragraphSummary: string;
    author: string[];
    contributors: string[];
    dateProposed: string;
    dateRatified: string;
    dependencies: string[];
    dip: any;
    replaces: string;
    status: string;
    title: string;
    types: string;
    votingPortalLink: string;
    forumLink: string;
    tags: string[];
};
export declare const preambleMock: IPreamble;
export declare const errorUpdateMock: string;
export declare const dipData_2: DIP;
export declare const tagResultMock: {
    tag: string;
};
export declare const statusResultMock: {
    status: string;
};
export declare const smartSearchFieldMock: string;
export declare const markedMock: string;
export declare const markedLexerMock: any[];
export declare const requestGraphql: string;
export declare const pullRequestsMock: RequestDocument;
export declare const openIssueTitleMock: string;
export declare const openIssueBodyMock: string;
export declare const dipFilesMapMock: Map<any, any>;
