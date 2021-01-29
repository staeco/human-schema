import { Coordinate } from './typings';
export declare const lat: (lat: number) => true | string;
export declare const lon: (lon: number) => true | string;
export declare const isValidCoordinate: ([lonVal, latVal]: Coordinate) => true | string;
