import { HttpException, HttpStatus } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language, DIP } from "../../src/dips/entities/dips.entity";
import { DIPsController } from "../../src/dips/dips.controller";
import { DIPsModule } from "../../src/dips/dips.module";
import { dipData, dipData_2, dipNumber_1, dipNumber_2, smartSearchFieldMock, statusResultMock, tagResultMock } from "../../src/dips/services/data-test/data";
import { DIPsService } from "../../src/dips/services/dips.service";
const faker = require("faker");

describe('DIPsController', () => {
  let module: TestingModule;
  let controller: DIPsController;
  let dipsService: DIPsService;
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

    faker.seed('DIPsController');

    controller = module.get<DIPsController>(DIPsController);
    dipsService = module.get<DIPsService>(DIPsService);
  });

  describe('findAll', () => {
    it('should return an empty array when no dip is found', async () => {
      const { items: dip } = await controller.findAll(Language.English);

      expect(dip).toBeDefined();
      expect(dip.length).toBe(0);
    });

    it('should throw an error trying to build filters', async () => {
      try {
        await controller.findAll(Language.English);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    describe('existing data', () => {
      let dip_1;
      let dip_2;
      let expectedDip_1;
      let expectedDip_2;

      beforeEach(async () => {
        dip_1 = await dipsService.create({
          ...dipData,
          language: Language.Spanish,
        });
        expectedDip_1 = {
          ...dipData,
          _id: dip_1._id,
        };
        delete expectedDip_1.file;
        delete expectedDip_1.sectionsRaw;
        dip_2 = await dipsService.create({
          ...dipData_2,
          language: Language.English,
        });
        expectedDip_2 = {
          ...dipData_2,
          _id: dip_2._id,
        };
        delete expectedDip_2.file;
        delete expectedDip_2.sectionsRaw;
      });

      it('should return an array of dips', async () => {
        const { items: dip } = await controller.findAll();

        expect(dip).toBeDefined();
        expect(dip.length).toEqual(1);
        expect(dip).toEqual([
          expectedDip_2,
        ]);
      });

      it('should return an array of dips with one element (using limit)', async () => {
        const limit = faker.datatype.number({
          min: 1,
          max: 30,
        });
        const { items: dip } = await controller.findAll(`${limit}`);

        expect(dip).toBeDefined();
        expect(dip.length).toEqual(1);
        expect(dip).toEqual([expectedDip_2]);
      });

      it('should return an empty array of dips with one element (using limit and page)', async () => {
        const limit = faker.datatype.number({
          min: 1,
          max: 30,
        });
        const page = faker.datatype.number({
          min: 0,
          max: 1,
        });
        const { items: dip } = await controller.findAll(`${limit}`, `${page}`);

        expect(dip).toBeDefined();
        expect(dip.length).toEqual(page === 0 ? 1 : 0);
      });

      it('should return an array of dips with one element (using lang)', async () => {
        const { items: dip } = await controller.findAll(undefined, undefined, undefined, undefined, Language.English);

        expect(dip).toBeDefined();
        expect(dip.length).toEqual(1);
        expect(dip).toEqual([expectedDip_2]);
      });

      it('should return an array of dips with one element (using search)', async () => {
        const { items: dip } = await controller.findAll(undefined, undefined, undefined, undefined, undefined, `DIP${dipNumber_2}`);

        expect(dip).toBeDefined();
        expect(dip.length).toEqual(1);
        expect(dip).toEqual([expectedDip_2]);
      });

      it('should return an array of dips with one element (using filters)', async () => {
        const { items: dip } = await controller.findAll(undefined, undefined, undefined, undefined, undefined, undefined, {
          contains: [
            {
              field: 'filename',
              value: `DIP${dipNumber_2}`,
            }
          ],
          notcontains: [
            {
              field: 'filename',
              value: `DIP${dipNumber_1}`,
            }
          ],
          notequals: [
            {
              field: 'filename',
              value: `DIP${dipNumber_1}/dip${dipNumber_1}.md`,
            }
          ],
          equals: [
            {
              field: 'filename',
              value: `DIP${dipNumber_2}/dip${dipNumber_2}.md`,
            }
          ],
          inarray: [{
            field: 'filename',
            value: [`DIP${dipNumber_2}/dip${dipNumber_2}.md`],
          }],
        });

        expect(dip).toBeDefined();
        expect(dip.length).toEqual(1);
        expect(dip).toEqual([expectedDip_2]);
      });

      afterEach(async () => {
        await dipsService.update(dip_1._id, {
          ...dip_1,
          language: Language.English,
        });
        const { items: dips } = await dipsService.findAll({ limit: 10, page: 0 });
        await dipsService.deleteManyByIds(
          dips.map((dip) => dip._id)
        );
      });
    });
  });

  describe('smartSearch', () => {
    it('shoud return an array with no dips by tags', async () => {
      const dips = await controller.smartSearch('tags', '');

      expect(dips).toBeDefined();
      expect(dips.length).toEqual(0);
    });

    it('shoud return an array with no dips by status', async () => {
      const dips = await controller.smartSearch('status', '');

      expect(dips).toBeDefined();
      expect(dips.length).toEqual(0);
    });

    it('shoud throw an error by incorrect field name', async () => {
      try {
        await controller.smartSearch(smartSearchFieldMock, '');
      } catch (error) {
        expect(error).toEqual(new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Field ${smartSearchFieldMock} invalid`,
          },
          HttpStatus.BAD_REQUEST
        ));
      }
    });

    describe('existing data', () => {
      let dip_1;
      let dip_2;
      let expectedDip_1;
      let expectedDip_2;

      beforeEach(async () => {
        dip_1 = await dipsService.create({
          ...dipData,
          language: Language.Spanish,
        });
        expectedDip_1 = {
          ...dipData,
          _id: dip_1._id,
        };
        delete expectedDip_1.file;
        delete expectedDip_1.sectionsRaw;
        dip_2 = await dipsService.create({
          ...dipData_2,
          language: Language.English,
        });
        expectedDip_2 = {
          ...dipData_2,
          _id: dip_2._id,
        };
        delete expectedDip_2.file;
        delete expectedDip_2.sectionsRaw;
      });

      it('should return an emty array by tag in wrong language', async () => {
        const dips = await controller.smartSearch('tags', dip_1.tags[0], Language.English);

        expect(dips).toBeDefined();
        expect(dips.length).toEqual(0);
      });

      it('should return an emty array by status in wrong language', async () => {
        const dips = await controller.smartSearch('status', dip_2.status, Language.Spanish);

        expect(dips).toBeDefined();
        if (dip_2.status === dip_1.status) {
          expect(dips.length).toEqual(1);
        } else {
          expect(dips.length).toEqual(0);
        }
      });

      it('should return one dip by tag', async () => {
        const dips = await controller.smartSearch('tags', dip_1.tags[0], Language.Spanish);

        expect(dips).toBeDefined();
        expect(dips.length).toEqual(1);
        expect(dips[0]).toEqual(tagResultMock);
      });

      it('should return one dip by status', async () => {
        const dips = await controller.smartSearch('status', dip_2.status, Language.English);

        expect(dips).toBeDefined();
        expect(dips.length).toEqual(1);
        expect(dips[0]).toEqual(statusResultMock);
      });

      afterEach(async () => {
        await dipsService.update(dip_1._id, {
          ...dip_1,
          language: Language.English,
        });
        const { items: dips } = await dipsService.findAll({ limit: 10, page: 0 });
        await dipsService.deleteManyByIds(
          dips.map((dip) => dip._id)
        );
      });
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});
