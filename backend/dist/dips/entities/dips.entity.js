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
exports.ErrorModelSchema = exports.DIPsSchema = exports.ErrorObjectModel = exports.ErrorObject = exports.Dips = exports.DIP = exports.Component = exports.Reference = exports.Section = exports.Language = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
var Language;
(function (Language) {
    Language["English"] = "en";
    Language["Spanish"] = "es";
})(Language = exports.Language || (exports.Language = {}));
class Section {
}
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Section.prototype, "heading", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Section.prototype, "depth", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Section.prototype, "dipComponent", void 0);
exports.Section = Section;
class Reference {
}
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reference.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reference.prototype, "link", void 0);
exports.Reference = Reference;
class Component {
}
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Component.prototype, "cName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Component.prototype, "cTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Component.prototype, "cBody", void 0);
exports.Component = Component;
let DIP = class DIP {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "file", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "filename", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "hash", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: Language.English,
    }),
    __metadata("design:type", String)
], DIP.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: -1,
        type: Number,
    }),
    __metadata("design:type", Number)
], DIP.prototype, "dip", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "dipName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: -1,
        type: Number,
    }),
    __metadata("design:type", Number)
], DIP.prototype, "subproposal", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], DIP.prototype, "dipFather", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], DIP.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "extra", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: "",
        type: String,
    }),
    __metadata("design:type", String)
], DIP.prototype, "proposal", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "contributors", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "types", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "dateProposed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "dateRatified", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "dependencies", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "replaces", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "sentenceSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "paragraphSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [Object],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "sections", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "sectionsRaw", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [Object],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "references", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [Object],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "components", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DIP.prototype, "subproposalsCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "votingPortalLink", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "forumLink", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "dipCodeNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], DIP.prototype, "sectionsRaw_plain", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: "",
        type: String,
    }),
    __metadata("design:type", String)
], DIP.prototype, "proposal_plain", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], DIP.prototype, "title_plain", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "dipName_plain", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DIP.prototype, "filename_plain", void 0);
DIP = __decorate([
    (0, mongoose_1.Schema)()
], DIP);
exports.DIP = DIP;
class Dips {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Dips.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Dips.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Dips.prototype, "hash", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        default: Language.English,
    }),
    __metadata("design:type", String)
], Dips.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        default: -1,
        type: Number,
    }),
    __metadata("design:type", Number)
], Dips.prototype, "dip", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "dipName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        default: -1,
        type: Number,
    }),
    __metadata("design:type", Number)
], Dips.prototype, "subproposal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        default: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], Dips.prototype, "dipFather", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], Dips.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        default: "",
        type: String,
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "proposal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
    }),
    __metadata("design:type", Array)
], Dips.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
    }),
    __metadata("design:type", Array)
], Dips.prototype, "contributors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
    }),
    __metadata("design:type", Array)
], Dips.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "types", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "dateProposed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "dateRatified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        required: false,
    }),
    __metadata("design:type", Array)
], Dips.prototype, "dependencies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "replaces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "sentenceSummary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "paragraphSummary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [Object],
        required: false,
    }),
    __metadata("design:type", Array)
], Dips.prototype, "sections", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        required: false,
    }),
    __metadata("design:type", Array)
], Dips.prototype, "sectionsRaw", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [Object],
        required: false,
    }),
    __metadata("design:type", Array)
], Dips.prototype, "references", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [Object],
        required: false,
    }),
    __metadata("design:type", Array)
], Dips.prototype, "components", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", Number)
], Dips.prototype, "subproposalsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "votingPortalLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "forumLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "dipCodeNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        required: false,
    }),
    __metadata("design:type", Array)
], Dips.prototype, "sectionsRaw_plain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        default: "",
        type: String,
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "proposal_plain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], Dips.prototype, "title_plain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        required: false,
    }),
    __metadata("design:type", String)
], Dips.prototype, "dipName_plain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Dips.prototype, "filename_plain", void 0);
exports.Dips = Dips;
let ErrorObject = class ErrorObject {
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ErrorObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ErrorObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ErrorObject.prototype, "error", void 0);
ErrorObject = __decorate([
    (0, mongoose_1.Schema)()
], ErrorObject);
exports.ErrorObject = ErrorObject;
class ErrorObjectModel {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ErrorObjectModel.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ErrorObjectModel.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ErrorObjectModel.prototype, "error", void 0);
exports.ErrorObjectModel = ErrorObjectModel;
exports.DIPsSchema = mongoose_1.SchemaFactory.createForClass(DIP);
exports.ErrorModelSchema = mongoose_1.SchemaFactory.createForClass(ErrorObject);
exports.DIPsSchema.index({ title: "text", dipName: "text", sectionsRaw: "text" });
//# sourceMappingURL=dips.entity.js.map