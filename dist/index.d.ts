export * as types from './types';
export * from './validateItem';
export { validate } from './validate';
import * as isValidGeoJSON from './isValidGeoJSON';
import * as isValidGeometry from './isValidGeometry';
export declare const utils: {
    isValidGeometry: typeof isValidGeometry;
    isValidGeoJSON: typeof isValidGeoJSON;
    isValidCoordinate: ([lonVal, latVal]: import("./typings").Coordinate) => string | boolean;
    lat: (lat: number) => string | boolean;
    lon: (lon: number) => string | boolean;
};
