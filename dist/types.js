"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipolygon = exports.polygon = exports.multiline = exports.line = exports.point = exports.date = exports.boolean = exports.number = exports.text = exports.object = exports.array = void 0;
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const utils_1 = require("./utils");
const isValidGeoJSON_1 = __importDefault(require("./isValidGeoJSON"));
const isValidGeometry_1 = __importDefault(require("./isValidGeometry"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const is_unique_1 = __importDefault(require("is-unique"));
const is_plain_obj_1 = __importDefault(require("is-plain-obj"));
const isValidDate = (v) => {
    if (v instanceof Date)
        return !isNaN(v.getTime()); // already a date
    const parsed = moment_timezone_1.default(v, moment_timezone_1.default.ISO_8601);
    return parsed.isValid() && parsed.toISOString() === v;
};
const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
const getBasicGeoJSONIssues = (v, type) => {
    if (!is_plain_obj_1.default(v))
        return 'Not a valid object';
    if (v.type !== type)
        return `Not a valid type value (Expected ${type} not ${v.type})`;
    if (v.geometry && v.geometry.type !== type)
        return `Not a valid geometry.type value (Expected ${type} not ${v.type})`;
    return true;
};
/*
Validations:
  - name (displayed in the UI)
  - validateValue (function that receives the validation value and returns true/false if it is valid)
  - valueType (should be a valid type in the data type system, the FE displays different inputs based on this)
  - test (receives the validation value, and the datum value and returns true/false if the datum value is valid)
*/
const required = {
    name: 'Required',
    validateValue: (param) => param === true,
    test: (v) => v != null,
    valueType: 'boolean'
};
const enumm = {
    name: 'In List',
    validateValue: (param) => Array.isArray(param) && param.length !== 0,
    test: (v, param) => param.includes(v),
    valueType: 'array'
};
const min = {
    name: 'Minimum',
    validateValue: isNumber,
    test: (v, param) => v >= param,
    valueType: 'number'
};
const max = {
    name: 'Maximum',
    validateValue: isNumber,
    test: (v, param) => v <= param,
    valueType: 'number'
};
exports.array = {
    name: 'List',
    items: true,
    test: (v) => Array.isArray(v),
    validators: {
        required,
        unique: {
            name: 'Unique',
            validateValue: (param) => param === true,
            test: (v) => is_unique_1.default(v),
            valueType: 'boolean'
        },
        notEmpty: {
            name: 'Not Empty',
            validateValue: (param) => param === true,
            test: (v) => v.length !== 0,
            valueType: 'boolean'
        },
        minItems: {
            name: 'Minimum Items',
            validateValue: isNumber,
            test: (v, param) => v.length >= param,
            valueType: 'number'
        },
        maxItems: {
            name: 'Maximum Items',
            validateValue: isNumber,
            test: (v, param) => v.length <= param,
            valueType: 'number'
        }
    }
};
exports.object = {
    name: 'Map',
    test: is_plain_obj_1.default,
    validators: {
        required,
        notEmpty: {
            name: 'Not Empty',
            validateValue: (param) => param === true,
            test: (v) => Object.keys(v).length !== 0,
            valueType: 'boolean'
        },
        minKeys: {
            name: 'Minimum Keys',
            validateValue: (param) => isNumber(param) && param > 0,
            test: (v, param) => Object.keys(v).length >= param,
            valueType: 'number'
        },
        maxKeys: {
            name: 'Maximum Keys',
            validateValue: (param) => isNumber(param) && param > 0,
            test: (v, param) => Object.keys(v).length <= param,
            valueType: 'number'
        }
    }
};
exports.text = {
    name: 'Text',
    test: (v) => typeof v === 'string',
    validators: {
        required,
        notEmpty: {
            name: 'Not Empty',
            validateValue: (param) => param === true,
            test: (v) => v.length !== 0,
            valueType: 'boolean'
        },
        minLength: {
            name: 'Minimum Length',
            validateValue: (param) => isNumber(param) && param > 0,
            test: (v, param) => v.length >= param,
            valueType: 'number'
        },
        maxLength: {
            name: 'Maximum Length',
            validateValue: (param) => isNumber(param) && param > 0,
            test: (v, param) => v.length <= param,
            valueType: 'number'
        },
        enum: enumm,
        url: {
            name: 'URL',
            validateValue: (param) => param === true,
            test: utils_1.isPlainURL,
            valueType: 'boolean'
        },
        image: {
            name: 'Image URL',
            validateValue: (param) => param === true,
            test: utils_1.isPlainURL,
            valueType: 'boolean'
        },
        video: {
            name: 'Video URL',
            validateValue: (param) => param === true,
            test: utils_1.isPlainURL,
            valueType: 'boolean'
        },
        audio: {
            name: 'Audio URL',
            validateValue: (param) => param === true,
            test: utils_1.isPlainURL,
            valueType: 'boolean'
        },
        stream: {
            name: 'Stream URL',
            validateValue: (param) => param === true,
            test: (v) => utils_1.isValidURL(v, [
                'http', 'https', 'rtmp', 'rtmps'
            ]),
            valueType: 'boolean'
        },
        email: {
            name: 'Email',
            validateValue: (param) => param === true,
            test: (v) => isEmail_1.default(v),
            valueType: 'boolean'
        },
        phone: {
            name: 'Phone Number',
            validateValue: (param) => param === true,
            test: (v) => typeof v === 'string',
            valueType: 'boolean'
        },
        address: {
            name: 'Address',
            validateValue: (param) => param === true,
            test: (v) => typeof v === 'string',
            valueType: 'boolean'
        },
        code: {
            name: 'Code',
            validateValue: (param) => param === true,
            test: (v) => typeof v === 'string',
            valueType: 'boolean'
        },
        regex: {
            name: 'Regular Expression',
            validateValue: (param) => {
                try {
                    new RegExp(param);
                    return true;
                }
                catch (err) {
                    return false;
                }
            },
            test: (v, param) => new RegExp(param).test(v),
            valueType: 'text'
        }
    }
};
exports.number = {
    name: 'Number',
    test: isNumber,
    validators: {
        required,
        enum: enumm,
        min,
        max
    },
    measurements: {
        currency: {
            name: 'Currency',
            options: {
                usd: { name: 'USD ($)' },
                eur: { name: 'EUR (€)' }
                // TODO: add the rest
            }
        },
        distance: {
            name: 'Distance',
            options: {
                millimeter: { name: 'Millimeters (mm)' },
                centimeter: { name: 'Centimeters (cm)' },
                meter: { name: 'Meters (m)' },
                kilometer: { name: 'Kilometers (km)' }
            }
        },
        duration: {
            name: 'Duration',
            options: {
                nanosecond: { name: 'Microseconds (µs)' },
                millisecond: { name: 'Milliseconds (ms)' },
                second: { name: 'Seconds (s)' },
                minute: { name: 'Minutes (min)' },
                hour: { name: 'Hours (h)' }
            }
        },
        datePart: {
            name: 'Date Segment',
            options: {
                hourOfDay: { name: 'Hour of Day (0-23)' },
                dayOfWeek: { name: 'Day of Week (1-7)' },
                dayOfMonth: { name: 'Day of Month (1-31)' },
                dayOfYear: { name: 'Day of Year (1-366)' },
                week: { name: 'Week (1-53)' },
                month: { name: 'Month (1-12)' },
                customMonth: { name: 'Custom Month (1-12)' },
                quarter: { name: 'Quarter (1-4)' },
                customQuarter: { name: 'Custom Quarter (1-4)' },
                year: { name: 'Year' },
                customYear: { name: 'Custom Year' },
                decade: { name: 'Decade' }
            }
        },
        speed: {
            name: 'Speed',
            options: {
                kilometer: { name: 'km/h' }
            }
        },
        area: {
            name: 'Area',
            options: {
                millimeter: { name: 'Millimeters (mm²)' },
                centimeter: { name: 'Centimers (cm²)' },
                meter: { name: 'Meters (m²)' },
                kilometer: { name: 'Kilometers (km²)' }
            }
        },
        temperature: {
            name: 'Temperature',
            options: {
                celsius: { name: 'Celsius (°C)' }
            }
        },
        angle: {
            name: 'Angle',
            options: {
                degree: { name: 'Degrees (°)' }
            }
        },
        percentage: {
            name: 'Percentage',
            options: {
                decimal: { name: 'Decimal (0-1)' }
            }
        },
        concentration: {
            name: 'Concentration',
            options: {
                microgram: { name: 'Micrograms per cubic meter (µg/m³)' }
            }
        }
    }
};
exports.boolean = {
    name: 'True/False',
    test: (v) => typeof v === 'boolean',
    validators: { required }
};
exports.date = {
    name: 'Date/Time',
    test: isValidDate,
    validators: {
        required,
        min: {
            name: 'Minimum',
            validateValue: isValidDate,
            test: (v, param) => new Date(v) >= new Date(param),
            valueType: 'date'
        },
        max: {
            name: 'Maximum',
            validateValue: isValidDate,
            test: (v, param) => new Date(v) <= new Date(param),
            valueType: 'date'
        }
    },
    measurements: {
        bucket: {
            name: 'Bucket',
            options: {
                second: { name: 'Second' },
                minute: { name: 'Minute' },
                hour: { name: 'Hour' },
                day: { name: 'Day' },
                week: { name: 'Week' },
                month: { name: 'Month' },
                quarter: { name: 'Quarter' },
                customQuarter: { name: 'Custom Quarter' },
                year: { name: 'Year' },
                customYear: { name: 'Custom Year' },
                decade: { name: 'Decade' },
            }
        }
    }
};
exports.point = {
    name: 'GeoJSON Point',
    geospatial: true,
    test: (v) => getBasicGeoJSONIssues(v, 'Point'),
    testAsync: (v, conn) => __awaiter(void 0, void 0, void 0, function* () {
        const basicIssues = getBasicGeoJSONIssues(v, 'Point');
        if (basicIssues !== true)
            return basicIssues;
        const geojson = yield isValidGeoJSON_1.default(v);
        if (geojson !== true)
            return geojson; // return the reason
        if (conn)
            return isValidGeometry_1.default(v, conn);
        return true;
    }),
    validators: {
        required,
        minLongitude: {
            name: 'Minimum Longitude',
            validateValue: isNumber,
            test: (v, param) => v.coordinates[0] >= param,
            valueType: 'number'
        },
        maxLongitude: {
            name: 'Maximum Longitude',
            validateValue: isNumber,
            test: (v, param) => v.coordinates[0] >= param,
            valueType: 'number'
        },
        minLatitude: {
            name: 'Minimum Latitude',
            validateValue: isNumber,
            test: (v, param) => v.coordinates[1] >= param,
            valueType: 'number'
        },
        maxLatitude: {
            name: 'Maximum Latitude',
            validateValue: isNumber,
            test: (v, param) => v.coordinates[1] >= param,
            valueType: 'number'
        }
    }
};
exports.line = {
    name: 'GeoJSON LineString',
    geospatial: true,
    test: (v) => getBasicGeoJSONIssues(v, 'LineString'),
    testAsync: (v, conn) => __awaiter(void 0, void 0, void 0, function* () {
        const basicIssues = getBasicGeoJSONIssues(v, 'LineString');
        if (basicIssues !== true)
            return basicIssues;
        const geojson = yield isValidGeoJSON_1.default(v);
        if (geojson !== true)
            return geojson; // return the reason
        if (conn)
            return isValidGeometry_1.default(v, conn);
        return true;
    }),
    validators: {
        required
        //minPoints,
        //maxPoints,
        //minLength,
        //maxLength
    }
};
exports.multiline = {
    name: 'GeoJSON MultiLineString',
    geospatial: true,
    test: (v) => getBasicGeoJSONIssues(v, 'MultiLineString'),
    testAsync: (v, conn) => __awaiter(void 0, void 0, void 0, function* () {
        const basicIssues = getBasicGeoJSONIssues(v, 'MultiLineString');
        if (basicIssues !== true)
            return basicIssues;
        const geojson = yield isValidGeoJSON_1.default(v);
        if (geojson !== true)
            return geojson; // return the reason
        if (conn)
            return isValidGeometry_1.default(v, conn);
        return true;
    }),
    validators: {
        required
        //minPoints,
        //maxPoints,
        //minDistance,
        //maxDistance
    }
};
exports.polygon = {
    name: 'GeoJSON Polygon',
    geospatial: true,
    test: (v) => getBasicGeoJSONIssues(v, 'Polygon'),
    testAsync: (v, conn) => __awaiter(void 0, void 0, void 0, function* () {
        const basicIssues = getBasicGeoJSONIssues(v, 'Polygon');
        if (basicIssues !== true)
            return basicIssues;
        const geojson = yield isValidGeoJSON_1.default(v);
        if (geojson !== true)
            return geojson; // return the reason
        if (conn)
            return isValidGeometry_1.default(v, conn);
        return true;
    }),
    validators: {
        required
        //minArea,
        //maxArea
    }
};
exports.multipolygon = {
    name: 'GeoJSON MultiPolygon',
    geospatial: true,
    test: (v) => getBasicGeoJSONIssues(v, 'MultiPolygon'),
    testAsync: (v, conn) => __awaiter(void 0, void 0, void 0, function* () {
        const basicIssues = getBasicGeoJSONIssues(v, 'MultiPolygon');
        if (basicIssues !== true)
            return basicIssues;
        const geojson = yield isValidGeoJSON_1.default(v);
        if (geojson !== true)
            return geojson; // return the reason
        if (conn)
            return isValidGeometry_1.default(v, conn);
        return true;
    }),
    validators: {
        required
        //minArea,
        //maxArea
    }
};
//# sourceMappingURL=types.js.map