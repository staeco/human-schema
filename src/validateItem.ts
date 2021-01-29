import { DataType, Field } from './typings'
import * as types from './types'

// support JS objects coming in, since all validators expect JSON
const serialize = (v: any) =>
  v && typeof v.toJSON === 'function' ? v.toJSON() : v

const requiredValidator = types.text.validators.required // pull it out of any type, theyre all the same

const validateField = async (
  path: Array<string | number>,
  field: Field,
  value: any,
  conn?: Object
): Promise<true | Array<object>> => {
  if (!field) return true
  const errors = []
  const { type, items, validation } = field
  value = serialize(value)
  const exists = requiredValidator.test(value, true)

  // if not required and value is empty, bail out
  if ((!validation || !validation.required) && !exists) {
    return true
  }

  // check validation first
  if (validation && validation.required && !exists) {
    errors.push({
      path,
      value,
      message: 'This field is required'
    })
    return errors
  }

  // top-level type check
  if (!types[type]) throw new Error(`Invalid type present: ${type}`)
  const result = types[type].testAsync
    ? await types[type].testAsync(value, conn)
    : types[type].test(value)
  if (result !== true) {
    errors.push({
      path,
      value,
      message: result || `Not a valid ${type} value`
    })
    return errors
  }

  // check all type specific validators
  if (validation) {
    await Promise.all(
      Object.keys(validation).map(async (k) => {
        const param = validation[k]
        const spec = types[type].validators[k]
        const vresult = spec.testAsync
          ? await spec.testAsync(value, param)
          : spec.test(value, param)
        if (vresult !== true) {
          errors.push({
            path,
            validator: k,
            value,
            // TODO: built-in types should provide good messages usable for UI
            message: vresult || `Failed ${spec.name} validation`
          })
        }
      })
    )
  }

  // subitems
  if (items) {
    await Promise.all(
      value.map(async (subvalue: any, index: number) => {
        const fieldErrors = await validateField(
          [...path, index],
          items,
          serialize(subvalue),
          conn
        )
        if (fieldErrors !== true) errors.push(...fieldErrors)
      })
    )
  }

  if (errors.length === 0) return true
  return errors
}

export const validateItem = async (
  dataType: DataType,
  item: Object,
  conn?: Object
): Promise<true | Array<object>> => {
  const errors = []
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    errors.push({ value: item, message: 'Not a valid top-level object' })
    return errors
  }

  await Promise.all(
    Object.keys(dataType.schema).map(async (k) => {
      const fieldErrors = await validateField(
        [k],
        dataType.schema[k],
        item[k],
        conn
      )
      if (fieldErrors !== true) errors.push(...fieldErrors)
    })
  )
  if (errors.length === 0) return true
  return errors
}
