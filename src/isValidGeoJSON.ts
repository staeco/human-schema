import geojsonhint from '@mapbox/geojsonhint/lib/object'
import { isValidCoordinate } from './isValidCoordinate'
import { Coordinate, Coordinates, GeoBase } from './typings'

const ignore = new Set([
  'Polygons and MultiPolygons should follow the right-hand rule',
  'geometry object cannot contain a "properties" member'
])

const validCoordinates = (coords: Coordinates): (boolean|string) => {
  if (!Array.isArray(coords)) return 'Coordinates not an array'
  if (coords.length === 0) return 'Coordinates array is empty'
  if (Array.isArray(coords[0])) {
    // recurse, this is basically a `find` but returns the right value
    for (let i = 0; i < coords.length; i++) {
			// typecast what ts thinks is a number as Coordinate
			const co = coords[i] as Coordinate
      const issue = validCoordinates(co)
      if (issue !== true) return issue
    }
    return true
  }
  return isValidCoordinate(coords as Coordinate)
}

export default async (v: GeoBase): Promise<boolean|string> => {
  const coordinateValidity = validCoordinates(v.coordinates)
  if (coordinateValidity !== true) return `Invalid coordinates${coordinateValidity ? ` - ${coordinateValidity}` : ''}`
  const hints = geojsonhint.hint(v).filter((i) => !ignore.has(i.message))
  if (hints.length !== 0) return hints[0].message
  return true
}
