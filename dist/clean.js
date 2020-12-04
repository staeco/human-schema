"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = void 0;
const lodash_pickby_1 = __importDefault(require("lodash.pickby"));
// strips unused fields from schema fields
const cleanField = (f) => lodash_pickby_1.default({
    name: f.name,
    notes: f.notes,
    type: f.type,
    measurement: f.measurement
        ? { type: f.measurement.type, value: f.measurement.value }
        : undefined,
    items: f.items ? cleanField(f.items) : undefined,
    validation: f.validation
}, (v) => v != null);
const clean = (dataType) => (Object.assign(Object.assign({}, dataType), { schema: Object.entries(dataType.schema).reduce((acc, [k, v]) => {
        acc[k] = cleanField(v);
        return acc;
    }, {}) }));
exports.clean = clean;
//# sourceMappingURL=clean.js.map