import { DataType } from './typings';
export declare const clean: (dataType: DataType) => {
    schema: {};
    id: string;
    name: string;
    notes?: string;
    temporal?: {
        [name: string]: string;
    };
};
