import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

import * as crypto from "crypto";

import { DIPsService } from "./services/dips.service";
import { ParseDIPsService } from "./services/parse-dips.service";
import { PullRequestService } from "./services/pull-requests.service";

import { Env } from "@app/env";
import { Filters, PaginationQueryDto } from "./dto/query.dto";
import { ErrorObjectModel, Language, Dips } from "./entities/dips.entity";
import { SimpleGitService } from "./services/simple-git.service";

@Controller("dips")
@ApiTags("dips")
export class DIPsController {
  constructor(
    private dipsService: DIPsService,
    private parseDIPsService: ParseDIPsService,
    private pullRequestService: PullRequestService,
    private simpleGitService: SimpleGitService,
    private configService: ConfigService
  ) { }

  @Get("findall")
  @ApiOperation({
    summary: "Find all dips",
    description: "This is return array of dips by the custom params defined (limite, page, order, select, lang, search, filter).",
  })
  @ApiQuery({
    name: "limit",
    description: "Limit per page, default value 10",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "page",
    description: "Page, default value equal to zero",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "order",
    description: `Fields the dips will be ordered by, i.e. 'title -dip', means: order property title ASC and dip DESC`,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "select",
    description: `Select files to get output`,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang selected for the files to return. If file language not found, it default to english version`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiQuery({
    name: "search",
    description:
      'The search field treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes (") that specifies a phrase',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "filter",
    description:
      "Filter field with various filter patterns. (contains, notcontains, equals, notequals, inarray)",
    required: false,
    type: 'object',
    schema: {
      type: 'object',
      example: {
        filter: {
          contains: [{ field: "", value: "" }],
          notcontains: [{ field: "", value: "" }],
          equals: [{ field: "dip", value: -1 }],
          notequals: [{ field: "dip", value: -1 }],
          inarray: [{ field: "dipName", value: ["DIP0", "DIP1", "DIP2", "DIP3", "DIP4", "DIP5"] }],
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: [Dips],
    status: 200,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given dip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
  async findAll(
    @Query("limit") limit?: string,
    @Query("page") page?: string,
    @Query("order") order?: string,
    @Query("select") select?: string,
    @Query("lang") lang?: Language,
    @Query("search") search?: string,
    @Query("filter") filter?: Filters
  ) {
    try {
      const paginationQueryDto: PaginationQueryDto = {
        limit: +limit || 10,
        page: +page,
      };

      return await this.dipsService.findAll(
        paginationQueryDto,
        order,
        search,
        filter,
        select,
        lang
      );
    } catch (error) {

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("findone")
  @ApiOperation({
    summary: "Find one dip",
    description: "This is return a dip by name (dipName parameter)",
  })
  @ApiQuery({
    name: "lang",
    description: `Lang selected for the file to return. If file language not found, it default to english version`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiQuery({
    name: "dipName",
    description: `Dip name you want looking for`,
    type: String,
    required: false,
  })
  @ApiCreatedResponse({
    status: 200,
    type: Dips,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given dip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
  async findOneByDipName(
    @Query("dipName") dipName: string,
    @Query("lang") lang?: Language,
  ) {
    let dip = await this.dipsService.findOneByDipName(dipName, lang);

    if (!dip) {
      dip = await this.dipsService.findOneByDipName(dipName, Language.English);

      if (!dip) {
        throw new NotFoundException(`DIPs with name ${dipName} not found`);
      }
    }

    let subproposals = [];

    if (!dip.proposal) {
      subproposals = await this.dipsService.findByProposal(dip.dipName);
    }

    try {
      const pullRequests = await this.pullRequestService.aggregate(
        dip.filename
      );

      const languagesAvailables = await this.dipsService.getDipLanguagesAvailables(
        dipName
      );

      const metaVars = await this.simpleGitService.getMetaVars();

      return { dip, pullRequests, subproposals, languagesAvailables, metaVars };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get("smart-search")
  @ApiOperation({
    summary: "Find array dips match with parameters",
    description:
      "This is return a array of dips. You can search by ```tags``` and ```status```",
  })
  @ApiQuery({
    type: String,
    name: "field",
    description: "Field the smart search is execute by. You can use tags or status",
    required: true,
  })
  @ApiQuery({
    type: String,
    name: "value",
    description: "Value to execute the smart search",
    required: true,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang selected for the files to return. If file language not found, it default to english version`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiCreatedResponse({
    type: [Dips],
    status: 200,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given dip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
  async smartSearch(
    @Query("field") field: string,
    @Query("value") value: string,
    @Query("lang") lang?: Language
  ) {
    try {
      return await this.dipsService.smartSearch(field, value, lang);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("findone-by")
  @ApiOperation({
    summary: "Find one dip that match with parameters ",
    description: `Search by different types of field example  (field: filename , value:dip1 ) return dip
  `,
  })
  @ApiQuery({
    type: String,
    name: "field",
    description: 'Field the search is execute by.',
    required: true,
  })
  @ApiQuery({
    type: String,
    name: "value",
    description: 'Value to execute the search',
    required: true,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang selected for the files to return. If file language not found, it default to english version`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiCreatedResponse({
    type: Dips,
    status: 200,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given dip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
  async findOneBy(
    @Query("field") field: string,
    @Query("value") value: string,
    @Query("lang") lang?: Language
  ) {
    let dip;

    switch (field) {
      case "filename":
        dip = await this.dipsService.findOneByFileName(value, lang);
        if (!dip && (!lang || lang !== Language.English)) {
          dip = await this.dipsService.findOneByFileName(
            value,
            Language.English
          );
          if (!dip) {
            throw new NotFoundException(
              `DIP with ${field} ${value} not found`
            );
          }
        }
        return dip;

      case "dipName":
      case "dipSubproposal":
        //Left temporaly to backward compatibilities only
        dip = await this.dipsService.getSummaryByDipName(value, lang);

        if (!dip && (!lang || lang !== Language.English)) {
          dip = await this.dipsService.getSummaryByDipName(
            value,
            Language.English
          );
          if (!dip) {
            throw new NotFoundException(
              `DIP with ${field} ${value} not found`
            );
          }
        }
        return dip;

      case "dipComponent":
        if (!value.match(/DIP\d+[ac]\d+/gi)) {
          throw new NotFoundException(
            `DIP component not in the standard format, i.e. DIP10c5`
          );
        }

        dip = await this.dipsService.getSummaryByDipComponent(value, lang);

        if (!dip || dip.components.length !== 1
          && (!lang || lang !== Language.English)) {
          dip = await this.dipsService.getSummaryByDipComponent(
            value,
            Language.English
          );
          if (!dip || dip.components.length !== 1) {
            throw new NotFoundException(`DIP with ${field} ${value} not found`);
          }
        }
        return dip;

      default:
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Field ${field} not found`,
          },
          HttpStatus.BAD_REQUEST
        );
    }
  }

  @Post("callback")
  @ApiOperation({
    summary: "Call back to check the hash ",
    description: "This call back to check that the hash is correct signed",
  })
  @ApiQuery({
    name: "headers",
    description: 'Headers to check the hash. x-hub-signature is needed',
    type: 'object',
    required: true,
  })
  @ApiQuery({
    name: "body",
    description: 'Callback body to check the hash',
    type: 'object',
    required: true,
  })
  @ApiCreatedResponse({
    type: Boolean,
    status: 200,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given dip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
  async callback(@Req() { headers, body }: any): Promise<boolean> {
    try {
      const secretToken = this.configService.get<string>(
        Env.WebhooksSecretToken
      );

      const hmac = crypto.createHmac("sha1", secretToken);
      const selfSignature = hmac.update(JSON.stringify(body)).digest("hex");
      const comparisonSignature = `sha1=${selfSignature}`; // shape in GitHub header

      const signature = headers["x-hub-signature"];

      if (!signature) {
        return false;
      }

      const source = Buffer.from(signature);
      const comparison = Buffer.from(comparisonSignature);

      if (!crypto.timingSafeEqual(source, comparison)) {
        return false;
      }

      this.parseDIPsService.loggerMessage("Webhooks works");

      return this.parseDIPsService.parse();
    } catch (error) {
      this.parseDIPsService.loggerMessage("Webhooks ERROR");

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
