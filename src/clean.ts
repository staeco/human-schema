import pickBy from 'lodash.pickby'
import { DataType, Field } from './typings'

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
      validation: f.validation
    },
    (v) => v != null
  )

export const clean = (dataType: DataType): DataType => ({
  ...dataType,
  name: dataType.name?.trim(),
  notes: dataType.notes?.trim(),
  schema: Object.entries(dataType.schema).reduce((acc, [k, v]) => {
    acc[k.trim()] = cleanField(v)
    return acc
  }, {})
})
