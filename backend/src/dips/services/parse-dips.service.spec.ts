import { Env } from "@app/env";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { readFile } from "fs/promises";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  openIssue,
  pullRequests,
  pullRequestsAfter,
  pullRequestsCount,
  pullRequestsLast
} from "../graphql/definitions.graphql";
import { DIPsModule } from "../dips.module";
import {
  components,
  componentSummary,
  countMock,
  edgesMock,
  gitFileMock,
  titleParsed,
  componentSummaryParsed,
  dipData_2,
  dipFile,
  dipMapMock,
  dipMock,
  synchronizeDataMock,
  totalCountMock,
  headingOutComponentSummaryParsed,
  dipWithoutNameMock,
  filesGitMock,
  mapKeyMock,
  referenceMock,
  preambleMock,
  paragraphSummaryMock,
  dipNumber_2,
  markedListMock,
  dipNumber_1,
  sectionNameMock,
  authorMock,
  contributorsMock,
  dateProposedMock,
  dateRatifiedMock,
  dependenciesMock,
  titleMock,
  statusMock,
  replacesMock,
  typesMock,
  votingPortalLinkMock,
  forumLinkMock,
  tagsMock,
  openIssuemock,
  extraMock,
  errorUpdateMock,
  componentSummaryParsed_1,
} from "./data-test/data";
import { GithubService } from "./github.service";
import { MarkedService } from "./marked.service";
import { DIPsService } from "./dips.service";
import { ParseDIPsService } from "./parse-dips.service";
import { PullRequestService } from "./pull-requests.service";
import { SimpleGitService } from "./simple-git.service";
const marked = require("marked");
const faker = require("faker");

jest.mock("fs/promises", () => {
  return {
    readFile: jest.fn(() => 'test')
  };
});

