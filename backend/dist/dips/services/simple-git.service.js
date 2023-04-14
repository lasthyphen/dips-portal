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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SimpleGitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleGitService = void 0;
const promises_1 = require("fs/promises");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const simple_git_1 = require("simple-git");
const env_1 = require("../../env");
const dips_entity_1 = require("../entities/dips.entity");
const meta_entity_1 = require("../entities/meta.entity");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let SimpleGitService = SimpleGitService_1 = class SimpleGitService {
    constructor(metaDocument, configService) {
        this.metaDocument = metaDocument;
        this.configService = configService;
        this.logger = new common_1.Logger(SimpleGitService_1.name);
        const options = {
            baseDir: `${process.cwd()}/${this.configService.get(env_1.Env.FolderRepositoryName)}`,
            binary: "git",
            maxConcurrentProcesses: 6,
        };
        this.git = (0, simple_git_1.default)(options);
        this.baseDir = `${process.cwd()}/${this.configService.get(env_1.Env.FolderRepositoryName)}`;
    }
    cloneRepository() {
        const localPath = `${process.cwd()}/${this.configService.get(env_1.Env.FolderRepositoryName)}`;
        return this.git.clone(this.configService.get(env_1.Env.RepoPath), localPath);
    }
    async pull(remote = "origin", branch = "master") {
        try {
            return await this.git.pull(remote, branch);
        }
        catch (error) {
            this.logger.error({ error, text: 'Error autoresolved by hard reset origin/master strategy' });
            await this.git.fetch(['--all']);
            await this.git.reset(["--hard", "origin/master"]);
            return this.git.pull(remote, branch);
        }
    }
    async getFiles() {
        const folderPattern = this.configService.get(env_1.Env.FolderPattern);
        const patternI18N = "I18N";
        try {
            const englishFiles = await this.git.raw([
                "ls-files",
                "-s",
                folderPattern,
            ]);
            const internationalsFiles = await this.git.raw([
                "ls-files",
                "-s",
                patternI18N,
            ]);
            const info = englishFiles + "\n" + internationalsFiles;
            return info
                .split("\n")
                .filter((data) => data.length > 3 &&
                !data.includes("placeholder.md") &&
                !data.includes("Template") &&
                data.includes(".md"))
                .map((data) => {
                const newData = data.split(/[\t ]/gmi);
                if (newData.length > 4) {
                    let filename = newData[3];
                    for (let i = 4; i < newData.length; i++) {
                        filename = `${filename} ${newData[i]}`;
                    }
                    return {
                        filename: filename,
                        hash: newData[1].trim(),
                        language: this.getLanguage(filename),
                    };
                }
                return {
                    filename: newData[3].trim(),
                    hash: newData[1].trim(),
                    language: this.getLanguage(newData[3].trim()),
                };
            });
        }
        catch (error) {
            this.logger.error(error);
            return error;
        }
    }
    getLanguage(filename) {
        const languageMatch = filename.match(/I18N\/(?<language>\w\w)\//i);
        if (languageMatch) {
            const languageString = languageMatch.groups.language.toLowerCase();
            if (Object.values(dips_entity_1.Language).includes(languageString)) {
                return languageString;
            }
        }
        return dips_entity_1.Language.English;
    }
    async saveMetaVars() {
        const baseVars = "meta/vars.yaml";
        const varsI18NPattern = "I18N/*/meta/vars.yaml";
        const varsI18N = await this.git.raw([
            "ls-files",
            "-s",
            varsI18NPattern,
        ]);
        const languagesFiles = varsI18N.match(/I18N\/\w\w\/meta\/vars\.yaml/gi);
        const translationsFiles = languagesFiles
            ? [...languagesFiles, baseVars]
            : [baseVars];
        let translationContent = [];
        try {
            translationContent = await Promise.all(translationsFiles.map((item) => (0, promises_1.readFile)(this.baseDir + "/" + item, "utf-8")));
        }
        catch (error) {
            console.log({ error });
        }
        const languagesArray = translationsFiles.map((item) => {
            const match = item.match(/I18N\/(?<languageCode>\w\w)\/meta\/vars\.yaml/i);
            return match ? match.groups.languageCode.toLowerCase() : dips_entity_1.Language.English;
        });
        const translationMeta = translationContent.map((item, index) => ({
            language: languagesArray[index],
            translations: item,
        }));
        await this.metaDocument.deleteMany({});
        await this.metaDocument.insertMany(translationMeta);
    }
    async getMetaVars() {
        return this.metaDocument.find({});
    }
};
SimpleGitService = SimpleGitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(meta_entity_1.Meta.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        config_1.ConfigService])
], SimpleGitService);
exports.SimpleGitService = SimpleGitService;
//# sourceMappingURL=simple-git.service.js.map