import pickBy from 'lodash.pickby'
import { DataType, Field } from './typings'

// strips unused fields from schema fields
const cleanField = (f: Field) =>
  pickBy(
    {
      name: f.name,
      notes: f.notes,
      type: f.type,
      measurement: f.measurement
        ? { type: f.measurement.type, value: f.measurement.value }
        : undefined,
      items: f.items ? cleanField(f.items) : undefined,
      validation: f.validation
    },
    (v) => v != null
  )

export const clean = (dataType: DataType): DataType => ({
  ...dataType,
  schema: Object.entries(dataType.schema).reduce((acc, [k, v]) => {
    acc[k] = cleanField(v)
    return acc
  }, {})
})
