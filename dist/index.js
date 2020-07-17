"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
exports.types = __importStar(require("./types"));
__exportStar(require("./validateItem"), exports);
var validate_1 = require("./validate");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validate_1.validate; } });
const isValidGeoJSON = __importStar(require("./isValidGeoJSON"));
const isValidGeometry = __importStar(require("./isValidGeometry"));
const isValidCoordinate_1 = require("./isValidCoordinate");
exports.utils = {
    isValidGeometry,
    isValidGeoJSON,
    isValidCoordinate: isValidCoordinate_1.isValidCoordinate,
    lat: isValidCoordinate_1.lat,
    lon: isValidCoordinate_1.lon
};
//# sourceMappingURL=index.js.map