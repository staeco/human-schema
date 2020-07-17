import { Coordinate } from './typings'
export const lat = (lat: number): (boolean|string) => {
  if (typeof lat !== 'number') return `Latitude not a number, got ${typeof lat}`
  if (lat > 90) return 'Latitude greater than 90'
  if (lat < -90) return 'Latitude less than -90'
  return true
}

export const lon = (lon: number): (boolean|string) => {
  if (typeof lon !== 'number') return `Longitude not a number, got ${typeof lon}`
  if (lon < -180) return 'Longitude less than -180'
  if (lon > 180) return 'Longitude greater than 180'
  return true
}

export const isValidCoordinate = ([ lonVal, latVal ]: Coordinate): (boolean|string) => {
  const latv = lat(latVal)
  if (typeof latv === 'string') return latv
  const lonv = lon(lonVal)
  if (typeof lonv === 'string') return lonv
  if (lonVal === 0 && latVal === 0) return 'Longitude and latitude were both 0' // null island
  return true
}
