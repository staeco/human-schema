"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = __importDefault(require("@mapbox/geojsonhint/lib/object"));
const isValidCoordinate_1 = require("./isValidCoordinate");
const ignore = new Set([
    'Polygons and MultiPolygons should follow the right-hand rule',
    'geometry object cannot contain a "properties" member'
]);
const validCoordinates = (coords) => {
    if (!Array.isArray(coords))
        return 'Coordinates not an array';
    if (coords.length === 0)
        return 'Coordinates array is empty';
    if (Array.isArray(coords[0])) {
        // recurse, this is basically a `find` but returns the right value
        for (let i = 0; i < coords.length; i++) {
            // typecast what ts thinks is a number as Coordinate
            const co = coords[i];
            const issue = validCoordinates(co);
            if (issue !== true)
                return issue;
        }
        return true;
    }
    return isValidCoordinate_1.isValidCoordinate(coords);
};
exports.default = (v) => __awaiter(void 0, void 0, void 0, function* () {
    const coordinateValidity = validCoordinates(v.coordinates);
    if (coordinateValidity !== true)
        return `Invalid coordinates${coordinateValidity ? ` - ${coordinateValidity}` : ''}`;
    const hints = object_1.default.hint(v).filter((i) => !ignore.has(i.message));
    if (hints.length !== 0)
        return hints[0].message;
    return true;
});
//# sourceMappingURL=isValidGeoJSON.js.map