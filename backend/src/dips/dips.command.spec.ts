import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ParseDIPsCommand } from "./dips.command";
import { DIPsModule } from "./dips.module";
import { errorDropMock } from "./services/data-test/data";
import { DIPsService } from "./services/dips.service";
import { ParseDIPsService } from "./services/parse-dips.service";
const faker = require("faker");

describe('ParseDIPsCommand', () => {
  let service: ParseDIPsCommand;
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
            useCreateIndex: true,
            useFindAndModify: false,
          }),
          inject: [ConfigService],
        }),
      ]
    }).compile();

    faker.seed('ParseDIPsCommand');

    service = module.get<ParseDIPsCommand>(ParseDIPsCommand);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    DIPsService.prototype.dropDatabase = jest.fn(() => Promise.resolve());
    ParseDIPsService.prototype.parse = jest.fn(() => Promise.resolve(faker.datatype.boolean()));
    console.log = jest.fn();
  });

  jest.setTimeout(3 * 60 * 1000);

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe('drop', () => {
    it('drop database', async () => {
      await service.drop();

      expect(DIPsService.prototype.dropDatabase).toHaveBeenCalledTimes(1);
      expect(DIPsService.prototype.dropDatabase).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith("Database Droped: ", undefined);
    });

    it('error drop database', async () => {
      jest.spyOn(DIPsService.prototype, 'dropDatabase')
        .mockImplementationOnce(async () => {
          throw new Error(errorDropMock);
        });

      await service.drop();

      expect(DIPsService.prototype.dropDatabase).toHaveBeenCalledTimes(1);
      expect(DIPsService.prototype.dropDatabase).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith("An Error happend on Droping the Database");
      expect(console.log).toHaveBeenCalledWith(errorDropMock);
    });
  });

  describe('parse', () => {
    it('parse dips', async () => {
      await service.parse();

      expect(ParseDIPsService.prototype.parse).toHaveBeenCalledTimes(1);
      expect(ParseDIPsService.prototype.parse).toHaveBeenCalledWith();
    });
  });

  describe('dropUp', () => {
    it('drop database and parse again', async () => {
      await service.dropUp();

      expect(DIPsService.prototype.dropDatabase).toHaveBeenCalledTimes(1);
      expect(DIPsService.prototype.dropDatabase).toHaveBeenCalledWith();
      expect(ParseDIPsService.prototype.parse).toHaveBeenCalledTimes(1);
      expect(ParseDIPsService.prototype.parse).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith("PLEASE AVOID USING THIS FUNCTION");
      expect(console.log).toHaveBeenCalledWith("Database Droped: ", undefined);
    });

    it('drop database', async () => {
      jest.spyOn(DIPsService.prototype, 'dropDatabase')
        .mockImplementationOnce(async () => {
          throw new Error(errorDropMock);
        });

      await service.dropUp();

      expect(DIPsService.prototype.dropDatabase).toHaveBeenCalledTimes(1);
      expect(DIPsService.prototype.dropDatabase).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith("An Error happend on Droping the Database");
      expect(console.log).toHaveBeenCalledWith(errorDropMock);
      expect(ParseDIPsService.prototype.parse).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});