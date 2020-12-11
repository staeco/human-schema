import isEmail from 'validator/lib/isEmail'
import { isValidURL, isPlainURL } from './utils'
import isValidGeoJSON from './isValidGeoJSON'
import isValidGeometry from './isValidGeometry'
import moment from 'moment-timezone'
import isUnique from 'is-unique'
import isObject from 'is-plain-obj'
import { GeoObject, Type, Validator } from './typings'

const isValidDate = (v: Date|string) => {
  if (v instanceof Date) return !isNaN(v.getTime()) // already a date
  const parsed = moment(v, moment.ISO_8601)
  return parsed.isValid() && parsed.toISOString() === v
}

const isNumber = (v: number|any) =>
  typeof v === 'number' && Number.isFinite(v)

const getBasicGeoJSONIssues = (v: GeoObject, type: string) => {
  if (!isObject(v)) return 'Not a valid object'
  if (v.type !== type) return `Not a valid type value (Expected ${type} not ${v.type})`
	if (v.geometry && v.geometry.type !== type) return `Not a valid geometry.type value (Expected ${type} not ${v.type})`
  return true
}
/*
Validations:
  - name (displayed in the UI)
  - validateValue (function that receives the validation value and returns true/false if it is valid)
  - valueType (should be a valid type in the data type system, the FE displays different inputs based on this)
  - test (receives the validation value, and the datum value and returns true/false if the datum value is valid)
*/
const required: Validator = {
  name: 'Required',
  validateValue: (param: boolean) => param === true,
  test: (v: any) => v != null,
  valueType: 'boolean'
}
const enumm: Validator = {
  name: 'In List',
  validateValue: (param: any) => Array.isArray(param) && param.length !== 0,
  test: (v: any, param: any) => param.includes(v),
  valueType: 'array'
}
const min: Validator = {
  name: 'Minimum',
  validateValue: isNumber,
  test: (v: any, param: number) => v >= param,
  valueType: 'number'
}
const max: Validator = {
  name: 'Maximum',
  validateValue: isNumber,
  test: (v: any, param: number) => v <= param,
  valueType: 'number'
}
export const array: Type = {
  name: 'List',
  items: true,
  test: (v: any) => Array.isArray(v),
  validators: {
    required,
    unique: {
      name: 'Unique',
      validateValue: (param: boolean) => param === true,
      test: (v: Array<any>) => isUnique(v),
      valueType: 'boolean'
    },
    notEmpty: {
      name: 'Not Empty',
      validateValue: (param: boolean) => param === true,
      test: (v: Array<any>) => v.length !== 0,
      valueType: 'boolean'
    },
    minItems: {
      name: 'Minimum Items',
      validateValue: isNumber,
      test: (v: Array<any>, param: number) => v.length >= param,
      valueType: 'number'
    },
    maxItems: {
      name: 'Maximum Items',
      validateValue: isNumber,
      test: (v: Array<any>, param: number) => v.length <= param,
      valueType: 'number'
    }
  }
}
export const object: Type = {
  name: 'Map',
  test: isObject,
  validators: {
    required,
    notEmpty: {
      name: 'Not Empty',
      validateValue: (param: boolean) => param === true,
      test: (v: any) => Object.keys(v).length !== 0,
      valueType: 'boolean'
    },
    minKeys: {
      name: 'Minimum Keys',
      validateValue: (param: number) => isNumber(param) && param > 0,
      test: (v: any, param: number) => Object.keys(v).length >= param,
      valueType: 'number'
    },
    maxKeys: {
      name: 'Maximum Keys',
      validateValue: (param: number) => isNumber(param) && param > 0,
      test: (v: any, param: number) => Object.keys(v).length <= param,
      valueType: 'number'
    }
  }
}
export const text: Type = {
  name: 'Text',
  test: (v: any) => typeof v === 'string',
  validators: {
    required,
    notEmpty: {
      name: 'Not Empty',
      validateValue: (param: boolean) => param === true,
      test: (v: string) => v.length !== 0,
      valueType: 'boolean'
    },
    minLength: {
      name: 'Minimum Length',
      validateValue: (param: number) => isNumber(param) && param > 0,
      test: (v: any, param: number) => v.length >= param,
      valueType: 'number'
    },
    maxLength: {
      name: 'Maximum Length',
      validateValue: (param: number) => isNumber(param) && param > 0,
      test: (v: any, param: number) => v.length <= param,
      valueType: 'number'
    },
    enum: enumm,
    url: {
      name: 'URL',
      validateValue: (param: boolean) => param === true,
      test: isPlainURL,
      valueType: 'boolean'
    },
    image: {
      name: 'Image URL',
      validateValue: (param: boolean) => param === true,
      test: isPlainURL,
      valueType: 'boolean'
    },
    video: {
      name: 'Video URL',
      validateValue: (param: boolean) => param === true,
      test: isPlainURL,
      valueType: 'boolean'
    },
    audio: {
      name: 'Audio URL',
      validateValue: (param: boolean) => param === true,
      test: isPlainURL,
      valueType: 'boolean'
    },
    stream: {
      name: 'Stream URL',
      validateValue: (param: boolean) => param === true,
      test: (v: string) =>
        isValidURL(v, [
          'http', 'https', 'rtmp', 'rtmps'
        ]),
      valueType: 'boolean'
    },
    email: {
      name: 'Email',
      validateValue: (param: boolean) => param === true,
      test: (v: string) => isEmail(v),
      valueType: 'boolean'
    },
    phone: {
      name: 'Phone Number',
      validateValue: (param: boolean) => param === true,
      test: (v: string) => typeof v === 'string', // TODO: impl this using libphonenumber
      valueType: 'boolean'
    },
    address: {
      name: 'Address',
      validateValue: (param: boolean) => param === true,
      test: (v: string) => typeof v === 'string', // TODO: impl this using something
      valueType: 'boolean'
    },
    code: {
      name: 'Code',
      validateValue: (param: boolean) => param === true,
      test: (v: string) => typeof v === 'string', // TODO: impl this using something
      valueType: 'boolean'
    },
    regex: {
      name: 'Regular Expression',
      validateValue: (param: string) => {
        try {
          new RegExp(param)
          return true
        } catch (err) {
          return false
        }
      },
			test: (v: string, param: string) => new RegExp(param).test(v),
      valueType: 'text'
    }
  }
}
export const number: Type = {
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
      name: 'Part of Date',
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
}
export const boolean: Type = {
  name: 'True/False',
  test: (v: any) => typeof v === 'boolean',
  validators: { required }
}
export const date: Type = {
  name: 'Date/Time',
  test: isValidDate,
  validators: {
    required,
    min: {
      name: 'Minimum',
      validateValue: isValidDate,
      test: (v: Date|string, param: Date|string) => new Date(v) >= new Date(param),
      valueType: 'date'
    },
    max: {
      name: 'Maximum',
      validateValue: isValidDate,
      test: (v: Date|string, param: Date|string) => new Date(v) <= new Date(param),
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
}
export const point: Type = {
  name: 'GeoJSON Point',
  geospatial: true,
  test: (v: any) => getBasicGeoJSONIssues(v, 'Point'),
  testAsync: async (v: any, conn: Object) => { // TODO: sequelize conn type
    const basicIssues = getBasicGeoJSONIssues(v, 'Point')
    if (basicIssues !== true) return basicIssues
    const geojson = await isValidGeoJSON(v)
    if (geojson !== true) return geojson // return the reason
    if (conn) return isValidGeometry(v, conn)
    return true
  },
  validators: {
    required,
    minLongitude: {
      name: 'Minimum Longitude',
      validateValue: isNumber,
      test: (v: GeoObject, param: number) => v.coordinates[0] >= param,
      valueType: 'number'
    },
    maxLongitude: {
      name: 'Maximum Longitude',
      validateValue: isNumber,
      test: (v: GeoObject, param: number) => v.coordinates[0] >= param,
      valueType: 'number'
    },
    minLatitude: {
      name: 'Minimum Latitude',
      validateValue: isNumber,
      test: (v: GeoObject, param: number) => v.coordinates[1] >= param,
      valueType: 'number'
    },
    maxLatitude: {
      name: 'Maximum Latitude',
      validateValue: isNumber,
      test: (v: GeoObject, param: number) => v.coordinates[1] >= param,
      valueType: 'number'
    }
  }
}
export const line: Type = {
  name: 'GeoJSON LineString',
  geospatial: true,
  test: (v: any) => getBasicGeoJSONIssues(v, 'LineString'),
  testAsync: async (v: any, conn: Object) => {
    const basicIssues = getBasicGeoJSONIssues(v, 'LineString')
    if (basicIssues !== true) return basicIssues
    const geojson = await isValidGeoJSON(v)
    if (geojson !== true) return geojson // return the reason
    if (conn) return isValidGeometry(v, conn)
    return true
  },
  validators: {
    required
    //minPoints,
    //maxPoints,
    //minLength,
    //maxLength
  }
}
export const multiline: Type = {
  name: 'GeoJSON MultiLineString',
  geospatial: true,
  test: (v: any) => getBasicGeoJSONIssues(v, 'MultiLineString'),
  testAsync: async (v: any, conn: Object) => {
    const basicIssues = getBasicGeoJSONIssues(v, 'MultiLineString')
    if (basicIssues !== true) return basicIssues
    const geojson = await isValidGeoJSON(v)
    if (geojson !== true) return geojson // return the reason
    if (conn) return isValidGeometry(v, conn)
    return true
  },
  validators: {
    required
    //minPoints,
    //maxPoints,
    //minDistance,
    //maxDistance
  }
}
export const polygon: Type = {
  name: 'GeoJSON Polygon',
  geospatial: true,
  test: (v: any) => getBasicGeoJSONIssues(v, 'Polygon'),
  testAsync: async (v: any, conn: Object) => {
    const basicIssues = getBasicGeoJSONIssues(v, 'Polygon')
    if (basicIssues !== true) return basicIssues
    const geojson = await isValidGeoJSON(v)
    if (geojson !== true) return geojson // return the reason
    if (conn) return isValidGeometry(v, conn)
    return true
  },
  validators: {
    required
    //minArea,
    //maxArea
  }
}
export const multipolygon: Type = {
  name: 'GeoJSON MultiPolygon',
  geospatial: true,
  test: (v: any) => getBasicGeoJSONIssues(v, 'MultiPolygon'),
  testAsync: async (v: any, conn: Object) => {
    const basicIssues = getBasicGeoJSONIssues(v, 'MultiPolygon')
    if (basicIssues !== true) return basicIssues
    const geojson = await isValidGeoJSON(v)
    if (geojson !== true) return geojson // return the reason
    if (conn) return isValidGeometry(v, conn)
    return true
  },
  validators: {
    required
    //minArea,
    //maxArea
  }
}
