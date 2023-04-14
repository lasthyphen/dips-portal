import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DIP, DIPsSchema } from "./entities/dips.entity";
import { DIPsController } from "./dips.controller";

import { DIPsService } from "./services/dips.service";
import { ParseDIPsService } from "./services/parse-dips.service";
import { SimpleGitService } from "./services/simple-git.service";
import { MarkedService } from "./services/marked.service";
import { GithubService } from "./services/github.service";
import { PullRequest, PullRequestSchema } from "./entities/pull-request.entity";
import { PullRequestService } from "./services/pull-requests.service";
import { ParseDIPsCommand } from "./dips.command";
import { ParseQueryService } from "./services/parse-query.service";
import { Meta, MetaSchema } from "./entities/meta.entity";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: DIP.name,
        collection: DIP.name,
        useFactory: () => {
          const schema = DIPsSchema;
          // schema.index({ filename: 1, hash: 1 }, { unique: true });
          return schema;
        },
      },
      {
        name: PullRequest.name,
        collection: PullRequest.name,
        useFactory: () => {
          const schema = PullRequestSchema;
          return schema;
        },
      },
      {
        name: Meta.name,
        collection: Meta.name,
        useFactory: () => {
          const schema = MetaSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [DIPsController],
  providers: [
    DIPsService,
    SimpleGitService,
    ParseDIPsService,
    ParseQueryService,
    MarkedService,
    GithubService,
    PullRequestService,
    ParseDIPsCommand,
  ],
})
export class DIPsModule { }