describe("ParseDIPsService", () => {
  let service: ParseDIPsService;
  let configService: ConfigService;
  let module: TestingModule;
  let mongoMemoryServer;

  let countPreambleDefined = 2;

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

    faker.seed('ParseDIPsService');

    service = module.get<ParseDIPsService>(ParseDIPsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    SimpleGitService.prototype.pull = jest.fn(() => null);
    SimpleGitService.prototype.getFiles = jest.fn(() => Promise.resolve([gitFileMock]));
    DIPsService.prototype.getAll = jest.fn(() => Promise.resolve(dipMapMock));
    PullRequestService.prototype.count = jest.fn(() => Promise.resolve(countMock));
    GithubService.prototype.pullRequests = jest.fn(() => Promise.resolve({
      repository: {
        pullRequests: {
          totalCount: totalCountMock,
        }
      }
    }));
    GithubService.prototype.pullRequestsLast = jest.fn(() => Promise.resolve({
      repository: {
        pullRequests: {
          nodes: {
            edges: [edgesMock]
          },
        }
      }
    }));
    GithubService.prototype.openIssue = jest.fn(() => Promise.resolve(openIssuemock));
    SimpleGitService.prototype.saveMetaVars = jest.fn(() => Promise.resolve());
    PullRequestService.prototype.create = jest.fn(() => Promise.resolve(faker.datatype.boolean()));
    Logger.prototype.log = jest.fn();
    Logger.prototype.error = jest.fn();
    DIPsService.prototype.groupProposal = jest.fn(() => Promise.resolve([dipMock]));
    DIPsService.prototype.setDipsFather = jest.fn(() => Promise.resolve([faker.datatype.boolean()]));
    DIPsService.prototype.deleteManyByIds = jest.fn(() => Promise.resolve());
    DIPsService.prototype.update = jest.fn(() => Promise.resolve(dipMock));
    DIPsService.prototype.insertMany = jest.fn();
    DIPsService.prototype.findAll = jest.fn(() => Promise.resolve({
      items: [dipMock],
      total: faker.datatype.number(),
    }));
    MarkedService.prototype.markedLexer = jest.fn(() => markedListMock);
    console.log = jest.fn();
  });

  describe('loggerMessage', () => {
    it('base case', async () => {
      const message = 'test';

      const mockLogger = jest.spyOn(
        Logger.prototype,
        'log'
      ).mockReturnValueOnce();

      service.loggerMessage(message);

      expect(mockLogger).toHaveBeenCalledTimes(1);
      expect(mockLogger).toHaveBeenCalledWith(message);
    });
  });

  describe('updateSubproposalCountField', () => {
    it('update subproposal', async () => {
      await service.updateSubproposalCountField();

      expect(DIPsService.prototype.findAll).toBeCalledTimes(2);
      expect(DIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 0,
          page: 0,
        },
        "",
        "",
        {
          equals: [{
            field: "proposal",
            value: "",
          }],
        },
        "_id dipName proposal",
      );
      expect(DIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 0,
          page: 0,
        },
        "",
        "",
        {
          equals: [{
            field: "proposal",
            value: undefined,
          }],
        },
        "_id dipName proposal",
      );
      expect(DIPsService.prototype.update).toBeCalledTimes(1);
      expect(DIPsService.prototype.update).toBeCalledWith(
        dipMock._id,
        dipMock,
      );
      expect(Logger.prototype.error).not.toBeCalled();
    });

    it('error during update', async () => {
      jest.spyOn(DIPsService.prototype, 'update')
        .mockImplementationOnce(async () => {
          throw new Error(errorUpdateMock);
        });

      await service.updateSubproposalCountField();

      expect(DIPsService.prototype.findAll).toBeCalledTimes(2);
      expect(DIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 0,
          page: 0,
        },
        "",
        "",
        {
          equals: [{
            field: "proposal",
            value: "",
          }],
        },
        "_id dipName proposal",
      );
      expect(DIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 0,
          page: 0,
        },
        "",
        "",
        {
          equals: [{
            field: "proposal",
            value: undefined,
          }],
        },
        "_id dipName proposal",
      );
      expect(DIPsService.prototype.update).toBeCalledTimes(1);
      expect(DIPsService.prototype.update).toBeCalledWith(
        dipMock._id,
        dipMock,
      );
      expect(Logger.prototype.error).toBeCalledTimes(1);
      expect(Logger.prototype.error).toBeCalledWith(new Error(errorUpdateMock));

    });
  });

  describe('parse', () => {
    beforeEach(async () => {
      jest.spyOn(ParseDIPsService.prototype, 'synchronizeData')
        .mockReturnValueOnce(
          Promise.resolve(synchronizeDataMock)
        );
      jest.spyOn(ParseDIPsService.prototype, 'updateSubproposalCountField')
        .mockReturnValueOnce(Promise.resolve());
    });

    it('with no existing pull requests', async () => {
      let countPullRequest = 2;

      PullRequestService.prototype.count = jest.fn(() => Promise.resolve(0));

      GithubService.prototype.pullRequests = jest.fn(async () => {
        const pullRequest = {
          repository: {
            pullRequests: {
              nodes: {
                edges: [`test_${countPullRequest}`]
              },
              pageInfo: {
                hasNextPage: true,
                endCursor: `test_${countPullRequest}`,
              },
            }
          }
        };
        if (countPullRequest > 0) {
          countPullRequest = countPullRequest - 1;
        }
        else {
          pullRequest.repository.pullRequests.pageInfo.hasNextPage = false;
        }
        return pullRequest;
      });

      GithubService.prototype.pullRequestsLast = jest.fn(async () => {
        return {
          repository: {
            pullRequests: {
              nodes: {
                edges: ['test']
              },
              pageInfo: {
                hasNextPage: true,
                endCursor: 'test',
              },
              totalCount: 2,
            }
          }
        };
      });

      const result = await service.parse();

      expect(result).toBeTruthy();
      expect(SimpleGitService.prototype.pull).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.pull).toBeCalledWith(
        'origin',
        configService.get(Env.RepoBranch),
      );
      expect(SimpleGitService.prototype.getFiles).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.getFiles).toBeCalledWith();
      expect(DIPsService.prototype.getAll).toBeCalledTimes(1);
      expect(DIPsService.prototype.getAll).toBeCalledWith();
      expect(PullRequestService.prototype.count).toBeCalledTimes(1);
      expect(PullRequestService.prototype.count).toBeCalledWith();
      expect(GithubService.prototype.pullRequests).toBeCalledTimes(3);
      expect(GithubService.prototype.pullRequests).toHaveBeenCalledWith(
        pullRequestsCount
      );
      expect(GithubService.prototype.pullRequests).toHaveBeenCalledWith(
        pullRequests
      );
      expect(GithubService.prototype.pullRequests).toHaveBeenCalledWith(
        pullRequestsAfter,
        'test_1',
      );
      expect(ParseDIPsService.prototype.synchronizeData).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.synchronizeData).toBeCalledWith(
        [gitFileMock],
        dipMapMock,
      );
      expect(GithubService.prototype.pullRequestsLast).not.toBeCalled();
      expect(SimpleGitService.prototype.saveMetaVars).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.saveMetaVars).toBeCalledWith();
      expect(PullRequestService.prototype.create).toBeCalledTimes(2);
      expect(PullRequestService.prototype.create).toHaveBeenCalledWith({
        edges: ['test_1'],
      });
      expect(PullRequestService.prototype.create).toHaveBeenCalledWith({
        edges: ['test_0'],
      });
      expect(Logger.prototype.log).toBeCalledTimes(2);
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Synchronize Data ===> ${JSON.stringify(synchronizeDataMock)}`,
      );
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Dips with subproposals data ===> ${JSON.stringify([dipMock])}`
      );
      expect(DIPsService.prototype.groupProposal).toBeCalledTimes(1);
      expect(DIPsService.prototype.groupProposal).toBeCalledWith();
      expect(DIPsService.prototype.setDipsFather).toBeCalledTimes(1);
      expect(DIPsService.prototype.setDipsFather).toBeCalledWith([dipMock._id]);
      expect(ParseDIPsService.prototype.updateSubproposalCountField).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.updateSubproposalCountField).toBeCalledWith();
    });

    it('with existing pull requests', async () => {
      const result = await service.parse();

      expect(result).toBeTruthy();
      expect(SimpleGitService.prototype.pull).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.pull).toBeCalledWith(
        'origin',
        configService.get(Env.RepoBranch),
      );
      expect(SimpleGitService.prototype.getFiles).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.getFiles).toBeCalledWith();
      expect(DIPsService.prototype.getAll).toBeCalledTimes(1);
      expect(DIPsService.prototype.getAll).toBeCalledWith();
      expect(PullRequestService.prototype.count).toBeCalledTimes(1);
      expect(PullRequestService.prototype.count).toBeCalledWith();
      expect(GithubService.prototype.pullRequests).toBeCalledTimes(1);
      expect(GithubService.prototype.pullRequests).toBeCalledWith(
        pullRequestsCount
      );
      expect(GithubService.prototype.pullRequestsLast).toBeCalledTimes(1);
      expect(GithubService.prototype.pullRequestsLast).toBeCalledWith(
        pullRequestsLast,
        totalCountMock - countMock,
      );
      expect(ParseDIPsService.prototype.synchronizeData).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.synchronizeData).toBeCalledWith(
        [gitFileMock],
        dipMapMock,
      );
      expect(SimpleGitService.prototype.saveMetaVars).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.saveMetaVars).toBeCalledWith();
      expect(PullRequestService.prototype.create).toBeCalledTimes(1);
      expect(PullRequestService.prototype.create).toBeCalledWith({
        edges: [edgesMock],
      });
      expect(Logger.prototype.log).toBeCalledTimes(3);
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Synchronize Data ===> ${JSON.stringify(synchronizeDataMock)}`,
      );
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Dips with subproposals data ===> ${JSON.stringify([dipMock])}`
      );
      expect(DIPsService.prototype.groupProposal).toBeCalledTimes(1);
      expect(DIPsService.prototype.groupProposal).toBeCalledWith();
      expect(DIPsService.prototype.setDipsFather).toBeCalledTimes(1);
      expect(DIPsService.prototype.setDipsFather).toBeCalledWith([dipMock._id]);
      expect(ParseDIPsService.prototype.updateSubproposalCountField).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.updateSubproposalCountField).toBeCalledWith();
    });

    it('error while pull', async () => {

      SimpleGitService.prototype.pull = jest.fn(() => {
        throw new Error("forcing error");
      });

      const result = await service.parse();

      expect(result).toBeFalsy();
      expect(SimpleGitService.prototype.pull).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.pull).toBeCalledWith(
        'origin',
        configService.get(Env.RepoBranch),
      );
      expect(SimpleGitService.prototype.getFiles).not.toBeCalled();
      expect(DIPsService.prototype.getAll).not.toBeCalled();
      expect(PullRequestService.prototype.count).not.toBeCalled();
      expect(GithubService.prototype.pullRequests).not.toBeCalled();
      expect(GithubService.prototype.pullRequestsLast).not.toBeCalled();
      expect(ParseDIPsService.prototype.synchronizeData).not.toBeCalled();
      expect(SimpleGitService.prototype.saveMetaVars).not.toBeCalled();
      expect(PullRequestService.prototype.create).not.toBeCalled();
      expect(Logger.prototype.log).not.toBeCalled();
      expect(DIPsService.prototype.groupProposal).not.toBeCalled();
      expect(DIPsService.prototype.setDipsFather).not.toBeCalled();
      expect(ParseDIPsService.prototype.updateSubproposalCountField).not.toBeCalled();
    });
  });

  describe('parseDIP', () => {
    beforeEach(async () => {
      jest.spyOn(
        ParseDIPsService.prototype,
        "parseLexerData"
      ).mockReturnValueOnce(
        dipMock
      );
    });

    it('parse new dip', async () => {
      const isNewDIP = true;
      const baseUrl = `${process.cwd()}/${configService.get<string>(
        Env.FolderRepositoryName
      )}`;

      const result = await service.parseDIP(dipMock, isNewDIP);

      expect(result).toBeDefined();
      expect(result).toEqual(dipMock);
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(`Parse new dip item update => ${dipMock.filename}`);
      expect(readFile).toBeCalledTimes(1);
      expect(readFile).toBeCalledWith(
        `${baseUrl}/${dipMock.filename}`,
        'utf-8'
      );
      expect(ParseDIPsService.prototype.parseLexerData).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.parseLexerData).toBeCalledWith(
        'test',
        dipMock,
      );
    });

    it('parse not new dip', async () => {
      const isNewDIP = false;
      const baseUrl = `${process.cwd()}/${configService.get<string>(
        Env.FolderRepositoryName
      )}`;

      const result = await service.parseDIP(dipMock, isNewDIP);

      expect(result).toBeDefined();
      expect(result).toEqual(dipMock);
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(`Parse dip item update => ${dipMock.filename}`);
      expect(readFile).toBeCalledTimes(1);
      expect(readFile).toBeCalledWith(
        `${baseUrl}/${dipMock.filename}`,
        'utf-8'
      );
      expect(ParseDIPsService.prototype.parseLexerData).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.parseLexerData).toBeCalledWith(
        'test',
        dipMock,
      );
    });
  });

  describe('deleteDipsFromMap', () => {
    it('delete dips by ids', async () => {

      await service.deleteDipsFromMap(dipMapMock);

      expect(DIPsService.prototype.deleteManyByIds).toBeCalledTimes(1);
      expect(DIPsService.prototype.deleteManyByIds).toBeCalledWith([dipMock._id]);
    });
  });

  describe('updateIfDifferentHash', () => {
    beforeEach(async () => {
      jest.spyOn(
        ParseDIPsService.prototype,
        'parseDIP'
      ).mockReturnValueOnce(
        Promise.resolve(dipMock)
      );
    });

    it('different hash', async () => {
      const dip_2 = {
        ...dipMock,
        hash: 'hash_2',
      };

      const result = await service.updateIfDifferentHash(dipMock, dip_2);

      expect(result).toBeTruthy();
      expect(ParseDIPsService.prototype.parseDIP).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.parseDIP).toBeCalledWith(dip_2, false);
      expect(DIPsService.prototype.update).toBeCalledTimes(1);
      expect(DIPsService.prototype.update).toBeCalledWith(dipMock._id, dipMock);
      expect(Logger.prototype.error).not.toBeCalled();
    });

    it('different hash and error while update', async () => {
      const dip_2 = {
        ...dipMock,
        hash: 'hash_2',
      };

      DIPsService.prototype.update = jest.fn(async () => {
        throw new Error('Forcing error');
      });

      const result = await service.updateIfDifferentHash(dipMock, dip_2);

      expect(result).toBeTruthy();
      expect(ParseDIPsService.prototype.parseDIP).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.parseDIP).toBeCalledWith(dip_2, false);
      expect(DIPsService.prototype.update).toBeCalledTimes(1);
      expect(DIPsService.prototype.update).toBeCalledWith(dipMock._id, dipMock);
      expect(Logger.prototype.error).toBeCalledTimes(1);
      expect(Logger.prototype.error).toBeCalledWith('Forcing error');
    });

    it('same hash', async () => {
      const result = await service.updateIfDifferentHash(dipMock, dipMock);

      expect(result).toBeFalsy();
      expect(ParseDIPsService.prototype.parseDIP).not.toBeCalled();
      expect(DIPsService.prototype.update).not.toBeCalled();
      expect(Logger.prototype.error).not.toBeCalled();
    });
  });

  describe('synchronizeData', () => {
    beforeEach(async () => {
      jest.spyOn(ParseDIPsService.prototype, 'updateIfDifferentHash')
        .mockReturnValueOnce(Promise.resolve(true));
      jest.spyOn(ParseDIPsService.prototype, 'deleteDipsFromMap')
        .mockReturnValueOnce(Promise.resolve());
    });

    it('new DIP', async () => {
      jest.spyOn(ParseDIPsService.prototype, 'parseDIP')
        .mockReturnValue(Promise.resolve(dipWithoutNameMock));
      jest.spyOn(ParseDIPsService.prototype, 'sendIssue')
        .mockReturnValue(Promise.resolve());
      const result = await service.synchronizeData(
        filesGitMock,
        dipMapMock,
      );

      expect(result).toEqual({
        creates: 1,
        deletes: 1,
        updates: 0,
      });
      expect(ParseDIPsService.prototype.parseDIP).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.parseDIP).toBeCalledWith(filesGitMock[0], true);
      expect(ParseDIPsService.prototype.sendIssue).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.sendIssue).toBeCalledWith([{
        dipPath: filesGitMock[0].filename,
      }]);
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(
        `Dips with problems to parse ==> ${(dipWithoutNameMock.dip, dipWithoutNameMock.dipName, dipWithoutNameMock.filename)
        }`
      );
      expect(ParseDIPsService.prototype.updateIfDifferentHash).not.toBeCalled();
      expect(ParseDIPsService.prototype.deleteDipsFromMap).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.deleteDipsFromMap).toBeCalledWith(
        dipMapMock,
      );
      expect(DIPsService.prototype.insertMany).toBeCalledTimes(1);
      expect(DIPsService.prototype.insertMany).toBeCalledWith(
        [dipWithoutNameMock],
      );
    });

    it('new DIP and error while parseDIP', async () => {
      jest.spyOn(
        ParseDIPsService.prototype,
        'parseDIP'
      ).mockImplementationOnce(async () => {
        throw new Error('Forcing error');
      });

      const result = await service.synchronizeData(
        filesGitMock,
        dipMapMock,
      );

      expect(result).toEqual({
        creates: 0,
        deletes: 1,
        updates: 0,
      });
      expect(ParseDIPsService.prototype.parseDIP).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.parseDIP).toBeCalledWith(filesGitMock[0], true);
      expect(console.log).not.toBeCalled();
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(
        'Forcing error'
      );
      expect(ParseDIPsService.prototype.updateIfDifferentHash).not.toBeCalled();
      expect(ParseDIPsService.prototype.deleteDipsFromMap).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.deleteDipsFromMap).toBeCalledWith(
        dipMapMock,
      );
      expect(DIPsService.prototype.insertMany).toBeCalledTimes(1);
      expect(DIPsService.prototype.insertMany).toBeCalledWith([]);
    });

    it('no new DIP', async () => {
      jest.spyOn(ParseDIPsService.prototype, 'parseDIP')
        .mockReturnValueOnce(Promise.resolve(dipWithoutNameMock));
      const result = await service.synchronizeData(
        [{
          ...dipMock,
          filename: mapKeyMock,
        }],
        dipMapMock,
      );

      expect(result).toEqual({
        creates: 0,
        deletes: 0,
        updates: 1,
      });
      expect(ParseDIPsService.prototype.parseDIP).not.toBeCalled();
      expect(console.log).not.toBeCalled();
      expect(Logger.prototype.log).not.toBeCalled();
      expect(ParseDIPsService.prototype.updateIfDifferentHash).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.updateIfDifferentHash).toBeCalledWith(
        gitFileMock,
        {
          ...dipMock,
          filename: mapKeyMock,
        },
      );
      expect(ParseDIPsService.prototype.deleteDipsFromMap).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.deleteDipsFromMap).toBeCalledWith(
        new Map(),
      );
      expect(DIPsService.prototype.insertMany).toBeCalledTimes(1);
      expect(DIPsService.prototype.insertMany).toBeCalledWith([]);
    });
  });

  describe('sendIssue', () => {
    it('', async () => {
      console.log = jest.fn();
      await service.sendIssue([{
        dipPath: filesGitMock[0].filename,
      }]);

      expect(GithubService.prototype.openIssue).toBeCalledTimes(1);
      expect(GithubService.prototype.openIssue).toBeCalledWith(
        openIssue,
        "DIPs with problems to parse",
        `
# Some problems where found on this DIPS:


>DIP Path: ${filesGitMock[0].filename}



`
      );
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith(openIssuemock);
    });
  });

  describe('getComponentsSection', () => {
    it('has component summary', async () => {
      const result = service.getComponentsSection(dipFile);

      expect(result).toEqual(componentSummary);
    });

    it("hasn't component summary", async () => {
      const data = 'test';

      const result = service.getComponentsSection(data);

      expect(result).toEqual('');
    });

    it('component summary without end', async () => {
      const data = "**DIP0c1: Core Principles\n\nsomething";

      const result = service.getComponentsSection(data);

      expect(result).toEqual('**DIP0c1: Core Principles\n\nsomething');
    });
  });

  describe('getDataFromComponentText', () => {
    it('get splited components', async () => {
      const result = service.getDataFromComponentText(componentSummary);

      expect(result).toEqual(components);
    });
  });

  describe('parseDipsNamesComponentsSubproposals', () => {
    it('is on component summary', async () => {
      const markedFile: any[] = marked.lexer(dipFile);
      const element = markedFile[12];
      const isOnComponentSummary = true;

      const result = service.parseDipsNamesComponentsSubproposals(
        element,
        isOnComponentSummary
      );

      expect(result).toEqual(
        componentSummaryParsed
      );
    });

    it('is on component summary title', async () => {
      const markedFile: any[] = marked.lexer(dipFile);
      const element = markedFile[37];
      const isOnComponentSummary = true;

      const result = service.parseDipsNamesComponentsSubproposals(
        element,
        isOnComponentSummary
      );

      expect(result).toEqual(
        componentSummaryParsed_1
      );
    });

    it('heading not on component summary', async () => {
      const markedFile: any[] = marked.lexer(dipFile);
      const element = markedFile[0];
      const isOnComponentSummary = false;

      const result = service.parseDipsNamesComponentsSubproposals(
        element,
        isOnComponentSummary
      );

      expect(result).toEqual(
        titleParsed
      );
    });

    it('not heading that is not on component summary', async () => {
      const markedFile: any[] = marked.lexer(dipFile);
      const element = markedFile[203];
      const isOnComponentSummary = false;

      const result = service.parseDipsNamesComponentsSubproposals(
        element,
        isOnComponentSummary
      );

      expect(result).toEqual(
        headingOutComponentSummaryParsed
      );
    });
  });

  describe('parseReferenceList', () => {
    it('parse reference token list', async () => {
      const items = [{
        tokens: [{
          tokens: [
            {
              href: referenceMock.link,
              text: referenceMock.name,
            },
            {
              text: faker.random.word(),
            }
          ]
        }],
      }];

      const result = (service as any).parseReferenceList(items);

      expect(result).toEqual([{
        name: referenceMock.name,
        link: referenceMock.link,
      }]);
    });
  });

  describe('parseReferencesTokens', () => {
    it('parse reference tokens when is a text', async () => {
      const item = {
        type: 'text',
        text: referenceMock.name,
        href: referenceMock.link,
      };

      const result = (service as any).parseReferencesTokens(item);

      expect(result).toEqual([{
        name: referenceMock.name,
        link: "",
      }]);
    });

    it('parse reference tokens when is a link', async () => {
      const item = {
        type: 'link',
        text: referenceMock.name,
        href: referenceMock.link,
      };

      const result = (service as any).parseReferencesTokens(item);

      expect(result).toEqual([referenceMock]);
    });

    it('parse reference tokens when have tokens', async () => {
      const item = {
        tokens: [{
          text: referenceMock.name,
          href: referenceMock.link,
        }],
      };

      const result = (service as any).parseReferencesTokens(item);

      expect(result).toEqual([referenceMock]);
    });

    it('parse reference tokens emty result', async () => {
      const result = (service as any).parseReferencesTokens({});

      expect(result).toEqual([]);
    });
  });

  describe('parseReferences', () => {
    beforeEach(() => {
      jest.spyOn(ParseDIPsService.prototype as any, 'parseReferenceList')
        .mockReturnValueOnce([referenceMock]);
      jest.spyOn(ParseDIPsService.prototype as any, 'parseReferencesTokens')
        .mockReturnValueOnce([referenceMock]);
    });

    it('next type is a list', () => {
      const item = {
        type: 'list',
        items: [{
          tokens: [{
            tokens: [{
              text: referenceMock.name,
              href: referenceMock.link,
            }],
          }],
        }],
      };

      const result = (service as any).parseReferences(item);

      expect(result).toEqual([referenceMock]);
      expect((ParseDIPsService.prototype as any).parseReferenceList).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parseReferenceList).toBeCalledWith(item.items);
      expect((ParseDIPsService.prototype as any).parseReferencesTokens).not.toBeCalled();
    });

    it('next type is a single item', () => {
      const item = {
        tokens: [{
          tokens: [{
            text: referenceMock.name,
            href: referenceMock.link,
          }],
        }],
      };

      const result = (service as any).parseReferences(item);

      expect(result).toEqual([referenceMock]);
      expect((ParseDIPsService.prototype as any).parseReferencesTokens).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parseReferencesTokens).toBeCalledWith(item.tokens[0]);
      expect((ParseDIPsService.prototype as any).parseReferenceList).not.toBeCalled();
    });

    it('next type has nothing', () => {
      const item = {};

      const result = (service as any).parseReferences(item);

      expect(result).toEqual([]);
      expect((ParseDIPsService.prototype as any).parseReferencesTokens).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseReferenceList).not.toBeCalled();
    });
  });

  describe('parseParagraphSummary', () => {
    it('parse list of paragraph summary', () => {
      const list = [{
        type: 'list',
        depth: faker.datatype.number({
          min: 3
        }),
        raw: faker.random.word(),
      }];

      const result = (service as any).parseParagraphSummary(list);

      expect(result).toEqual(list[0].raw);
    });
  });

  describe('parseNotTitleHeading', () => {
    beforeEach(() => {
      jest.spyOn(ParseDIPsService.prototype as any, 'parsePreamble')
        .mockReturnValueOnce(preambleMock);
      jest.spyOn(ParseDIPsService.prototype as any, 'setSubproposalValue')
        .mockReturnValueOnce(countMock);
      jest.spyOn(ParseDIPsService.prototype as any, 'parseParagraphSummary')
        .mockReturnValueOnce(paragraphSummaryMock);
      jest.spyOn(ParseDIPsService.prototype as any, 'parseReferences')
        .mockReturnValueOnce([referenceMock]);
    });

    it('parse preamble', () => {
      const list = [
        {
          text: 'Preamble',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];
      const item = {
        ...filesGitMock[0],
        filename: `${faker.random.word()}-`,
      };

      const result = (service as any).parseNotTitleHeading(
        list,
        dipData_2,
        item,
      );

      expect(result).toEqual({
        dip: {
          ...dipData_2,
          dipName: preambleMock.dipName,
          subproposal: countMock,
        },
        preamble: {
          ...preambleMock,
          dip: dipNumber_2,
        },
        isOnComponentSummary: false,
      });
      expect((ParseDIPsService.prototype as any).parsePreamble).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parsePreamble).toBeCalledWith(list[1].text, true);
      expect((ParseDIPsService.prototype as any).setSubproposalValue).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).setSubproposalValue).toBeCalledWith(preambleMock.dipName);
      expect((ParseDIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseReferences).not.toBeCalled();
    });

    it('parse subproposal preamble', () => {
      const list = [
        {
          text: 'Preamble',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        dipData_2,
        filesGitMock[0],
      );

      expect(result).toEqual({
        dip: dipData_2,
        preamble: preambleMock,
        isOnComponentSummary: false,
      });
      expect((ParseDIPsService.prototype as any).parsePreamble).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parsePreamble).toBeCalledWith(list[1].text);
      expect((ParseDIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseReferences).not.toBeCalled();
    });

    it('parse sentence summary', () => {
      const list = [
        {
          text: 'Sentence Summary',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        dipData_2,
        filesGitMock,
      );

      expect(result).toEqual({
        dip: {
          ...dipData_2,
          sentenceSummary: list[1].raw,
        },
        preamble: undefined,
        isOnComponentSummary: false,
      });
      expect((ParseDIPsService.prototype as any).parsePreamble).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseReferences).not.toBeCalled();
    });

    it('parse paragraph summary', () => {
      const list = [
        {
          text: 'Paragraph Summary',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        dipData_2,
        filesGitMock,
      );

      expect(result).toEqual({
        dip: {
          ...dipData_2,
          paragraphSummary: paragraphSummaryMock,
        },
        preamble: undefined,
        isOnComponentSummary: false,
      });
      expect((ParseDIPsService.prototype as any).parseParagraphSummary).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parseParagraphSummary).toBeCalledWith([list[1]]);
      expect((ParseDIPsService.prototype as any).parsePreamble).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseReferences).not.toBeCalled();
    });

    it('parse references', () => {
      const list = [
        {
          text: 'References',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        dipData_2,
        filesGitMock,
      );

      expect(result).toEqual({
        dip: {
          ...dipData_2,
          references: [referenceMock],
        },
        preamble: undefined,
        isOnComponentSummary: false,
      });
      expect((ParseDIPsService.prototype as any).parseReferences).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parseReferences).toBeCalledWith(list[1]);
      expect((ParseDIPsService.prototype as any).parsePreamble).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
    });

    it('parse other headings', () => {
      const list = [
        {
          text: 'Component Summary Section',
          raw: faker.random.word(),
        },
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        dipData_2,
        filesGitMock,
      );

      expect(result).toEqual({
        dip: dipData_2,
        preamble: undefined,
        isOnComponentSummary: true,
      });
      expect((ParseDIPsService.prototype as any).parsePreamble).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseReferences).not.toBeCalled();
    });
  });

  describe('extractDipNumberFromDipName', () => {
    it('extract dip number', async () => {
      const result = (service as any).extractDipNumberFromDipName(`${totalCountMock}`);

      expect(result).toEqual(`000${totalCountMock}`);
    });

    it('extract dip number', async () => {
      const result = (service as any).extractDipNumberFromDipName(mapKeyMock);

      expect(result).toEqual(mapKeyMock);
    });
  });

  describe("parseLexerData", () => {
    beforeEach(() => {
      jest.spyOn(ParseDIPsService.prototype, 'getComponentsSection')
        .mockReturnValueOnce(componentSummary);
      jest.spyOn(ParseDIPsService.prototype, 'getDataFromComponentText')
        .mockReturnValueOnce(components);
      jest.spyOn(ParseDIPsService.prototype, 'parseDipsNamesComponentsSubproposals')
        .mockReturnValueOnce(componentSummaryParsed);
      jest.spyOn(ParseDIPsService.prototype as any, 'parseNotTitleHeading')
        .mockImplementationOnce((_list, dip, _item) => {
          if (countPreambleDefined > 0) {
            countPreambleDefined--;
            return {
              dip: dip,
              preamble: preambleMock,
              isOnComponentSummary: false,
            };
          }
          return {
            preamble: null,
            dip,
            isOnComponentSummary: false,
          };
        });
      jest.spyOn(ParseDIPsService.prototype as any, 'extractDipNumberFromDipName')
        .mockReturnValueOnce(`${dipNumber_1}`);
    });

    it('parse lexer data', () => {
      const result = service.parseLexerData(
        dipFile,
        filesGitMock[0],
      );

      expect(result).toEqual({
        dipName: `DIP${dipNumber_1}`,
        hash: filesGitMock[0].hash,
        file: dipFile,
        language: filesGitMock[0].language,
        filename: filesGitMock[0].filename,
        sections: [
          {
            depth: markedListMock[0].depth,
            heading: markedListMock[0].text,
          },
          {
            depth: markedListMock[1].depth,
            heading: markedListMock[1].text,
            dipComponent: sectionNameMock,
          },
        ],
        sectionsRaw: [componentSummaryParsed, undefined],
        references: [],
        components,
        author: preambleMock.author,
        contributors: preambleMock.contributors,
        dateProposed: preambleMock.dateProposed,
        dateRatified: preambleMock.dateRatified,
        dependencies: preambleMock.dependencies,
        extra: preambleMock.extra,
        dip: preambleMock.dip,
        replaces: preambleMock.replaces,
        status: preambleMock.status,
        title: markedListMock[0].text,
        types: preambleMock.types,
        tags: preambleMock.tags,
        subproposalsCount: 0,
        votingPortalLink: preambleMock.votingPortalLink,
        forumLink: preambleMock.forumLink,
        dipCodeNumber: `${dipNumber_1}`,
      });
      expect(ParseDIPsService.prototype.getComponentsSection).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.getComponentsSection).toBeCalledWith(dipFile);
      expect(ParseDIPsService.prototype.getDataFromComponentText).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.getDataFromComponentText).toBeCalledWith(componentSummary);
      expect((ParseDIPsService.prototype as any).parseNotTitleHeading).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parseNotTitleHeading).toBeCalledWith(
        [markedListMock[1]],
        {
          hash: filesGitMock[0].hash,
          file: dipFile,
          language: filesGitMock[0].language,
          filename: filesGitMock[0].filename,
          sections: [
            {
              depth: markedListMock[0].depth,
              heading: markedListMock[0].text,
            },
            {
              depth: markedListMock[1].depth,
              heading: markedListMock[1].text,
              dipComponent: sectionNameMock,
            },
          ],
          sectionsRaw: [],
          references: [],
          dipName: 'DIP' + dipNumber_1,
          components,
        },
        filesGitMock[0],
      );
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toBeCalledTimes(2);
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[0],
        false,
      );
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[1],
        false,
      );
      expect((ParseDIPsService.prototype as any).extractDipNumberFromDipName).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).extractDipNumberFromDipName).toBeCalledWith('DIP' + dipNumber_1);
      expect(Logger.prototype.log).not.toBeCalled();
    });

    it('DIP not inside the DIP folder', () => {
      try {
        service.parseLexerData(
          dipFile,
          {
            ...filesGitMock[0],
            filename: faker.random.word(),
          },
        );
      } catch (error) {
        expect(error.message).toEqual("DIP filename not inside a DIP folder");
      }

      expect(ParseDIPsService.prototype.getComponentsSection).not.toBeCalled();
      expect(ParseDIPsService.prototype.getDataFromComponentText).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseNotTitleHeading).not.toBeCalled();
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).extractDipNumberFromDipName).not.toBeCalled();
      expect(Logger.prototype.log).not.toBeCalled();
    });

    it('filename includes -', () => {
      const filename: string = `DIP${dipNumber_1}/DIP${dipNumber_1}-.md`;
      const result = service.parseLexerData(
        dipFile,
        {
          ...filesGitMock[0],
          filename,
        },
      );

      expect(result).toEqual({
        proposal: `DIP${dipNumber_1}`,
        hash: filesGitMock[0].hash,
        file: dipFile,
        language: filesGitMock[0].language,
        filename,
        sections: [
          {
            depth: markedListMock[0].depth,
            heading: markedListMock[0].text,
          },
          {
            depth: markedListMock[1].depth,
            heading: markedListMock[1].text,
            dipComponent: sectionNameMock,
          },
        ],
        sectionsRaw: [componentSummaryParsed, undefined],
        references: [],
        author: preambleMock.author,
        contributors: preambleMock.contributors,
        dateProposed: preambleMock.dateProposed,
        dateRatified: preambleMock.dateRatified,
        dependencies: preambleMock.dependencies,
        extra: preambleMock.extra,
        dip: preambleMock.dip,
        replaces: preambleMock.replaces,
        status: preambleMock.status,
        title: markedListMock[0].text,
        types: preambleMock.types,
        tags: preambleMock.tags,
        subproposalsCount: 0,
        votingPortalLink: preambleMock.votingPortalLink,
        forumLink: preambleMock.forumLink,
        dipCodeNumber: `${dipNumber_1}`,
      });
      expect(ParseDIPsService.prototype.getComponentsSection).not.toBeCalled();
      expect(ParseDIPsService.prototype.getDataFromComponentText).not.toBeCalled();
      expect((ParseDIPsService.prototype as any).parseNotTitleHeading).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parseNotTitleHeading).toBeCalledWith(
        [markedListMock[1]],
        {
          hash: filesGitMock[0].hash,
          file: dipFile,
          language: filesGitMock[0].language,
          filename,
          sections: [
            {
              depth: markedListMock[0].depth,
              heading: markedListMock[0].text,
            },
            {
              depth: markedListMock[1].depth,
              heading: markedListMock[1].text,
              dipComponent: sectionNameMock,
            },
          ],
          sectionsRaw: [],
          references: [],
          proposal: `DIP${dipNumber_1}`,
        },
        {
          ...filesGitMock[0],
          filename,
        },
      );
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toBeCalledTimes(2);
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[0],
        false,
      );
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[1],
        false,
      );
      expect((ParseDIPsService.prototype as any).extractDipNumberFromDipName).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).extractDipNumberFromDipName).toBeCalledWith(undefined);
      expect(Logger.prototype.log).not.toBeCalled();
    });

    it('preamble empty', () => {
      const result = service.parseLexerData(
        dipFile,
        filesGitMock[0],
      );

      expect(result).toEqual(undefined);
      expect(ParseDIPsService.prototype.getComponentsSection).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.getComponentsSection).toBeCalledWith(dipFile);
      expect(ParseDIPsService.prototype.getDataFromComponentText).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.getDataFromComponentText).toBeCalledWith(componentSummary);
      expect((ParseDIPsService.prototype as any).parseNotTitleHeading).toBeCalledTimes(1);
      expect((ParseDIPsService.prototype as any).parseNotTitleHeading).toBeCalledWith(
        [markedListMock[1]],
        {
          hash: filesGitMock[0].hash,
          file: dipFile,
          language: filesGitMock[0].language,
          filename: filesGitMock[0].filename,
          sections: [
            {
              depth: markedListMock[0].depth,
              heading: markedListMock[0].text,
            },
            {
              depth: markedListMock[1].depth,
              heading: markedListMock[1].text,
              dipComponent: sectionNameMock,
            },
          ],
          sectionsRaw: [],
          references: [],
          dipName: 'DIP' + dipNumber_1,
          components,
        },
        filesGitMock[0],
      );
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toBeCalledTimes(2);
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[0],
        false,
      );
      expect(ParseDIPsService.prototype.parseDipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[1],
        false,
      );
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(`Preamble empty ==> ${JSON.stringify(filesGitMock[0])}`);
      expect((ParseDIPsService.prototype as any).extractDipNumberFromDipName).not.toBeCalled();
    });
  });

  describe('setSubproposalValue', () => {
    it('calculate subpropousal value', () => {
      const result = service.setSubproposalValue(
        `DIP${dipNumber_1}cSP${dipNumber_2}`,
      );

      expect(result).toEqual(parseInt(
        dipNumber_1 + (dipNumber_2 === 10 ? '' : '0') + dipNumber_2
      ));
    });
  });

  describe('parseSections', () => {
    it('marked section', async () => {
      const result = await service.parseSections(dipFile);

      expect(result).toEqual(markedListMock);
      expect(MarkedService.prototype.markedLexer).toBeCalledTimes(1);
      expect(MarkedService.prototype.markedLexer).toBeCalledWith(dipFile);
    });
  });

  describe("Parse Preamble", () => {
    it("should return the empty preamble", async () => {
      const data = faker.random.word();

      const preamble = service.parsePreamble(data);
      expect(preamble).toMatchObject({});
    });

    it("should return the full preamble", async () => {
      const data =
        "DIP#: 0\nTitle: The Maker Improvement Proposal Framework\nAuthor(s): Charles St.Louis (@CPSTL), Rune Christensen (@Rune23)\nContributors: @LongForWisdom\nType: Process\nStatus: Accepted\nDate Proposed: 2020-04-06\nDate Ratified: 2020-05-02\nDependencies: n/a\nReplaces: n/a\n";

      const result = {
        dip: 0,
        preambleTitle: "The Maker Improvement Proposal Framework",
        author: ["Charles St.Louis (@CPSTL)", "Rune Christensen (@Rune23)"],
        contributors: ["@LongForWisdom"],
        types: "Process",
        status: "Accepted",
        dateProposed: "2020-04-06",
        dateRatified: "2020-05-02",
        dependencies: ["n/a"],
        replaces: "n/a",
      };

      const preamble = service.parsePreamble(data);
      expect(preamble).toMatchObject(result);
    });
  });

  describe('parsePreamble', () => {
    it('emty preamble', () => {
      const result = service.parsePreamble(dipFile);

      expect(result).toEqual({
        author: authorMock,
        contributors: contributorsMock,
        dateProposed: dateProposedMock,
        dateRatified: dateRatifiedMock,
        dependencies: dependenciesMock,
        dip: dipNumber_1,
        preambleTitle: titleMock,
        replaces: replacesMock,
        status: statusMock,
        types: typesMock,
        votingPortalLink: votingPortalLinkMock,
        forumLink: forumLinkMock,
        tags: [tagsMock],
        extra: [extraMock],
      });
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});
