"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateItem = void 0;
const types = __importStar(require("./types"));
// support JS objects coming in, since all validators expect JSON
const serialize = (v) => v && typeof v.toJSON === 'function' ? v.toJSON() : v;
const requiredValidator = types.text.validators.required; // pull it out of any type, theyre all the same
const validateField = (path, field, value, conn) => __awaiter(void 0, void 0, void 0, function* () {
    if (!field)
        return true;
    const errors = [];
    const { type, items, validation } = field;
    value = serialize(value);
    const exists = yield requiredValidator.test(value, null, conn);
    // if not required and value is empty, bail out
    if ((!validation || !validation.required) && !exists) {
        return true;
    }
    // check validation first
    if (validation && validation.required && !exists) {
        errors.push({
            path,
            value,
            message: 'This field is required'
        });
        return errors;
    }
    // top-level type check
    if (!types[type])
        throw new Error(`Invalid type present: ${type}`);
    const result = yield types[type].test(value, null, conn);
    if (result !== true) {
        errors.push({
            path,
            value,
            message: result || `Not a valid ${type} value`
        });
        return errors;
    }
    // check all type specific validators
    if (validation) {
        yield Promise.all(Object.keys(validation).map((k) => __awaiter(void 0, void 0, void 0, function* () {
            const param = validation[k];
            const spec = types[type].validators[k];
            const vresult = yield spec.test(value, param);
            if (vresult !== true) {
                errors.push({
                    path,
                    validator: k,
                    value,
                    // TODO: built-in types should provide good messages usable for UI
                    message: vresult || `Failed ${spec.name} validation`
                });
            }
        })));
    }
    // subitems
    if (items) {
        yield Promise.all(value.map((subvalue, index) => __awaiter(void 0, void 0, void 0, function* () {
            const fieldErrors = yield validateField([...path, index], items, serialize(subvalue), conn);
            if (fieldErrors !== true)
                errors.push(...fieldErrors);
        })));
    }
    if (errors.length === 0)
        return true;
    return errors;
});
exports.validateItem = (dataType, item, conn) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = [];
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errors.push({ value: item, message: 'Not a valid top-level object' });
        return errors;
    }
    yield Promise.all(Object.keys(dataType.schema).map((k) => __awaiter(void 0, void 0, void 0, function* () {
        const fieldErrors = yield validateField([k], dataType.schema[k], item[k], conn);
        if (fieldErrors !== true)
            errors.push(...fieldErrors);
    })));
    if (errors.length === 0)
        return true;
    return errors;
});
//# sourceMappingURL=validateItem.js.map