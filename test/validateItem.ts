import { validateItem, validate } from '../src'
import should from 'should'
import badMultiPolygon from './bad-multipolygon.json'
import { client } from './pg'

const base = {
  id: '1',
  name: 'test',
  notes: 'its a test datum'
}
describe('tables#dataType#validateItem', () => {
  it('validateItem() should return true on a valid text item', async () => {
    const spec = {
      ...base,
      schema: {
        name: {
          type: 'text',
          name: 'Name',
          validation: {
            minLength: 1,
            maxLength: 10
          }
        }
      }
    }
    const item = {
      name: 'eric'
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).equal(true)
  })
  it('validateItem() should return true on a valid date ISO item', async () => {
    const spec = {
      ...base,
      schema: {
        startedAt: {
          type: 'date',
          name: 'Started'
        }
      }
    }
    const item = {
      startedAt: new Date().toISOString()
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).equal(true)
  })
  it('validateItem() should return true on a valid date object item', async () => {
    const spec = {
      ...base,
      schema: {
        startedAt: {
          type: 'date',
          name: 'Started'
        }
      }
    }
    const item = {
      startedAt: new Date()
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).equal(true)
  })
  it('validateItem() should return true on a valid array item', async () => {
    const spec = {
      ...base,
      schema: {
        name: {
          type: 'array',
          name: 'Names',
          validation: {
            minItems: 1,
            maxItems: 10
          },
          items: {
            name: 'Name',
            type: 'text',
            validation: {
              minLength: 1,
              maxLength: 10
            }
          }
        }
      }
    }
    const item = {
      names: ['eric', 'john']
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).equal(true)
  })
  it('validateItem() should return true on a valid object item', async () => {
    const spec = {
      ...base,
      schema: {
        info: {
          type: 'object',
          name: 'Info',
          schema: {
            names: {
              type: 'array',
              name: 'Names',
              validation: {
                minItems: 1,
                maxItems: 10
              },
              items: {
                name: 'Name',
                type: 'text',
                validation: {
                  minLength: 1,
                  maxLength: 10
                }
              }
            }
          }
        }
      }
    }
    const item = {
      info: {
        names: ['eric', 'john']
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).equal(true)
  })
  it('validateItem() should return errors on a invalid object item', async () => {
    const spec = {
      ...base,
      schema: {
        info: {
          type: 'object',
          name: 'Info',
          schema: {
            names: {
              type: 'array',
              name: 'Names',
              validation: {
                minItems: 1,
                maxItems: 10
              },
              items: {
                name: 'Name',
                type: 'text',
                validation: {
                  minLength: 1,
                  maxLength: 10
                }
              }
            }
          }
        }
      }
    }
    const item = {
      info: {
        names: ['eric', '']
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).eql([
      {
        message: 'Failed Minimum Length validation',
        path: ['info', 'names', 1],
        validator: 'minLength',
        value: ''
      }
    ])
  })
  it('validateItem() should return error on missing text item', async () => {
    const spec = {
      ...base,
      schema: {
        name: {
          type: 'text',
          name: 'Name',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {}
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).not.equal(true)
  })
  it('validateItem() should return true on missing optional text item', async () => {
    const spec = {
      ...base,
      schema: {
        name: {
          type: 'text',
          name: 'Name',
          validation: {
            minLength: 1,
            maxLength: 10
          }
        }
      }
    }
    const item = {}
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).equal(true)
  })
  it('validateItem() should return true on valid geojson type', async () => {
    const spec = {
      ...base,
      schema: {
        location: {
          type: 'point',
          name: 'Location',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      location: {
        type: 'Point',
        coordinates: [1, 1]
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).equal(true)
  })
  it('validateItem() should return errors on null island coordinates', async () => {
    const spec = {
      ...base,
      schema: {
        location: {
          type: 'point',
          name: 'Location',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).eql([
      {
        path: ['location'],
        message: 'Invalid coordinates - Longitude and latitude were both 0',
        value: item.location
      }
    ])
  })
  it('validateItem() should return errors on invalid coordinates', async () => {
    const spec = {
      ...base,
      schema: {
        location: {
          type: 'point',
          name: 'Location',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      location: {
        type: 'Point',
        coordinates: [1000, 1000]
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).eql([
      {
        path: ['location'],
        message: 'Invalid coordinates - Latitude greater than 90',
        value: item.location
      }
    ])
  })
  it('validateItem() should return errors on nested invalid coordinates', async () => {
    const spec = {
      ...base,
      schema: {
        area: {
          type: 'multipolygon',
          name: 'Area',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      area: badMultiPolygon
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).eql([
      {
        path: ['area'],
        message: 'Invalid coordinates - Latitude greater than 90',
        value: item.area
      }
    ])
  })
  it('validateItem() should return errors on invalid geojson type', async () => {
    const spec = {
      ...base,
      schema: {
        location: {
          type: 'point',
          name: 'Location',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      location: {
        type: 'fgkdf',
        coordinates: [1, 1]
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).eql([
      {
        path: ['location'],
        message: 'Not a valid type value (Expected Point not fgkdf)',
        value: item.location
      }
    ])
  })
  it('validateItem() should return errors on invalid geojson object', async () => {
    const spec = {
      ...base,
      schema: {
        location: {
          type: 'point',
          name: 'Location',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      location: {
        type: 'Point',
        coordinates: {}
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).eql([
      {
        path: ['location'],
        message: 'Invalid coordinates - Coordinates not an array',
        value: item.location
      }
    ])
  })
  it('validateItem() should return errors on empty geojson coordinates', async () => {
    const spec = {
      ...base,
      schema: {
        location: {
          type: 'point',
          name: 'Location',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      location: {
        type: 'Point',
        coordinates: []
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).eql([
      {
        path: ['location'],
        message: 'Invalid coordinates - Coordinates array is empty',
        value: item.location
      }
    ])
  })
  it('validateItem() should return errors on invalid geojson geometry', async () => {
    if (process.env.NO_DB) return // on CI and testing in non-DB mode, this will only fail with advanced db validation so skip
    const spec = {
      ...base,
      schema: {
        area: {
          type: 'polygon',
          name: 'Area',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [1, 1],
            [1, 3],
            [3, 3],
            [3, 1],
            [0, 4],
            [1, 1]
          ]
        ]
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item, client)).eql([
      {
        path: ['area'],
        message: 'Self-intersection',
        value: item.area
      }
    ])
  })
  it('validateItem() should return true on valid geojson geometry', async () => {
    const spec = {
      ...base,
      schema: {
        area: {
          type: 'polygon',
          name: 'Area',
          validation: {
            required: true
          }
        }
      }
    }
    const item = {
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [1, 1],
            [1, 3],
            [3, 3],
            [3, 1],
            [1, 1]
          ]
        ]
      }
    }
    should(validate(spec)).equal(true)
    should(await validateItem(spec, item)).equal(true)
  })
})
