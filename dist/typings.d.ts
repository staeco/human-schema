import { GeoJSON } from 'geojson';
export interface Type {
    name: string;
    test: (value: any) => boolean | string;
    testAsync?: (value: any, conn?: Object) => Promise<boolean | string>;
    items?: boolean;
    schema?: boolean;
    geospatial?: boolean;
    validators?: {
        [name: string]: Validator;
    };
    measurements?: {
        [name: string]: Measurement;
    };
}
export interface Validator {
    name: string;
    valueType?: string;
    test: (value: any, param: any) => boolean;
    testAsync?: (value: any, conn?: Object) => Promise<boolean>;
    validateValue?: (v: any) => any;
}
export interface Measurement {
    name: string;
    options: {
        [name: string]: {
            name: string;
        };
    };
}
export declare type Coordinate = [number?, number?];
export declare type Coordinates = (Coordinate | number)[];
export interface GeoBase {
    coordinates: Coordinates;
}
export interface GeoObject extends GeoBase {
    type: string;
    geometry?: GeoJSON;
}
export declare type Schema = {
    [name: string]: Field;
};
export interface DataType {
    id: string;
    name: string;
    notes?: string;
    official?: boolean;
    temporal?: {
        [name: string]: string;
    };
    schema: Schema;
}
export declare type Field = {
    name: string;
    items?: Field;
    schema?: Schema;
    notes?: string;
    type: string;
    validation?: {
        [name: string]: any;
    };
    measurement?: {
        type: string;
        value: string;
    };
};
