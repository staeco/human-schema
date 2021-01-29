// @ts-nocheck
import { validate, clean } from '../src'
import crime from './911-call.json'
import should from 'should'

const badField = {
  uuid: 'abcef',
  name: 'Bad Field',
  abc: false,
  notes: 'Testing!',
  type: 'array',
  validation: {
    notEmpty: true
  },
  items: {
    uuid: 'abcef',
    name: 'Bad Item',
    abc: false,
    notes: 'Testing!',
    type: 'number',
    measurement: {
      type: 'currency',
      value: 'usd',
      abd: 'efg'
    },
    validation: {
      min: 0
    }
  }
}
const cleanField = {
  name: 'Bad Field',
  notes: 'Testing!',
  type: 'array',
  validation: {
    notEmpty: true
  },
  items: {
    name: 'Bad Item',
    notes: 'Testing!',
    type: 'number',
    measurement: {
      type: 'currency',
      value: 'usd'
    },
    validation: {
      min: 0
    }
  }
}
const dirtyCrime = {
  ...crime,
  schema: {
    ...crime.schema,
    badField
  }
}
const cleanCrime = {
  ...crime,
  schema: {
    ...crime.schema,
    badField: cleanField
  }
}
describe('tables#dataType#clean', () => {
  it('clean() should filter out unused keys', async () => {
    should(clean(dirtyCrime)).eql(cleanCrime)
  })
  it('clean() should pass validation after', async () => {
    should(validate(clean(dirtyCrime))).eql(true)
  })
})
