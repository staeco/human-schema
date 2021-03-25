import pickBy from 'lodash.pickby'
import { DataType, Field, Schema } from './typings'

// strips unused fields from schema fields
const cleanField = (f: Field) =>
  pickBy(
    {
      name: f.name?.trim(),
      notes: f.notes?.trim(),
      type: f.type,
      measurement: f.measurement
        ? { type: f.measurement.type, value: f.measurement.value }
        : undefined,
      items: f.items ? cleanField(f.items) : undefined,
      schema: f.schema ? cleanSchema(f.schema) : undefined,
      validation: f.validation
    },
    (v) => v != null
  )

const cleanSchema = (schema: Schema) =>
  Object.entries(schema).reduce((acc, [k, v]) => {
    acc[k.trim()] = cleanField(v)
    return acc
  }, {})

export const clean = (dataType: DataType): DataType => ({
  ...dataType,
  name: dataType.name?.trim(),
  notes: dataType.notes?.trim(),
  schema: cleanSchema(dataType.schema)
})
