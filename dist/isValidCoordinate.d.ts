import { Coordinate } from './typings';
export declare const lat: (lat: number) => (boolean | string);
export declare const lon: (lon: number) => (boolean | string);
export declare const isValidCoordinate: ([lonVal, latVal]: Coordinate) => (boolean | string);
