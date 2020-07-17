import { GeoObject } from './typings'

const q = 'SELECT ST_IsValidDetail(ST_SetSRID(ST_GeomFromGeoJSON($geojson), 4326));'

// conn is any type to remove the need of importing sequelize
export default async (geojson: GeoObject, conn: any): Promise<boolean|string> => {
  if (Array.isArray(geojson.coordinates) && geojson.coordinates.length === 0) {
    return 'Coordinates array is empty' // This should be changed to false
  }
  const [ res ] = await conn.query(q, {
    type: 'SELECT',
    bind: { geojson }
  })
  if (res.st_isvaliddetail === '(t,,)') return true // true value
  return res.st_isvaliddetail.split(',')[1]
}
