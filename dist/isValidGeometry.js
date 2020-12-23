"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const q = 'SELECT ST_IsValidDetail(ST_SetSRID(ST_GeomFromGeoJSON($geojson), 4326));';
// conn is any type to remove the need of importing sequelize
exports.default = async (geojson, conn) => {
    if (Array.isArray(geojson.coordinates) && geojson.coordinates.length === 0) {
        return 'Coordinates array is empty'; // This should be changed to false
    }
    const [res] = await conn.query(q, {
        type: 'SELECT',
        bind: { geojson }
    });
    if (res.st_isvaliddetail === '(t,,)')
        return true; // true value
    return res.st_isvaliddetail.split(',')[1];
};
//# sourceMappingURL=isValidGeometry.js.map