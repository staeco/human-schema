"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainURL = exports.isSecureURL = exports.isValidURL = void 0;
const isURL_1 = __importDefault(require("validator/lib/isURL"));
const isValidURL = (v, protocols) => isURL_1.default(v, {
    protocols,
    require_valid_protocol: true,
    require_protocol: true
});
exports.isValidURL = isValidURL;
const isSecureURL = (v) => exports.isValidURL(v, ['https']);
exports.isSecureURL = isSecureURL;
const isPlainURL = (v) => exports.isValidURL(v, ['http', 'https']);
exports.isPlainURL = isPlainURL;
//# sourceMappingURL=index.js.map