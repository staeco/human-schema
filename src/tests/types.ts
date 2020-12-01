import * as types from '../types'
import { client } from './pg'
import should from 'should'

describe('tables#dataType#types', () => {
  it('types.object should accept a valid object', async () => {
    should(await types.object.test({})).be.true
    should(await types.object.test(null)).be.false
    should(await types.object.test(10)).be.false
    should(await types.object.test(undefined)).be.false
    should(await types.object.test(true)).be.false
    should(await types.object.test([])).be.false
    should(await types.object.test(' ')).be.false
    should(await types.object.test(new Date())).be.false
  })
  it('types.text should accept a valid string', async () => {
    should(await types.text.test({})).be.false
    should(await types.text.test(null)).be.false
    should(await types.text.test(10)).be.false
    should(await types.text.test(undefined)).be.false
    should(await types.text.test(true)).be.false
    should(await types.text.test([])).be.false
    should(await types.text.test(' ')).be.true
    should(await types.text.test(new Date())).be.false
  })
  it('types.number should accept a valid number', async () => {
    should(await types.number.test({})).be.false
    should(await types.number.test(null)).be.false
    should(await types.number.test(10)).be.true
    should(await types.number.test(undefined)).be.false
    should(await types.number.test(true)).be.false
    should(await types.number.test([])).be.false
    should(await types.number.test(' ')).be.false
    should(await types.number.test('1')).be.false
    should(await types.number.test('0')).be.false
    should(await types.number.test(new Date())).be.false
  })
  it('types.boolean should accept a valid boolean', async () => {
    should(await types.boolean.test({})).be.false
    should(await types.boolean.test(null)).be.false
    should(await types.boolean.test(10)).be.false
    should(await types.boolean.test(undefined)).be.false
    should(await types.boolean.test(true)).be.true
    should(await types.boolean.test([])).be.false
    should(await types.boolean.test(' ')).be.false
    should(await types.boolean.test(new Date())).be.false
  })
  it('types.date should accept a valid date', async () => {
    should(await types.date.test({})).be.false
    should(await types.date.test(null)).be.false
    should(await types.date.test(10)).be.false
    should(await types.date.test(1000)).be.false
    should(await types.date.test('1000')).be.false
    should(await types.date.test(undefined)).be.false
    should(await types.date.test(true)).be.false
    should(await types.date.test([])).be.false
    should(await types.date.test(' ')).be.false
    should(await types.date.test(new Date())).be.true
    should(await types.date.test(new Date().toISOString())).be.true
  })
  it('types.point should accept a valid point', async () => {
    should(await types.point.test({})).be.false
    should(await types.point.test(null)).be.false
    should(await types.point.test(10)).be.false
    // these have the pg client included
    should(await types.point.test(undefined, null, client)).be.false
    should(await types.point.test(true, null, client)).be.false
    should(await types.point.test([], null, client)).be.false
    should(await types.point.test(' ', null, client)).be.false
    should(await types.point.test(new Date(), null, client)).be.false
    should(await types.point.test({
      type: 'Point'
    }, null, client)).be.false
    should(await types.point.test({
      type: 'Point',
      coordinates: [ 900, -30 ]
    }, null, client)).be.false
    should(await types.point.test({
      type: 'LineString',
      coordinates: [ 90, 30 ]
    }, null, client)).be.false
    should(await types.point.test({
      type: 'Point',
      coordinates: [ 90, 30 ]
    }, null, client)).be.true
  })
  it('types.line should accept a valid line', async () => {
    should(await types.line.test({})).be.false
    should(await types.line.test(null)).be.false
    should(await types.line.test(10)).be.false
    should(await types.line.test(undefined)).be.false
    should(await types.line.test(true)).be.false
    should(await types.line.test([])).be.false
    should(await types.line.test(' ')).be.false
    should(await types.line.test(new Date())).be.false
    should(await types.line.test({
      type: 'Point',
      coordinates: [ 90, 30 ]
    }, null, client)).be.false
    should(await types.line.test({
      type: 'LineString',
      coordinates: [ 90, 30 ]
    }, null, client)).be.false
    should(await types.line.test({
      type: 'LineString',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    }, null, client)).be.true
  })
  it('types.multiline should accept a valid multiline', async () => {
    should(await types.multiline.test({})).be.false
    should(await types.multiline.test(null)).be.false
    should(await types.multiline.test(10)).be.false
    should(await types.multiline.test(undefined)).be.false
    should(await types.multiline.test(true)).be.false
    should(await types.multiline.test([])).be.false
    should(await types.multiline.test(' ')).be.false
    should(await types.multiline.test(new Date())).be.false
    should(await types.multiline.test({
      type: 'Point',
      coordinates: [ 90, 30 ]
    })).be.false
    should(await types.multiline.test({
      type: 'LineString',
      coordinates: [ 90, 30 ]
    })).be.false
    should(await types.multiline.test({
      type: 'LineString',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    })).be.false
    should(await types.multiline.test({
      type: 'MultiLineString',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    })).be.true
  })
  it('types.polygon should accept a valid polygon', async () => {
    should(await types.polygon.test({})).be.false
    should(await types.polygon.test(null)).be.false
    should(await types.polygon.test(10)).be.false
    should(await types.polygon.test(undefined)).be.false
    should(await types.polygon.test(true)).be.false
    should(await types.polygon.test([])).be.false
    should(await types.polygon.test(' ')).be.false
    should(await types.polygon.test(new Date())).be.false
    should(await types.polygon.test({
      type: 'Point',
      coordinates: [ 90, 30 ]
    })).be.false
    should(await types.polygon.test({
      type: 'LineString',
      coordinates: [ 90, 30 ]
    })).be.false
    should(await types.polygon.test({
      type: 'LineString',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    })).be.false
    should(await types.polygon.test({
      type: 'MultiLineString',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    })).be.false
    should(await types.polygon.test({
      type: 'Polygon',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    })).be.true
  })
  it('types.multipolygon should accept a valid multipolygon', async () => {
    should(await types.multipolygon.test({})).be.false
    should(await types.multipolygon.test(null)).be.false
    should(await types.multipolygon.test(10)).be.false
    should(await types.multipolygon.test(undefined)).be.false
    should(await types.multipolygon.test(true)).be.false
    should(await types.multipolygon.test([])).be.false
    should(await types.multipolygon.test(' ')).be.false
    should(await types.multipolygon.test(new Date())).be.false
    should(await types.multipolygon.test({
      type: 'Point',
      coordinates: [ 90, 30 ]
    })).be.false
    should(await types.multipolygon.test({
      type: 'LineString',
      coordinates: [ 90, 30 ]
    })).be.false
    should(await types.multipolygon.test({
      type: 'LineString',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    })).be.false
    should(await types.multipolygon.test({
      type: 'MultiLineString',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    })).be.false
    should(await types.multipolygon.test({
      type: 'MultiPolygon',
      coordinates: [ [ 90, 30 ], [ 91, 31 ] ]
    })).be.true
  })
})

