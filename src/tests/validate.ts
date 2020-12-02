// @ts-nocheck
import { validate } from '../'
import crime from './911-call.json'
import should from 'should'

describe('tables#dataType#validate', () => {
  it('validate() should return true on crime spec', async () => {
    should(validate(crime))
  })

  it('validate() should return errors on bad dataType', async () => {
    should(validate(null)).containEql({
      value: null,
      message: 'Not a valid top-level object'
    })
		// @ts-ignore
    should(validate(1)).containEql({
      value: 1,
      message: 'Not a valid top-level object'
    })
		// @ts-ignore
    should(validate('123')).containEql({
      value: '123',
      message: 'Not a valid top-level object'
    })
  })

  it('validate() should return errors on missing id', async () => {
		// @ts-ignore
    should(validate({})).containEql({
      path: [ 'id' ],
      message: 'This field is required',
      value: undefined
    })
  })
  it('validate() should return errors on bad id', async () => {
		// @ts-ignore
    should(validate({ id: 1 })).containEql({
      value: 1,
      path: [ 'id' ],
      message: 'Not a valid text value'
    })
  })
  it('validate() should return errors on missing name', async () => {
		// @ts-ignore
    should(validate({ id: '1' })).containEql({
      path: [ 'name' ],
      message: 'This field is required',
      value: undefined
    })
  })
  it('validate() should return errors on bad name', async () => {
		// @ts-ignore
    should(validate({ id: '1', name: 1 })).containEql({
      path: [ 'name' ],
      value: 1,
      message: 'Not a valid text value'
    })
  })
  it('validate() should fail on spec with missing field name', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          type: 'text'
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'name' ],
        message: 'This field is required',
        value: undefined
      }
    ])
  })
  it('validate() should fail on spec with reserved field name', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        $or: {
          name: 'test',
          type: 'number'
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', '$or' ],
        message: 'Not a valid field name, $or is reserved',
        value: '$or'
      }
    ])
  })
  it('validate() should fail on spec with invalid field name', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 123,
          type: 'text'
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'name' ],
        value: 123,
        message: 'Not a valid text value'
      }
    ])
  })
  it('validate() should fail on spec with empty field name', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: '',
          type: 'text'
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'name' ],
        value: '',
        message: 'This field is required'
      }
    ])
  })
  it('validate() should fail on spec with empty field type', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'yo',
          type: ''
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'type' ],
        value: '',
        message: 'This field is required'
      }
    ])
  })
  it('validate() should fail on spec with invalid field type', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'nothing'
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'type' ],
        message: 'Not a valid type value',
        value: 'nothing'
      }
    ])
  })
  it('validate() should fail on spec with invalid field measurement', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'number',
          measurement: 123
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'measurement' ],
        message: 'Not a valid object value',
        value: 123
      }
    ])
  })
  it('validate() should fail on spec with invalid field measurement type', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'number',
          measurement: {
            type: 123
          }
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'measurement', 'type' ],
        message: 'Not a valid measurement type value',
        value: 123
      }
    ])
  })
  it('validate() should fail on spec with invalid field measurement value', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'number',
          measurement: {
            type: 'currency',
            value: 123
          }
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'measurement', 'value' ],
        message: 'Not a valid measurement value',
        value: 123
      }
    ])
  })
  it('validate() should fail on spec with extraneous field measurement', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'text',
          measurement: {
            type: 'currency',
            value: 123
          }
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'measurement' ],
        message: 'This field should not exist for this type',
        value: spec.schema.dummy.measurement
      }
    ])
  })
  it('validate() should pass on spec with valid field measurement', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'number',
          measurement: {
            type: 'currency',
            value: 'usd'
          }
        }
      }
    }
    should.equal(validate(spec), true)
  })
  it('validate() should fail on spec with invalid field validator key', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'text',
          validation: {
            test: true
          }
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'validation', 'test' ],
        message: 'Not a valid validation key',
        value: 'test'
      }
    ])
  })
  it('validate() should fail on spec with invalid field validator value', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'text',
          validation: {
            minLength: true
          }
        }
      }
    }
    should(validate(spec)).eql([
      {
        path: [ 'schema', 'dummy', 'validation', 'minLength' ],
        message: 'Not a valid validation value',
        value: true
      }
    ])
  })
  it('validate() should validate on spec with field validator value', async () => {
    const spec = {
      ...crime,
      schema: {
        ...crime.schema,
        dummy: {
          name: 'Dummy',
          type: 'text',
          validation: {
            minLength: 12
          }
        }
      }
    }
    should(validate(spec)).eql(true)
  })
})
