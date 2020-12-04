import * as types from './types'
import operators from './utils/operators.json'
import isObject from 'is-plain-obj'
import { DataType, Field } from './typings'

const reserved = new Set(operators)
const MAX_LENGTH = 128
const MAX_NOTES_LENGTH = 2048

const validateField = (path: Array<string|number>, value: Field): (true|Array<object>) => {
  const errors = []
  const lastSegment = String(path[path.length -1])

  if (!value || !isObject(value)) {
    errors.push({ path, value, message: 'Not a valid field value' })
    return errors
  }

  // key name
  if (reserved.has(lastSegment)) {
    errors.push({ path, value: lastSegment, message: `Not a valid field name, ${lastSegment} is reserved` })
    return errors
  }
  if (lastSegment.length > MAX_LENGTH) errors.push({ value: lastSegment, path: [ ...path, 'name' ], message: `Must be less than ${MAX_LENGTH} characters` })
  // allowed: 'Id12'
  if (lastSegment.match(/[^0-9a-z]/i)) errors.push({ value: lastSegment, path: [ ...path, 'name' ], message: 'Must be alphanumeric' })

  // name
  if (!value.name) errors.push({ value: value.name, path: [ ...path, 'name' ], message: 'This field is required' })
  if (value.name) {
    if (typeof value.name !== 'string') errors.push({ value: value.name, path: [ ...path, 'name' ], message: 'Not a valid text value' })
    if (typeof value.name === 'string') {
      if (value.name.length > MAX_LENGTH) errors.push({ value: value.name, path: [ ...path, 'name' ], message: `Must be less than ${MAX_LENGTH} characters` })
      // allowed: 'Name of 12+ 2018_10 Data-type.'
      if (value.name.match(/[^0-9a-z-_/+/. ]/i)) errors.push({ value: value.name, path: [ ...path, 'name' ], message: 'Must be alphanumeric' })
    }
  }

  // notes
  if (value.notes) {
    if (typeof value.notes !== 'string') errors.push({ value: value.notes, path: [ ...path, 'notes' ], message: 'Not a valid text value' })
    if (typeof value.notes === 'string' && value.notes.length > MAX_NOTES_LENGTH) errors.push({ value: value.notes, path: [ ...path, 'notes' ], message: `Must be less than ${MAX_NOTES_LENGTH} characters` })
  }

  // type
  if (!value.type) errors.push({ value: value.type, path: [ ...path, 'type' ], message: 'This field is required' })
  if (value.type && typeof value.type !== 'string') errors.push({ value: value.type, path: [ ...path, 'type' ], message: 'Not a valid text value' })
  const type = types[value.type]
  if (value.type && !type) errors.push({ value: value.type, path: [ ...path, 'type' ], message: 'Not a valid type value' })

  // items
  if (type && type.items && !value.items) errors.push({ value: value.items, path: [ ...path, 'items' ], message: 'This field is required for this type' })
  if (type && !type.items && value.items) errors.push({ value: value.items, path: [ ...path, 'items' ], message: 'This field should not exist for this type' })
  if (value.items) {
    const fieldErrors = validateField([ ...path, 'items' ], value.items)
    if (fieldErrors !== true) errors.push(...fieldErrors)
  }

  // validation
  if (value.validation && !isObject(value.validation)) errors.push({ value: value.validation, path: [ ...path, 'validation' ], message: 'Not a valid object value' })
  if (type && isObject(value.validation)) {
    Object.keys(value.validation).forEach((k) => {
      const param = value.validation[k]
      const validator = type.validators && type.validators[k]
      if (!validator) errors.push({ value: k, path: [ ...path, 'validation', k ], message: 'Not a valid validation key' })
      if (validator && !validator.validateValue(param)) {
        errors.push({ value: param, path: [ ...path, 'validation', k ], message: param == null ? 'Missing validation value' : 'Not a valid validation value' })
      }
    })
  }

  // measurement
  if (value.measurement && !isObject(value.measurement)) errors.push({ value: value.measurement, path: [ ...path, 'measurement' ], message: 'Not a valid object value' })
  if (value.measurement && !type.measurements) errors.push({ value: value.measurement, path: [ ...path, 'measurement' ], message: 'This field should not exist for this type' })
  if (type && isObject(value.measurement) && type.measurements) {
    if (!value.measurement.type) errors.push({ value: value.measurement.type, path: [ ...path, 'measurement', 'type' ], message: 'This field is required' })
    const measure = value.measurement.type && type.measurements && type.measurements[value.measurement.type]
    if (!measure) errors.push({ value: value.measurement.type, path: [ ...path, 'measurement', 'type' ], message: 'Not a valid measurement type value' })
    if (measure && !measure.options[value.measurement.value]) errors.push({ value: value.measurement.value, path: [ ...path, 'measurement', 'value' ], message: 'Not a valid measurement value' })
  }

  if (errors.length === 0) return true
  return errors
}

export const validate = (dataType: DataType, { full=true }={}): (true|Array<object>) => {
  const errors = []
  if (!dataType || !isObject(dataType)) {
    errors.push({ value: dataType, message: 'Not a valid top-level object' })
    return errors
  }

  if (full) {
    // id
    if (!dataType.id) errors.push({ value: dataType.id, path: [ 'id' ], message: 'This field is required' })
    if (dataType.id && typeof dataType.id !== 'string') errors.push({ value: dataType.id, path: [ 'id' ], message: 'Not a valid text value' })

    // name
    if (!dataType.name) errors.push({ value: dataType.name, path: [ 'name' ], message: 'This field is required' })
    if (dataType.name && typeof dataType.name !== 'string') errors.push({ value: dataType.name, path: [ 'name' ], message: 'Not a valid text value' })

    // notes
    if (!dataType.notes) errors.push({ value: dataType.notes, path: [ 'notes' ], message: 'This field is required' })
    if (dataType.notes && typeof dataType.notes !== 'string') errors.push({ value: dataType.notes, path: [ 'notes' ], message: 'Not a valid text value' })

    // official
    if (dataType.official != null && typeof dataType.official !== 'boolean') errors.push({ value: dataType.official, path: [ 'official' ], message: 'Not a valid boolean value' })
  }

  // schema
  if (!dataType.schema) errors.push({ value: dataType.schema, path: [ 'schema' ], message: 'This field is required' })
  if (dataType.schema && !isObject(dataType.schema)) errors.push({ value: dataType.schema, path: [ 'schema' ], message: 'Not a valid object value' })
  if (dataType.schema && isObject(dataType.schema)) {
    Object.keys(dataType.schema).forEach((k) => {
      const fieldErrors = validateField([ 'schema', k ], dataType.schema[k])
      if (fieldErrors !== true) errors.push(...fieldErrors)
    })
  }

  // temporal
  if (dataType.temporal && !isObject(dataType.temporal)) errors.push({ value: dataType.temporal, path: [ 'temporal' ], message: 'Not a valid object value' })
  if (dataType.temporal && isObject(dataType.temporal)) {
    if (!dataType.temporal.primary) errors.push({ value: dataType.temporal.primary, path: [ 'temporal', 'primary' ], message: 'This field is required' })
    if (typeof dataType.temporal.primary !== 'string') errors.push({ value: dataType.temporal.primary, path: [ 'temporal', 'primary' ], message: 'Not a valid string value' })
    const primarySchema = dataType.schema?.[dataType.temporal.primary]
    if (!primarySchema || primarySchema.type !== 'date') errors.push({ value: dataType.temporal.primary, path: [ 'temporal', 'primary' ], message: 'Not a valid date field' })
  }

  if (errors.length === 0) return true
  return errors
}
