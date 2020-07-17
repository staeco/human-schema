export * as types from './types'
export * from './validateItem'
export { validate } from './validate'

import * as isValidGeoJSON from './isValidGeoJSON'
import * as isValidGeometry from './isValidGeometry'
import { isValidCoordinate, lat, lon } from './isValidCoordinate'

export const utils = {
	isValidGeometry,
	isValidGeoJSON,
	isValidCoordinate,
	lat,
	lon
}
