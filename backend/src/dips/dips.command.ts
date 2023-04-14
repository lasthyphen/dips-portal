import { Command } from "nestjs-command";
import { Injectable } from "@nestjs/common";
import { ParseDIPsService } from "./services/parse-dips.service";
import { DIPsService } from "./services/dips.service";

@Injectable()
export class ParseDIPsCommand {
  constructor(
    private readonly parseDIPsService: ParseDIPsService,
    private readonly dipsService: DIPsService
  ) { }

  @Command({
    command: "drop:db",
    describe: "Clear dips database collections",
    autoExit: true,
  })
  async drop() {
    try {
      const result = await this.dipsService.dropDatabase();

      console.log("Database Droped: ", result);
    } catch (error) {
      console.log("An Error happend on Droping the Database");
      console.log(error.message);
    }
  }

  @Command({
    command: "parse:dips",
    describe: "Parse dips of makerDao repository",
    autoExit: true,
  })
  async parse() {
    await this.parseDIPsService.parse();
  }

  @Command({
    command: "dropUp:db",
    describe: "Drop db and Parse dips of makerDao repository",
    autoExit: true,
  })
  async dropUp() {
    try {
      const result = await this.dipsService.dropDatabase();

      console.log("PLEASE AVOID USING THIS FUNCTION")

      console.log("Database Droped: ", result);

      await this.parseDIPsService.parse();
    } catch (error) {
      console.log("An Error happend on Droping the Database");
      console.log(error.message);
    }
  }
}
