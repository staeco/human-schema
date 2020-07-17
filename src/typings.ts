import { GeoJSON } from 'geojson'

export interface Type {
	name: string
	valueType?: string
	test: (value: any, param?: any, conn?: Object) => boolean | Promise<any>
	hydrate?: (v: any) => any
	validateValue?: (v: any) => any
	items?: boolean
	geospatial?: boolean
	validators?: any
	measurements?: any
}
export type Coordinate = [ number?, number? ]
export type Coordinates = (Coordinate|number)[] // [ Coordinate ] | Coordinate

export interface GeoBase {
	coordinates: Coordinates
}
export interface GeoObject extends GeoBase {
	type: string
	geometry?: GeoJSON
}

export interface DataType {
	id: string
	name: string
	notes?: string
	validation?: any
	official?: boolean
	schema?: any
	temporal?: {
		[name: string]: string
	}
}
export interface Field {
	id: string
	name: string
	items?: Field
	notes?: string
	type: string
	validation: any
	measurement: {
		[name: string]: string
	}
}
