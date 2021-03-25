"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = void 0;
const lodash_pickby_1 = __importDefault(require("lodash.pickby"));
// strips unused fields from schema fields
const cleanField = (f) => lodash_pickby_1.default({
    name: f.name?.trim(),
    notes: f.notes?.trim(),
    type: f.type,
    measurement: f.measurement
        ? { type: f.measurement.type, value: f.measurement.value }
        : undefined,
    items: f.items ? cleanField(f.items) : undefined,
    schema: f.schema ? cleanSchema(f.schema) : undefined,
    validation: f.validation
}, (v) => v != null);
const cleanSchema = (schema) => Object.entries(schema).reduce((acc, [k, v]) => {
    acc[k.trim()] = cleanField(v);
    return acc;
}, {});
const clean = (dataType) => ({
    ...dataType,
    name: dataType.name?.trim(),
    notes: dataType.notes?.trim(),
    schema: cleanSchema(dataType.schema)
});
exports.clean = clean;
//# sourceMappingURL=clean.js.map