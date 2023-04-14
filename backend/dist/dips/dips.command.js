"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseDIPsCommand = void 0;
const nestjs_command_1 = require("nestjs-command");
const common_1 = require("@nestjs/common");
const parse_dips_service_1 = require("./services/parse-dips.service");
const dips_service_1 = require("./services/dips.service");
let ParseDIPsCommand = class ParseDIPsCommand {
    constructor(parseDIPsService, dipsService) {
        this.parseDIPsService = parseDIPsService;
        this.dipsService = dipsService;
    }
    async drop() {
        try {
            const result = await this.dipsService.dropDatabase();
            console.log("Database Droped: ", result);
        }
        catch (error) {
            console.log("An Error happend on Droping the Database");
            console.log(error.message);
        }
    }
    async parse() {
        await this.parseDIPsService.parse();
    }
    async dropUp() {
        try {
            const result = await this.dipsService.dropDatabase();
            console.log("PLEASE AVOID USING THIS FUNCTION");
            console.log("Database Droped: ", result);
            await this.parseDIPsService.parse();
        }
        catch (error) {
            console.log("An Error happend on Droping the Database");
            console.log(error.message);
        }
    }
};
__decorate([
    (0, nestjs_command_1.Command)({
        command: "drop:db",
        describe: "Clear dips database collections",
        autoExit: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParseDIPsCommand.prototype, "drop", null);
__decorate([
    (0, nestjs_command_1.Command)({
        command: "parse:dips",
        describe: "Parse dips of makerDao repository",
        autoExit: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParseDIPsCommand.prototype, "parse", null);
__decorate([
    (0, nestjs_command_1.Command)({
        command: "dropUp:db",
        describe: "Drop db and Parse dips of makerDao repository",
        autoExit: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParseDIPsCommand.prototype, "dropUp", null);
ParseDIPsCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [parse_dips_service_1.ParseDIPsService,
        dips_service_1.DIPsService])
], ParseDIPsCommand);
exports.ParseDIPsCommand = ParseDIPsCommand;
//# sourceMappingURL=dips.command.js.map