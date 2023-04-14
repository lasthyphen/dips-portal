import { ParseDIPsCommand } from "@app/dips/dips.command";
import { GithubService } from "@app/dips/services/github.service";
import { ParseDIPsService } from "@app/dips/services/parse-dips.service";
import { PullRequestService } from "@app/dips/services/pull-requests.service";
import { SimpleGitService } from "@app/dips/services/simple-git.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DIPsModule } from "../../src/dips/dips.module";
import { DIPsService } from "../../src/dips/services/dips.service";
const faker = require("faker");

describe('ParseDIPsCommand', () => {
  
  let dipsCommandService: ParseDIPsCommand;
  let dipsService: DIPsService;
  let simpleGitService: SimpleGitService;
  let pullRequestService: PullRequestService;
  let module: TestingModule;
  let mongoMemoryServer;

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
          }),
          inject: [ConfigService],
        }),
      ]
    }).compile();

    faker.seed('ParseDIPsCommand');

    dipsCommandService = module.get<ParseDIPsCommand>(ParseDIPsCommand);
    dipsService = module.get<DIPsService>(DIPsService);
    simpleGitService = module.get<SimpleGitService>(SimpleGitService);
    pullRequestService = module.get<PullRequestService>(PullRequestService);

    ParseDIPsService.prototype.sendIssue = jest.fn();
  });

  jest.setTimeout(3 * 60 * 1000);

  describe('parse', () => {
    it('should save all the DIPs', async () => {
      await dipsCommandService.parse();

      const { items: dips } = await dipsService.findAll({ limit: 10, page: 0 });
      expect(dips.length).toBeGreaterThan(0);

      const metavars = await simpleGitService.getMetaVars();
      expect(metavars.length).toBeGreaterThan(0);

      const countPullRequests = await pullRequestService.count();
      expect(countPullRequests).toBeGreaterThan(0);
    });

    afterEach(async () => {
        const { items: dips } = await dipsService.findAll({ limit: 10, page: 0 });
        await dipsService.deleteManyByIds(
          dips.map((dip) => dip._id)
        );
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});
