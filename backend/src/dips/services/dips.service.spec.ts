import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language } from "../entities/dips.entity";
import { DIPsModule } from "../dips.module";
import {
    andQueryMock,
    builtAndFilterMock,
    builtContainsFilterMock,
    builtEqualsFilterMock,
    builtFilterMock,
    builtInArrayFilterMock,
    builtNotContainsFilterMock,
    builtNotEqualFilterMock,
    countMock,
    deleteDipresult,
    fieldMock,
    fileNameMock,
    filtersMock,
    languageMock,
    limitMock,
    dipData,
    dipFilesMapMock,
    dipMock,
    dipNameMock,
    dipNumber_1,
    dipSearcheableMock,
    dipToBeSearcheableMock,
    orderMock,
    pageMock,
    parseMock,
    proposalMock,
    searchFieldMock,
    searchMock,
    selectMock,
    valueMock,
} from "./data-test/data";
import { DIPsService } from "./dips.service";
import { ParseQueryService } from "./parse-query.service";
const faker = require("faker");

describe("DIPsService", () => {
    let module: TestingModule;
    let dipsService: DIPsService;
    let mongoMemoryServer;
    let exec;
    let sort;
    let select;
    let find;
    let aggregate;
    let lean;
    let limit;
    let skip;
    let countDocuments;
    let execCount;
    let findOne;
    let selectOne;
    let execOne;
    let create;
    let insertMany;
    let cursor;
    let deleteMany;
    let dropDatabase;
    let findOneAndUpdate;
    let leanOne;
    let updateMany;
    let leanDelete;
    let deleteOne;

    beforeAll(async () => {
        mongoMemoryServer = await MongoMemoryServer.create();

        module = await Test.createTestingModule({
            imports: [
                DIPsModule,
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: async () => ({
                        uri: mongoMemoryServer.getUri(),
                        useCreateIndex: true,
                        useFindAndModify: false,
                    }),
                    inject: [ConfigService],
                }),
            ]
        }).compile();

        faker.seed('DIPsService');

        dipsService = module.get(DIPsService);
    });

    it("should be defined", () => {
        expect(dipsService).toBeDefined();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();

        execOne = jest.fn(async () => dipData);
        dropDatabase = jest.fn();
        exec = jest.fn(async () => [dipData]);
        deleteMany = jest.fn(async () => ({ ok: 1 }));
        execCount = jest.fn(async () => countMock);
        lean = jest.fn(() => ({ exec }));
        limit = jest.fn(() => ({ lean }));
        skip = jest.fn(() => ({ limit }));
        sort = jest.fn(() => ({
            exec,
            skip,
        }));
        cursor = jest.fn(() => [dipData]);
        select = jest.fn(() => ({ sort, exec, cursor }));
        selectOne = jest.fn(() => ({ exec: execOne }));
        find = jest.fn(() => ({ select, exec }));
        aggregate = jest.fn(async () => [dipData]);
        countDocuments = jest.fn(() => ({
            exec: execCount,
        }));
        findOne = jest.fn(() => ({ select: selectOne }));
        leanOne = jest.fn(async () => dipData);
        leanDelete = jest.fn(async () => deleteDipresult);
        create = jest.fn(async () => dipData);
        insertMany = jest.fn(async () => [dipData]);
        findOneAndUpdate = jest.fn(() => ({ lean: leanOne }));
        updateMany = jest.fn(() => ({ lean: leanOne }));
        deleteOne = jest.fn(() => ({ lean: leanDelete }));
        (dipsService as any).dipsDoc = {
            find,
            aggregate,
            countDocuments,
            findOne,
            create,
            insertMany,
            deleteMany,
            db: { dropDatabase },
            findOneAndUpdate,
            updateMany,
            deleteOne,
        };
        ParseQueryService.prototype.parse = jest.fn(() => Promise.resolve(parseMock));
    });

    jest.setTimeout(3 * 60 * 1000);

    describe('groupProposal', () => {
        it('group dips by proposal', async () => {
            const result = await dipsService.groupProposal();

            expect(result).toEqual([dipData]);
            expect(aggregate).toBeCalledTimes(1);
            expect(aggregate).toBeCalledWith([
                { $match: { proposal: { $ne: "" } } },
                { $group: { _id: "$proposal" } },
            ]);
        }
        );
    });

    describe('cleanSearchField', () => {
        it('clean search field', async () => {
            const result = dipsService.cleanSearchField("\n" + searchFieldMock);

            expect(result).toEqual(searchFieldMock);
        });
    });

    describe('searchAll', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'buildFilter')
                .mockReturnValue(Promise.resolve(builtFilterMock));
        });

        it('search all dips', async () => {
            const result = await dipsService.searchAll({
                paginationQuery: {
                    limit: +limitMock,
                    page: +pageMock,
                },
                order: orderMock,
                search: searchFieldMock,
                filter: filtersMock,
                select: selectMock,
                language: Language.Spanish,
            });

            expect(result).toEqual([dipData])
            expect(DIPsService.prototype.buildFilter).toBeCalledTimes(2);
            expect(DIPsService.prototype.buildFilter).toBeCalledWith(
                searchFieldMock,
                filtersMock,
                Language.Spanish
            );
            expect(DIPsService.prototype.buildFilter).toBeCalledWith(
                searchFieldMock,
                filtersMock,
                Language.English
            );
            expect(find).toBeCalledTimes(2);
            expect(find).toHaveBeenNthCalledWith(
                1,
                builtFilterMock,
            );
            expect(find).toHaveBeenNthCalledWith(
                2,
                builtFilterMock,
            );
            expect(select).toBeCalledTimes(2);
            expect(select).toHaveBeenNthCalledWith(
                1,
                selectMock,
            );
            expect(select).toHaveBeenNthCalledWith(
                2,
                selectMock,
            );
            expect(sort).toBeCalledTimes(2);
            expect(sort).toHaveBeenNthCalledWith(
                1,
                orderMock,
            );
            expect(sort).toHaveBeenNthCalledWith(
                2,
                orderMock,
            );
            expect(skip).toBeCalledTimes(2);
            expect(skip).toHaveBeenNthCalledWith(
                1,
                Number(pageMock) * Number(limitMock),
            );
            expect(skip).toHaveBeenNthCalledWith(
                2,
                Number(pageMock) * Number(limitMock),
            );
            expect(limit).toBeCalledTimes(2);
            expect(limit).toHaveBeenNthCalledWith(
                1,
                Number(limitMock),
            );
            expect(limit).toHaveBeenNthCalledWith(
                2,
                Number(limitMock),
            );
            expect(lean).toBeCalledTimes(2);
            expect(lean).toHaveBeenNthCalledWith(1);
            expect(lean).toHaveBeenNthCalledWith(2);
            expect(exec).toBeCalledTimes(2);
            expect(exec).toHaveBeenNthCalledWith(1);
            expect(exec).toHaveBeenNthCalledWith(2);
        });
    });

    describe('findAll', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'buildFilter')
                .mockReturnValue(Promise.resolve(builtFilterMock));
            jest.spyOn(DIPsService.prototype, 'searchAll')
                .mockReturnValueOnce(Promise.resolve([dipData]));
            jest.spyOn(DIPsService.prototype, 'cleanSearchField')
                .mockReturnValueOnce(searchFieldMock);
        });

        it('find dips with custom select attributes', async () => {
            const result = await dipsService.findAll(
                {
                    limit: +limitMock,
                    page: +pageMock,
                },
                orderMock,
                '\n' + searchFieldMock,
                filtersMock,
                selectMock,
                languageMock,
            );

            expect(result).toEqual({
                total: countMock,
                items: [dipData],
            });
            expect(DIPsService.prototype.buildFilter).toBeCalledTimes(1);
            expect(DIPsService.prototype.buildFilter).toBeCalledWith(
                searchFieldMock,
                filtersMock,
                Language.English,
            );
            expect(countDocuments).toBeCalledTimes(1);
            expect(countDocuments).toBeCalledWith(builtFilterMock);
            expect(execCount).toBeCalledTimes(1);
            expect(execCount).toBeCalledWith();
            expect(DIPsService.prototype.searchAll).toBeCalledTimes(1);
            expect(DIPsService.prototype.searchAll).toBeCalledWith({
                paginationQuery: {
                    limit: +limitMock,
                    page: +pageMock,
                },
                order: orderMock,
                search: searchFieldMock,
                filter: filtersMock,
                select: selectMock,
                language: languageMock,
            });
        });

        it('find dips with default select attributes', async () => {
            const result = await dipsService.findAll(
                {
                    limit: +limitMock,
                    page: +pageMock,
                },
                orderMock,
                '\n' + searchFieldMock,
                filtersMock,
                null,
                languageMock,
            );

            expect(result).toEqual({
                total: countMock,
                items: [dipData],
            });
            expect(DIPsService.prototype.buildFilter).toBeCalledTimes(1);
            expect(DIPsService.prototype.buildFilter).toBeCalledWith(
                searchFieldMock,
                filtersMock,
                Language.English,
            );
            expect(countDocuments).toBeCalledTimes(1);
            expect(countDocuments).toBeCalledWith(builtFilterMock);
            expect(execCount).toBeCalledTimes(1);
            expect(execCount).toBeCalledWith();
            expect(DIPsService.prototype.searchAll).toBeCalledTimes(1);
            expect(DIPsService.prototype.searchAll).toBeCalledWith({
                paginationQuery: {
                    limit: +limitMock,
                    page: +pageMock,
                },
                order: orderMock,
                search: searchFieldMock,
                filter: filtersMock,
                select: [
                    "-__v",
                    "-file",
                    "-sections",
                    "-sectionsRaw",
                    "-dipName_plain",
                    "-filename_plain",
                    "-proposal_plain",
                    "-title_plain",
                    "-sectionsRaw_plain",
                ],
                language: languageMock,
            });
        });
    });

    describe('findByProposal', () => {
        it("findByProposal", async () => {
            const proposal = faker.random.word();

            const result = await dipsService.findByProposal(proposal);

            expect(result).toEqual([dipData]);
            expect(find).toHaveBeenCalledTimes(1);
            expect(find).toHaveBeenCalledWith({
                proposal_plain: proposal,
                language: Language.English
            });
            expect(select).toHaveBeenCalledTimes(1);
            expect(select).toHaveBeenCalledWith([
                "title",
                "dipName"
            ]);
            expect(sort).toHaveBeenCalledTimes(1);
            expect(sort).toHaveBeenCalledWith("dip subproposal");
            expect(exec).toHaveBeenCalledTimes(1);
            expect(exec).toHaveBeenCalledWith();
        });
    });

    describe('buildContainFilters', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(DIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters with contain', async () => {
            const result = await (dipsService as any).buildContainFilters(
                filtersMock.contains
            );

            expect(result).toEqual(builtContainsFilterMock);
            expect(DIPsService.prototype.validField).toBeCalledTimes(1);
            expect(DIPsService.prototype.validField).toBeCalledWith(
                filtersMock.contains[0].field,
                filtersMock.contains[0].value,
            );
            expect(DIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(DIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.contains[0].field,
            );
        });
    });

    describe('buildEqualsFilters', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(DIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters with equals', async () => {
            const result = await (dipsService as any).buildEqualsFilters(
                filtersMock.equals
            );

            expect(result).toEqual(builtEqualsFilterMock);
            expect(DIPsService.prototype.validField).toBeCalledTimes(1);
            expect(DIPsService.prototype.validField).toBeCalledWith(
                filtersMock.equals[0].field,
                filtersMock.equals[0].value,
            );
            expect(DIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(DIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.equals[0].field,
            );
        });
    });

    describe('buildInArrayFilters', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'validField')
                .mockImplementation((_field, value) => value);
            jest.spyOn(DIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters with array of values', async () => {
            const result = await (dipsService as any).buildInArrayFilters(
                filtersMock.inarray
            );

            expect(result).toEqual(builtInArrayFilterMock);
            expect(DIPsService.prototype.validField).toBeCalledTimes(2);
            expect(DIPsService.prototype.validField).toHaveBeenNthCalledWith(
                1,
                filtersMock.inarray[0].field,
                filtersMock.inarray[0].value[0],
            );
            expect(DIPsService.prototype.validField).toHaveBeenNthCalledWith(
                2,
                filtersMock.inarray[0].field,
                filtersMock.inarray[0].value[1],
            );
            expect(DIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(DIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.inarray[0].field,
            );
        });
    });

    describe('buildNotContainFilters', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(DIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters which not contain', async () => {
            const result = await (dipsService as any).buildNotContainFilters(
                filtersMock.notcontains
            );

            expect(result).toEqual(builtNotContainsFilterMock);
            expect(DIPsService.prototype.validField).toBeCalledTimes(1);
            expect(DIPsService.prototype.validField).toBeCalledWith(
                filtersMock.notcontains[0].field,
                filtersMock.notcontains[0].value,
            );
            expect(DIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(DIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.notcontains[0].field,
            );
        });
    });

    describe('buildNotEqualsFilters', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(DIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters with not equals', async () => {
            const result = await (dipsService as any).buildNotEqualsFilters(
                filtersMock.notequals
            );

            expect(result).toEqual(builtNotEqualFilterMock);
            expect(DIPsService.prototype.validField).toBeCalledTimes(1);
            expect(DIPsService.prototype.validField).toBeCalledWith(
                filtersMock.notequals[0].field,
                filtersMock.notequals[0].value,
            );
            expect(DIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(DIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.notequals[0].field,
            );
        });
    });

    describe('buildFilter', () => {
        beforeEach(() => {
            jest.spyOn((DIPsService.prototype as any), 'buildContainFilters')
                .mockReturnValueOnce(builtContainsFilterMock);
            jest.spyOn((DIPsService.prototype as any), 'buildEqualsFilters')
                .mockReturnValueOnce(builtEqualsFilterMock);
            jest.spyOn((DIPsService.prototype as any), 'buildInArrayFilters')
                .mockReturnValueOnce(builtInArrayFilterMock);
            jest.spyOn((DIPsService.prototype as any), 'buildNotContainFilters')
                .mockReturnValueOnce(builtNotContainsFilterMock);
            jest.spyOn((DIPsService.prototype as any), 'buildNotEqualsFilters')
                .mockReturnValueOnce(builtNotEqualFilterMock);
            jest.spyOn((DIPsService.prototype as any), 'buildSmartMongoDBQuery')
                .mockReturnValueOnce(builtContainsFilterMock);
        });

        it('build filters and search with $', async () => {
            const result = await dipsService.buildFilter(
                '$' + searchMock,
                filtersMock,
            );

            expect(result).toEqual({
                $and: [{
                    ...builtContainsFilterMock,
                    ...builtEqualsFilterMock,
                    ...builtInArrayFilterMock,
                    ...builtNotContainsFilterMock,
                    ...builtNotEqualFilterMock,
                    ...builtContainsFilterMock,
                    language: Language.English,
                }],
            });
            expect((DIPsService.prototype as any).buildContainFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildContainFilters).toBeCalledWith(
                filtersMock.contains
            );
            expect((DIPsService.prototype as any).buildEqualsFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildEqualsFilters).toBeCalledWith(
                filtersMock.equals
            );
            expect((DIPsService.prototype as any).buildInArrayFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildInArrayFilters).toBeCalledWith(
                filtersMock.inarray
            );
            expect((DIPsService.prototype as any).buildNotContainFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildNotContainFilters).toBeCalledWith(
                filtersMock.notcontains
            );
            expect((DIPsService.prototype as any).buildNotEqualsFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildNotEqualsFilters).toBeCalledWith(
                filtersMock.notequals
            );
            expect(ParseQueryService.prototype.parse).toBeCalledTimes(1);
            expect(ParseQueryService.prototype.parse).toBeCalledWith(
                '$' + searchMock,
            );
            expect(DIPsService.prototype.buildSmartMongoDBQuery).toBeCalledTimes(1);
            expect(DIPsService.prototype.buildSmartMongoDBQuery).toBeCalledWith(
                parseMock,
            );
        });

        it('build filters and search without $', async () => {
            const result = await dipsService.buildFilter(
                searchMock,
                filtersMock,
                Language.Spanish,
            );

            expect(result).toEqual({
                ...builtContainsFilterMock,
                ...builtEqualsFilterMock,
                ...builtInArrayFilterMock,
                ...builtNotContainsFilterMock,
                ...builtNotEqualFilterMock,
                language: Language.Spanish,
                sectionsRaw_plain: {
                    $regex: new RegExp(`${searchMock}`),
                    $options: 'i',
                },
            });
            expect((DIPsService.prototype as any).buildContainFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildContainFilters).toBeCalledWith(
                filtersMock.contains
            );
            expect((DIPsService.prototype as any).buildEqualsFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildEqualsFilters).toBeCalledWith(
                filtersMock.equals
            );
            expect((DIPsService.prototype as any).buildInArrayFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildInArrayFilters).toBeCalledWith(
                filtersMock.inarray
            );
            expect((DIPsService.prototype as any).buildNotContainFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildNotContainFilters).toBeCalledWith(
                filtersMock.notcontains
            );
            expect((DIPsService.prototype as any).buildNotEqualsFilters).toBeCalledTimes(1);
            expect((DIPsService.prototype as any).buildNotEqualsFilters).toBeCalledWith(
                filtersMock.notequals
            );
            expect(ParseQueryService.prototype.parse).not.toBeCalledTimes(1);
            expect(DIPsService.prototype.buildSmartMongoDBQuery).not.toBeCalledTimes(1);
        });
    });

    describe('buildSmartMongoDBQuery', () => {
        it('build filter from query', async () => {
            const result = dipsService.buildSmartMongoDBQuery(andQueryMock);

            expect(result).toEqual(builtAndFilterMock);
        });

        it('query not supported', () => {
            try {
                dipsService.buildSmartMongoDBQuery(languageMock);
            } catch (error) {
                expect(error.message).toEqual('Database query not supportted');
            }
        })
    });

    describe('validField', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'escapeRegExp').mockReturnValueOnce(fieldMock);
        });

        it('status is valid', () => {
            const result = dipsService.validField('status', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('dipName is valid', () => {
            const result = dipsService.validField('dipName', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('filename is valid', () => {
            const result = dipsService.validField('filename', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('proposal is valid', () => {
            const result = dipsService.validField('proposal', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('dip is valid', () => {
            const result = dipsService.validField('dip', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('tags is valid', () => {
            const result = dipsService.validField('tags', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('contributors is valid', () => {
            const result = dipsService.validField('contributors', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('author is valid', () => {
            const result = dipsService.validField('author', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('dipFather is valid', () => {
            const result = dipsService.validField('dipFather', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('sectionsRaw is valid', () => {
            const result = dipsService.validField('sectionsRaw', valueMock);

            expect(result).toEqual(valueMock);
            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });

        it('title is valid', () => {
            const result = dipsService.validField('title', valueMock);

            expect(result).toEqual(fieldMock);
            expect(DIPsService.prototype.escapeRegExp).toBeCalledTimes(1);
            expect(DIPsService.prototype.escapeRegExp).toBeCalledWith(valueMock);
        });

        it('not valid field', () => {
            try {
                dipsService.validField(fieldMock, valueMock);
            } catch (error) {
                expect(error.message).toEqual(`Invalid filter field (${fieldMock})`);
            }

            expect(DIPsService.prototype.escapeRegExp).not.toBeCalled();
        });
    });

    describe('addSearcheableFields', () => {
        it('add searchable fields', () => {
            const result = dipsService.addSearcheableFields(dipToBeSearcheableMock);

            expect(result).toEqual(dipSearcheableMock);
        });
    });

    describe('searcheableField', () => {
        beforeEach(() => {
            jest.spyOn(DIPsService.prototype, 'escapeRegExp').mockReturnValueOnce(fieldMock);
        });

        it('dipName is valid', () => {
            const result = dipsService.searcheableField('dipName');

            expect(result).toEqual('dipName_plain');
        });

        it('filename is valid', () => {
            const result = dipsService.searcheableField('filename');

            expect(result).toEqual('filename_plain');
        });

        it('proposal is valid', () => {
            const result = dipsService.searcheableField('proposal');

            expect(result).toEqual('proposal_plain');
        });

        it('title is valid', () => {
            const result = dipsService.searcheableField('title');

            expect(result).toEqual('title_plain');
        });

        it('sectionsRaw is valid', () => {
            const result = dipsService.searcheableField('sectionsRaw');

            expect(result).toEqual('sectionsRaw_plain');
        });


        it('dip is valid', () => {
            const result = dipsService.searcheableField('dip');

            expect(result).toEqual('dip');
        });
    });

    describe('findOneByDipName', () => {
        it('find one by dipName', async () => {
            const result = await dipsService.findOneByDipName(dipNameMock, null);

            expect(result).toEqual(dipData);
            expect(findOne).toBeCalledTimes(1);
            expect(findOne).toBeCalledWith({
                language: Language.English,
                dipName_plain: dipNameMock,
            });
            expect(selectOne).toBeCalledTimes(1);
            expect(selectOne).toBeCalledWith([
                "-__v",
                "-file",
                "-dipName_plain",
                "-filename_plain",
                "-proposal_plain",
                "-title_plain",
                "-sectionsRaw_plain",
            ]);
            expect(execOne).toBeCalledTimes(1);
            expect(execOne).toBeCalledWith();
        });
    });

    describe('smartSearch', () => {
        it('search status', async () => {
            const result = await dipsService.smartSearch('status', valueMock, null);

            expect(result).toEqual([dipData]);
            expect(aggregate).toBeCalledTimes(1);
            expect(aggregate).toBeCalledWith([
                {
                    $match: {
                        status: {
                            $regex: new RegExp(`^${valueMock}`),
                            $options: "i",
                        },
                        language: Language.English,
                    },
                },
                {
                    $group: {
                        _id: { status: "$status" },
                        status: { $first: "$status" },
                    },
                },
                { $project: { _id: 0, status: "$status" } },
            ]);
        });

        it('search tags', async () => {
            const result = await dipsService.smartSearch('tags', valueMock, null);

            expect(result).toEqual([dipData]);
            expect(aggregate).toBeCalledTimes(1);
            expect(aggregate).toBeCalledWith([
                { $unwind: "$tags" },
                {
                    $match: {
                        tags: {
                            $regex: new RegExp(`^${valueMock}`),
                            $options: "i",
                        },
                        language: Language.English,
                    },
                },
                { $group: { _id: { tags: "$tags" }, tag: { $first: "$tags" } } },
                { $project: { _id: 0, tag: "$tag" } },
            ]);
        });

        it('invalid field', async () => {
            try {
                await dipsService.smartSearch(fieldMock, valueMock, null);
            } catch (error) {
                expect(error.message).toEqual(`Field ${fieldMock} invalid`);
            }

            expect(aggregate).not.toBeCalled();
        });
    });

    describe('findOneByFileName', () => {
        it('find one by fileName', async () => {
            const result = await dipsService.findOneByFileName(fileNameMock, null);

            expect(result).toEqual(dipData);
            expect(findOne).toBeCalledTimes(1);
            expect(findOne).toBeCalledWith({
                filename_plain: {
                    $regex: new RegExp(fileNameMock),
                    $options: "i",
                },
                language: Language.English,
            });
            expect(selectOne).toBeCalledTimes(1);
            expect(selectOne).toBeCalledWith([
                "-__v",
                "-file",
                "-dipName_plain",
                "-filename_plain",
                "-proposal_plain",
                "-title_plain",
                "-sectionsRaw_plain",
            ]);
            expect(execOne).toBeCalledTimes(1);
            expect(execOne).toBeCalledWith();
        });
    });

    describe('getSummaryByDipName', () => {
        it('get DIP by dip name', async () => {
            const result = await dipsService.getSummaryByDipName(dipNameMock, null);

            expect(result).toEqual(dipData);
            expect(findOne).toBeCalledTimes(1);
            expect(findOne).toBeCalledWith({
                dipName_plain: dipNameMock,
                language: Language.English,
            });
            expect(selectOne).toBeCalledTimes(1);
            expect(selectOne).toBeCalledWith([
                "sentenceSummary",
                "paragraphSummary",
                "title",
                "dipName",
            ]);
            expect(execOne).toBeCalledTimes(1);
            expect(execOne).toBeCalledWith();
        });
    });

    describe('getSummaryByDipComponent', () => {
        it('get DIP by dip component', async () => {
            const result = await dipsService.getSummaryByDipComponent(
                `DIP${dipNumber_1}`,
                null,
            );

            expect(result).toEqual(dipData);
            expect(findOne).toBeCalledTimes(1);
            expect(findOne).toBeCalledWith({
                dipName_plain: `DIP${dipNumber_1}`,
                language: Language.English,
            });
            expect(selectOne).toBeCalledTimes(1);
            expect(selectOne).toBeCalledWith({
                sentenceSummary: 1,
                paragraphSummary: 1,
                title: 1,
                dipName: 1,
                components: { $elemMatch: { cName: `DIP${dipNumber_1}` } },
            });
            expect(execOne).toBeCalledTimes(1);
            expect(execOne).toBeCalledWith();
        });
    });

    describe('findByProposal', () => {
        it('find DIP by proposal', async () => {
            const result = await dipsService.findByProposal(proposalMock, null);

            expect(result).toEqual([dipData]);
            expect(find).toBeCalledTimes(1);
            expect(find).toBeCalledWith({
                proposal_plain: proposalMock,
                language: Language.English,
            });
            expect(select).toBeCalledTimes(1);
            expect(select).toBeCalledWith([
                "title",
                "dipName",
            ]);
            expect(sort).toBeCalledTimes(1);
            expect(sort).toBeCalledWith("dip subproposal");
            expect(exec).toBeCalledTimes(1);
            expect(exec).toBeCalledWith();
        });
    });

    describe('create', () => {
        it('create DIP by proposal', async () => {
            jest.spyOn(DIPsService.prototype, 'addSearcheableFields')
                .mockReturnValueOnce(dipData);

            const result = await dipsService.create(dipData);

            expect(result).toEqual(dipData);
            expect(create).toBeCalledTimes(1);
            expect(create).toBeCalledWith(dipData);
            expect(DIPsService.prototype.addSearcheableFields).toBeCalledTimes(1);
            expect(DIPsService.prototype.addSearcheableFields).toBeCalledWith(dipData);
        });
    });

    describe('insertMany', () => {
        it('insert many DIPs', async () => {
            jest.spyOn(DIPsService.prototype, 'addSearcheableFields')
                .mockReturnValueOnce(dipData);

            const result = await dipsService.insertMany([dipData]);

            expect(result).toEqual([dipData]);
            expect(DIPsService.prototype.addSearcheableFields).toBeCalledTimes(1);
            expect(DIPsService.prototype.addSearcheableFields).toBeCalledWith(dipData);
            expect(insertMany).toBeCalledTimes(1);
            expect(insertMany).toBeCalledWith([dipData]);
        });
    });

    describe('getAll', () => {
        it('get all DIPs', async () => {
            const result = await dipsService.getAll();

            expect(result).toEqual(dipFilesMapMock);
            expect(find).toBeCalledTimes(1);
            expect(find).toBeCalledWith([{
                $sort: { filename: 1 },
            }]);
            expect(select).toBeCalledTimes(1);
            expect(select).toBeCalledWith([
                "hash",
                "filename",
            ]);
            expect(cursor).toBeCalledTimes(1);
            expect(cursor).toBeCalledWith();
        });
    });

    describe('deleteManyByIds', () => {
        it('delete many DIPs by ids', async () => {
            await dipsService.deleteManyByIds([dipMock._id]);

            expect(deleteMany).toBeCalledTimes(1);
            expect(deleteMany).toBeCalledWith({
                _id: { $in: [dipMock._id] },
            });
        });
    });

    describe('dropDatabase', () => {
        it('drop database', async () => {
            await dipsService.dropDatabase();

            expect(dropDatabase).toBeCalledTimes(1);
            expect(dropDatabase).toBeCalledWith();
        });
    });

    describe('update', () => {
        it('update DIP', async () => {
            jest.spyOn(DIPsService.prototype, 'addSearcheableFields')
                .mockReturnValueOnce(dipSearcheableMock);
                
            const result = await dipsService.update(dipMock._id, dipToBeSearcheableMock);

            expect(result).toEqual(dipData);
            expect(DIPsService.prototype.addSearcheableFields).toBeCalledTimes(1);
            expect(DIPsService.prototype.addSearcheableFields).toBeCalledWith(dipToBeSearcheableMock);
            expect(findOneAndUpdate).toBeCalledTimes(1);
            expect(findOneAndUpdate).toBeCalledWith(
                { _id: dipMock._id },
                { $set: dipSearcheableMock },
                { new: true, useFindAndModify: false }
            );
            expect(leanOne).toBeCalledTimes(1);
            expect(leanOne).toBeCalledWith(true);
        });
    });

    describe('setDipsFather', () => {
        it('set DIP father', async () => {
            const result = await dipsService.setDipsFather([dipMock._id]);

            expect(result).toEqual(dipData);
            expect(updateMany).toBeCalledTimes(1);
            expect(updateMany).toBeCalledWith(
                { dipName: { $in: [dipMock._id] } },
                { $set: { dipFather: true } },
                { new: true, useFindAndModify: false }
            );
            expect(leanOne).toBeCalledTimes(1);
            expect(leanOne).toBeCalledWith(true);
        });
    });

    describe('remove', () => {
        it('remove DIP', async () => {
            const result = await dipsService.remove(dipMock._id);

            expect(result).toEqual(deleteDipresult);
            expect(deleteOne).toBeCalledTimes(1);
            expect(deleteOne).toBeCalledWith({ _id: dipMock._id });
            expect(leanDelete).toBeCalledTimes(1);
            expect(leanDelete).toBeCalledWith(true);
        });
    });

    describe('getDipLanguagesAvailables', () => {
        it('get DIP languages availables', async () => {
            const result = await dipsService.getDipLanguagesAvailables(dipNameMock);

            expect(result).toEqual([dipData]);
            expect(find).toBeCalledTimes(1);
            expect(find).toBeCalledWith(
                { dipName: dipNameMock },
                "dipName language",
            );
            expect(exec).toBeCalledTimes(1);
            expect(exec).toBeCalledWith();
        });
    });

    describe('escapeRegExp', () => {
        it('escape RegExp', () => {
            const result = dipsService.escapeRegExp(`${dipNameMock}?`);

            expect(result).toEqual(`${dipNameMock}\\?`);
        });
    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});