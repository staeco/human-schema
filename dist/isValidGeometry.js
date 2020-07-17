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
Object.defineProperty(exports, "__esModule", { value: true });
const q = 'SELECT ST_IsValidDetail(ST_SetSRID(ST_GeomFromGeoJSON($geojson), 4326));';
// conn is any type to remove the need of importing sequelize
exports.default = (geojson, conn) => __awaiter(void 0, void 0, void 0, function* () {
    if (Array.isArray(geojson.coordinates) && geojson.coordinates.length === 0) {
        return 'Coordinates array is empty'; // This should be changed to false
    }
    const [res] = yield conn.query(q, {
        type: 'SELECT',
        bind: { geojson }
    });
    if (res.st_isvaliddetail === '(t,,)')
        return true; // true value
    return res.st_isvaliddetail.split(',')[1];
});
//# sourceMappingURL=isValidGeometry.js.map