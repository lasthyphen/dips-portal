import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MetaDocument } from "./entities/meta.entity";
import { Language } from "./entities/dips.entity";
import { DIPsController } from "./dips.controller";
import { DIPsModule } from "./dips.module";
import { components, errorDropMock, fieldMock, filtersMock, languageMock, limitMock, metaVarsMock, dipData_2, dipNameMock, dipNumber_1, dipNumber_2, orderMock, pageMock, parseResultMock, pullRequestMock, requestCallBackMock, requestCallBackNotHeaderMock, searchMock, selectMock, valueMock } from "./services/data-test/data";
import { DIPsService } from "./services/dips.service";
import { ParseDIPsService } from "./services/parse-dips.service";
import { PullRequestService } from "./services/pull-requests.service";
import { SimpleGitService } from "./services/simple-git.service";
const faker = require("faker");
import * as crypto from "crypto";
import { Env } from "@app/env";
const digest = jest.fn(() => valueMock)
const update = jest.fn(() => {
  return {
    digest,
  } as any;
});
(crypto.createHmac as any) = jest.fn(() => {
  return {
    update,
  };
});
(crypto.timingSafeEqual as any) = jest.fn(() => true)

describe('DIPsController', () => {
  let controller: DIPsController;
  let module: TestingModule;
  let configService: ConfigService;
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
            useCreateIndex: true,
            useFindAndModify: false,
          }),
          inject: [ConfigService],
        }),
      ]
    }).compile();

    faker.seed('ParseDIPsCommand');

    controller = module.get<DIPsController>(DIPsController);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    DIPsService.prototype.findAll = jest.fn(() => Promise.resolve([dipData_2]));
    DIPsService.prototype.smartSearch = jest.fn(() => Promise.resolve([dipData_2]));
    DIPsService.prototype.findOneByDipName = jest.fn(() => Promise.resolve({
      ...dipData_2,
      proposal: undefined,
    }));
    DIPsService.prototype.findOneByFileName = jest.fn(() => Promise.resolve(dipData_2));
    DIPsService.prototype.findByProposal = jest.fn(() => Promise.resolve([dipData_2]));
    DIPsService.prototype.getDipLanguagesAvailables = jest.fn(() => Promise.resolve(languageMock));
    DIPsService.prototype.getSummaryByDipName = jest.fn(() => Promise.resolve(dipData_2));
    DIPsService.prototype.getSummaryByDipComponent = jest.fn(() => Promise.resolve({
      ...dipData_2,
      components: [components[0]]
    }));
    SimpleGitService.prototype.getMetaVars = jest.fn(() => Promise.resolve(metaVarsMock as any as MetaDocument[]));
    PullRequestService.prototype.aggregate = jest.fn(() => Promise.resolve(pullRequestMock));
    ParseDIPsService.prototype.loggerMessage = jest.fn();
    ParseDIPsService.prototype.parse = jest.fn(() => Promise.resolve(parseResultMock));
  });

  jest.setTimeout(3 * 60 * 1000);

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('find all dips', async () => {
      const result = await controller.findAll(
        limitMock,
        pageMock,
        orderMock,
        selectMock,
        languageMock,
        searchMock,
        filtersMock,
      );

      expect(result).toEqual([dipData_2]);
      expect(DIPsService.prototype.findAll).toBeCalledTimes(1);
      expect(DIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: limitMock,
          page: pageMock,
        },
        orderMock,
        searchMock,
        filtersMock,
        selectMock,
        languageMock,
      );
    });

    it('error while find all dips', async () => {
      jest.spyOn(DIPsService.prototype, 'findAll')
        .mockImplementationOnce(async () => {
          throw new Error(errorDropMock);
        });

      try {
        await controller.findAll(
          null,
          pageMock,
          orderMock,
          selectMock,
          languageMock,
          searchMock,
          filtersMock,
        );
      } catch (error) {
        expect(error.response.error).toEqual(errorDropMock);
      }

      expect(DIPsService.prototype.findAll).toBeCalledTimes(1);
      expect(DIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 10,
          page: pageMock,
        },
        orderMock,
        searchMock,
        filtersMock,
        selectMock,
        languageMock,
      );
    });
  });

  describe('findOneByDipName', () => {
    it('find dip by dip name', async () => {
      const result = await controller.findOneByDipName(dipNameMock);

      expect(result).toEqual({
        dip: {
          ...dipData_2,
          proposal: undefined,
        },
        pullRequests: pullRequestMock,
        subproposals: [dipData_2],
        languagesAvailables: languageMock,
        metaVars: metaVarsMock,
      });
      expect(DIPsService.prototype.findOneByDipName).toBeCalledTimes(1);
      expect(DIPsService.prototype.findOneByDipName).toBeCalledWith(
        dipNameMock,
        undefined,
      );
      expect(DIPsService.prototype.findByProposal).toBeCalledTimes(1);
      expect(DIPsService.prototype.findByProposal).toBeCalledWith(dipData_2.dipName);
      expect(PullRequestService.prototype.aggregate).toBeCalledTimes(1);
      expect(PullRequestService.prototype.aggregate).toBeCalledWith(dipData_2.filename);
      expect(DIPsService.prototype.getDipLanguagesAvailables).toBeCalledTimes(1);
      expect(DIPsService.prototype.getDipLanguagesAvailables).toBeCalledWith(dipNameMock);
      expect(SimpleGitService.prototype.getMetaVars).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.getMetaVars).toBeCalledWith();
    });

    it('find dip by dip name', async () => {
      PullRequestService.prototype.aggregate = jest.fn(() => {
        throw new Error(errorDropMock);
      });

      try {
        await controller.findOneByDipName(dipNameMock);
      } catch (error) {
        expect(error.message).toEqual(errorDropMock);
      }

      expect(DIPsService.prototype.findOneByDipName).toBeCalledTimes(1);
      expect(DIPsService.prototype.findOneByDipName).toBeCalledWith(
        dipNameMock,
        undefined,
      );
      expect(DIPsService.prototype.findByProposal).toBeCalledTimes(1);
      expect(DIPsService.prototype.findByProposal).toBeCalledWith(dipData_2.dipName);
      expect(PullRequestService.prototype.aggregate).toBeCalledTimes(1);
      expect(PullRequestService.prototype.aggregate).toBeCalledWith(dipData_2.filename);
      expect(DIPsService.prototype.getDipLanguagesAvailables).not.toBeCalled();
      expect(SimpleGitService.prototype.getMetaVars).not.toBeCalled();
    });

    it('error find dip by dip name', async () => {
      DIPsService.prototype.findOneByDipName = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneByDipName(dipNameMock);
      } catch (error) {
        expect(error.message).toEqual(`DIPs with name ${dipNameMock} not found`);
      }

      expect(DIPsService.prototype.findOneByDipName).toBeCalledTimes(2);
      expect(DIPsService.prototype.findOneByDipName).toBeCalledWith(
        dipNameMock,
        undefined,
      );
      expect(DIPsService.prototype.findOneByDipName).toBeCalledWith(
        dipNameMock,
        Language.English,
      );
      expect(DIPsService.prototype.findByProposal).not.toBeCalled();
      expect(PullRequestService.prototype.aggregate).not.toBeCalled();
      expect(DIPsService.prototype.getDipLanguagesAvailables).not.toBeCalled();
      expect(SimpleGitService.prototype.getMetaVars).not.toBeCalled();
    });
  });

  describe('smartSearch', () => {
    it('search by field', async () => {
      const result = await controller.smartSearch(
        fieldMock,
        valueMock,
      );

      expect(result).toEqual([dipData_2]);
      expect(DIPsService.prototype.smartSearch).toBeCalledTimes(1);
      expect(DIPsService.prototype.smartSearch).toBeCalledWith(
        fieldMock,
        valueMock,
        undefined,
      );
    });

    it('error while search', async () => {
      jest.spyOn(DIPsService.prototype, 'smartSearch')
        .mockImplementationOnce(async () => {
          throw new Error(errorDropMock);
        });

      try {
        await controller.smartSearch(
          fieldMock,
          valueMock,
          languageMock,
        );
      } catch (error) {
        expect(error.response.error).toEqual(errorDropMock);
      }

      expect(DIPsService.prototype.smartSearch).toBeCalledTimes(1);
      expect(DIPsService.prototype.smartSearch).toBeCalledWith(
        fieldMock,
        valueMock,
        languageMock,
      );
    });
  });

  describe('findOneBy', () => {
    it('find dip by filename', async () => {
      const result = await controller.findOneBy(
        'filename',
        valueMock,
      );

      expect(result).toEqual(dipData_2);
      expect(DIPsService.prototype.findOneByFileName).toBeCalledTimes(1);
      expect(DIPsService.prototype.findOneByFileName).toBeCalledWith(
        valueMock,
        undefined,
      );

      expect(DIPsService.prototype.getSummaryByDipComponent).not.toBeCalled();
      expect(DIPsService.prototype.getSummaryByDipName).not.toBeCalled();
    });

    it('find dip by filename not found', async () => {
      DIPsService.prototype.findOneByFileName = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneBy(
          'filename',
          valueMock,
          Language.Spanish,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `DIP with filename ${valueMock} not found`
        );
      }

      expect(DIPsService.prototype.findOneByFileName).toBeCalledTimes(2);
      expect(DIPsService.prototype.findOneByFileName).toHaveBeenCalledWith(
        valueMock,
        Language.Spanish,
      );
      expect(DIPsService.prototype.findOneByFileName).toHaveBeenCalledWith(
        valueMock,
        Language.English,
      );
      expect(DIPsService.prototype.getSummaryByDipComponent).not.toBeCalled();
      expect(DIPsService.prototype.getSummaryByDipName).not.toBeCalled();
    });

    it('find dip by dipName', async () => {
      const result = await controller.findOneBy(
        'dipName',
        valueMock,
      );

      expect(result).toEqual(dipData_2);
      expect(DIPsService.prototype.getSummaryByDipName).toBeCalledTimes(1);
      expect(DIPsService.prototype.getSummaryByDipName).toBeCalledWith(
        valueMock,
        undefined,
      );
      expect(DIPsService.prototype.getSummaryByDipComponent).not.toBeCalled();
      expect(DIPsService.prototype.findOneByFileName).not.toBeCalled();
    });

    it('find dip by dipName not found', async () => {
      DIPsService.prototype.getSummaryByDipName = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneBy(
          'dipName',
          valueMock,
          Language.Spanish,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `DIP with dipName ${valueMock} not found`
        );
      }

      expect(DIPsService.prototype.getSummaryByDipName).toBeCalledTimes(2);
      expect(DIPsService.prototype.getSummaryByDipName).toHaveBeenCalledWith(
        valueMock,
        Language.Spanish,
      );
      expect(DIPsService.prototype.getSummaryByDipName).toHaveBeenCalledWith(
        valueMock,
        Language.English,
      );
      expect(DIPsService.prototype.getSummaryByDipComponent).not.toBeCalled();
      expect(DIPsService.prototype.findOneByFileName).not.toBeCalled();
    });

    it('find dip by dipSubproposal', async () => {
      const result = await controller.findOneBy(
        'dipSubproposal',
        valueMock,
      );

      expect(result).toEqual(dipData_2);
      expect(DIPsService.prototype.getSummaryByDipName).toBeCalledTimes(1);
      expect(DIPsService.prototype.getSummaryByDipName).toBeCalledWith(
        valueMock,
        undefined,
      );
      expect(DIPsService.prototype.getSummaryByDipComponent).not.toBeCalled();
      expect(DIPsService.prototype.findOneByFileName).not.toBeCalled();
    });

    it('find dip by dipSubproposal not found', async () => {
      DIPsService.prototype.getSummaryByDipName = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneBy(
          'dipSubproposal',
          valueMock,
          Language.Spanish,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `DIP with dipSubproposal ${valueMock} not found`
        );
      }

      expect(DIPsService.prototype.getSummaryByDipName).toBeCalledTimes(2);
      expect(DIPsService.prototype.getSummaryByDipName).toHaveBeenCalledWith(
        valueMock,
        Language.Spanish,
      );
      expect(DIPsService.prototype.getSummaryByDipName).toHaveBeenCalledWith(
        valueMock,
        Language.English,
      );
      expect(DIPsService.prototype.getSummaryByDipComponent).not.toBeCalled();
      expect(DIPsService.prototype.findOneByFileName).not.toBeCalled();
    });

    it('find by dipComponent no match with standar format', async () => {
      try {
        await controller.findOneBy(
          'dipComponent',
          valueMock,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `DIP component not in the standard format, i.e. DIP10c5`
        );
      }

      expect(DIPsService.prototype.getSummaryByDipComponent).not.toBeCalled();
      expect(DIPsService.prototype.findOneByFileName).not.toBeCalled();
      expect(DIPsService.prototype.getSummaryByDipName).not.toBeCalled();
    });

    it('find dip by dipComponent', async () => {
      const result = await controller.findOneBy(
        'dipComponent',
        `DIP${dipNumber_2}c${dipNumber_1}`,
      );

      expect(result).toEqual({
        ...dipData_2,
        components: [components[0]]
      });
      expect(DIPsService.prototype.getSummaryByDipComponent).toBeCalledTimes(1);
      expect(DIPsService.prototype.getSummaryByDipComponent).toBeCalledWith(
        `DIP${dipNumber_2}c${dipNumber_1}`,
        undefined,
      );
      expect(DIPsService.prototype.findOneByFileName).not.toBeCalled();
      expect(DIPsService.prototype.getSummaryByDipName).not.toBeCalled();
    });

    it('find dip by dipComponent not found', async () => {
      DIPsService.prototype.getSummaryByDipComponent = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneBy(
          'dipComponent',
          `DIP${dipNumber_2}c${dipNumber_1}`,
          Language.Spanish,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `DIP with dipComponent DIP${dipNumber_2}c${dipNumber_1} not found`
        );
      }

      expect(DIPsService.prototype.getSummaryByDipComponent).toBeCalledTimes(2);
      expect(DIPsService.prototype.getSummaryByDipComponent).toHaveBeenCalledWith(
        `DIP${dipNumber_2}c${dipNumber_1}`,
        Language.Spanish,
      );
      expect(DIPsService.prototype.getSummaryByDipComponent).toHaveBeenCalledWith(
        `DIP${dipNumber_2}c${dipNumber_1}`,
        Language.English,
      );
      expect(DIPsService.prototype.findOneByFileName).not.toBeCalled();
      expect(DIPsService.prototype.getSummaryByDipName).not.toBeCalled();
    });

    it('find by unsupported field', async () => {
      try {
        await controller.findOneBy(
          fieldMock,
          valueMock,
        );
      } catch (error) {
        expect(error.response.error).toEqual(
          `Field ${fieldMock} not found`
        );
      }

      expect(DIPsService.prototype.getSummaryByDipComponent).not.toBeCalled();
      expect(DIPsService.prototype.findOneByFileName).not.toBeCalled();
      expect(DIPsService.prototype.getSummaryByDipName).not.toBeCalled();
    });
  });

  describe('callback', () => {
    it('parse completed successfully', async () => {
      const result = await controller.callback(requestCallBackMock);

      expect(result).toEqual(parseResultMock);
      expect(crypto.createHmac).toBeCalledTimes(1);
      expect(crypto.createHmac).toBeCalledWith(
        'sha1',
        configService.get<string>(
          Env.WebhooksSecretToken
        ),
      );
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(JSON.stringify(requestCallBackMock.body));
      expect(digest).toBeCalledTimes(1);
      expect(digest).toBeCalledWith("hex");
      expect(crypto.timingSafeEqual).toBeCalledTimes(1);
      expect(crypto.timingSafeEqual).toBeCalledWith(
        Buffer.from(requestCallBackMock.headers["x-hub-signature"]),
        Buffer.from(`sha1=${valueMock}`),
      );
      expect(ParseDIPsService.prototype.loggerMessage).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.loggerMessage).toBeCalledWith("Webhooks works");
      expect(ParseDIPsService.prototype.parse).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.parse).toBeCalledWith();
    });

    it('no signature', async () => {
      const result = await controller.callback(requestCallBackNotHeaderMock);

      expect(result).toEqual(false);
      expect(crypto.createHmac).toBeCalledTimes(1);
      expect(crypto.createHmac).toBeCalledWith(
        'sha1',
        configService.get<string>(
          Env.WebhooksSecretToken
        ),
      );
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(JSON.stringify(requestCallBackNotHeaderMock.body));
      expect(digest).toBeCalledTimes(1);
      expect(digest).toBeCalledWith("hex");
      expect(crypto.timingSafeEqual).not.toBeCalled();
      expect(ParseDIPsService.prototype.loggerMessage).not.toBeCalled();
      expect(ParseDIPsService.prototype.parse).not.toBeCalled();
    });

    it('error while logger', async () => {
      jest.spyOn(ParseDIPsService.prototype, 'parse').mockImplementation(() => {
        throw new Error(errorDropMock);
      });

      try {
        await controller.callback(requestCallBackMock);
      } catch (error) {
        expect(error.response.error).toEqual(errorDropMock);
      }

      expect(crypto.createHmac).toBeCalledTimes(1);
      expect(crypto.createHmac).toBeCalledWith(
        'sha1',
        configService.get<string>(
          Env.WebhooksSecretToken
        ),
      );
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(JSON.stringify(requestCallBackMock.body));
      expect(digest).toBeCalledTimes(1);
      expect(digest).toBeCalledWith("hex");
      expect(crypto.timingSafeEqual).toBeCalledTimes(1);
      expect(crypto.timingSafeEqual).toBeCalledWith(
        Buffer.from(requestCallBackMock.headers["x-hub-signature"]),
        Buffer.from(`sha1=${valueMock}`),
      );
      expect(ParseDIPsService.prototype.loggerMessage).toBeCalledTimes(2);
      expect(ParseDIPsService.prototype.loggerMessage).toHaveBeenCalledWith("Webhooks works");
      expect(ParseDIPsService.prototype.loggerMessage).toHaveBeenCalledWith("Webhooks ERROR");
      expect(ParseDIPsService.prototype.parse).toBeCalledTimes(1);
      expect(ParseDIPsService.prototype.parse).toBeCalledWith();
    });

    it('no timing safe', async () => {
      jest.spyOn(crypto, 'timingSafeEqual')
        .mockReturnValueOnce(false);

      const result = await controller.callback(requestCallBackMock);

      expect(result).toEqual(false);
      expect(crypto.createHmac).toBeCalledTimes(1);
      expect(crypto.createHmac).toBeCalledWith(
        'sha1',
        configService.get<string>(
          Env.WebhooksSecretToken
        ),
      );
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(JSON.stringify(requestCallBackMock.body));
      expect(digest).toBeCalledTimes(1);
      expect(digest).toBeCalledWith("hex");
      expect(crypto.timingSafeEqual).toBeCalledTimes(1);
      expect(crypto.timingSafeEqual).toBeCalledWith(
        Buffer.from(requestCallBackMock.headers["x-hub-signature"]),
        Buffer.from(`sha1=${valueMock}`),
      );
      expect(ParseDIPsService.prototype.loggerMessage).not.toBeCalled();
      expect(ParseDIPsService.prototype.parse).not.toBeCalled();
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});