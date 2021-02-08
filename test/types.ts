import * as types from '../src/types'
import { client } from './pg'
import should from 'should'

describe('tables#dataType#types', () => {
  it('types.object should accept a valid object', async () => {
    should(types.object.test({})).be.true
    should(types.object.test(null)).be.false
    should(types.object.test(10)).be.false
    should(types.object.test(undefined)).be.false
    should(types.object.test(true)).be.false
    should(types.object.test([])).be.false
    should(types.object.test(' ')).be.false
    should(types.object.test(new Date())).be.false
  })
  it('types.text should accept a valid string', async () => {
    should(types.text.test({})).be.false
    should(types.text.test(null)).be.false
    should(types.text.test(10)).be.false
    should(types.text.test(undefined)).be.false
    should(types.text.test(true)).be.false
    should(types.text.test([])).be.false
    should(types.text.test(' ')).be.true
    should(types.text.test(new Date())).be.false
  })
  it('types.number should accept a valid number', async () => {
    should(types.number.test({})).be.false
    should(types.number.test(null)).be.false
    should(types.number.test(10)).be.true
    should(types.number.test(undefined)).be.false
    should(types.number.test(true)).be.false
    should(types.number.test([])).be.false
    should(types.number.test(' ')).be.false
    should(types.number.test('1')).be.false
    should(types.number.test('0')).be.false
    should(types.number.test(new Date())).be.false
  })
  it('types.boolean should accept a valid boolean', async () => {
    should(types.boolean.test({})).be.false
    should(types.boolean.test(null)).be.false
    should(types.boolean.test(10)).be.false
    should(types.boolean.test(undefined)).be.false
    should(types.boolean.test(true)).be.true
    should(types.boolean.test([])).be.false
    should(types.boolean.test(' ')).be.false
    should(types.boolean.test(new Date())).be.false
  })
  it('types.date should accept a valid date', async () => {
    should(types.date.test({})).be.false
    should(types.date.test(null)).be.false
    should(types.date.test(10)).be.false
    should(types.date.test(1000)).be.false
    should(types.date.test('1000')).be.false
    should(types.date.test(undefined)).be.false
    should(types.date.test(true)).be.false
    should(types.date.test([])).be.false
    should(types.date.test(' ')).be.false
    should(types.date.test('2021-02-08')).be.false
    should(types.date.test(+new Date())).be.false
    should(types.date.test(new Date())).be.true
    should(types.date.test(new Date().toISOString())).be.true
    should(types.date.test('2021-02-08T20:30:00Z')).be.true
    should(types.date.test('2021-02-08T20:30:00.000Z')).be.true
  })
  it('types.point should accept a valid point', async () => {
    should(types.point.test({})).be.false
    should(types.point.test(null)).be.false
    should(types.point.test(10)).be.false
    // these have the pg client included
    should(types.point.test(undefined)).be.false
    should(types.point.test(true)).be.false
    should(types.point.test([])).be.false
    should(types.point.test(' ')).be.false
    should(types.point.test('abc')).be.false
    should(types.point.test(new Date())).be.false
    should(
      types.point.test({
        type: 'Point'
      })
    ).be.false
    should(
      types.point.test({
        type: 'Point',
        coordinates: [900, -30]
      })
    ).be.false
    should(
      types.point.test({
        type: 'LineString',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.point.test({
        type: 'Point',
        coordinates: [90, 30]
      })
    ).be.true
  })
  it('types.line should accept a valid line', async () => {
    should(types.line.test({})).be.false
    should(types.line.test(null)).be.false
    should(types.line.test(10)).be.false
    should(types.line.test(undefined)).be.false
    should(types.line.test(true)).be.false
    should(types.line.test([])).be.false
    should(types.line.test(' ')).be.false
    should(types.line.test('abc')).be.false
    should(types.line.test(new Date())).be.false
    should(
      types.line.test({
        type: 'Point',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.line.test({
        type: 'LineString',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.line.test({
        type: 'LineString',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.true
  })
  it('types.multiline should accept a valid multiline', async () => {
    should(types.multiline.test({})).be.false
    should(types.multiline.test(null)).be.false
    should(types.multiline.test(10)).be.false
    should(types.multiline.test(undefined)).be.false
    should(types.multiline.test(true)).be.false
    should(types.multiline.test([])).be.false
    should(types.multiline.test(' ')).be.false
    should(types.multiline.test('abc')).be.false
    should(types.multiline.test(new Date())).be.false
    should(
      types.multiline.test({
        type: 'Point',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.multiline.test({
        type: 'LineString',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.multiline.test({
        type: 'LineString',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.false
    should(
      types.multiline.test({
        type: 'MultiLineString',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.true
  })
  it('types.polygon should accept a valid polygon', async () => {
    should(types.polygon.test({})).be.false
    should(types.polygon.test(null)).be.false
    should(types.polygon.test(10)).be.false
    should(types.polygon.test(undefined)).be.false
    should(types.polygon.test(true)).be.false
    should(types.polygon.test([])).be.false
    should(types.polygon.test(' ')).be.false
    should(types.polygon.test('abc')).be.false
    should(types.polygon.test(new Date())).be.false
    should(
      types.polygon.test({
        type: 'Point',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.polygon.test({
        type: 'LineString',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.polygon.test({
        type: 'LineString',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.false
    should(
      types.polygon.test({
        type: 'MultiLineString',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.false
    should(
      types.polygon.test({
        type: 'Polygon',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.true
  })
  it('types.multipolygon should accept a valid multipolygon', async () => {
    should(types.multipolygon.test({})).be.false
    should(types.multipolygon.test(null)).be.false
    should(types.multipolygon.test(10)).be.false
    should(types.multipolygon.test(undefined)).be.false
    should(types.multipolygon.test(true)).be.false
    should(types.multipolygon.test([])).be.false
    should(types.multipolygon.test(' ')).be.false
    should(types.multipolygon.test('abc')).be.false
    should(types.multipolygon.test(new Date())).be.false
    should(
      types.multipolygon.test({
        type: 'Point',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.multipolygon.test({
        type: 'LineString',
        coordinates: [90, 30]
      })
    ).be.false
    should(
      types.multipolygon.test({
        type: 'LineString',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.false
    should(
      types.multipolygon.test({
        type: 'MultiLineString',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.false
    should(
      types.multipolygon.test({
        type: 'MultiPolygon',
        coordinates: [
          [90, 30],
          [91, 31]
        ]
      })
    ).be.true
  })

  it('types.point should accept a valid point async', async () => {
    should(await types.point.testAsync({}, client)).be.false
    should(await types.point.testAsync(null, client)).be.false
    should(await types.point.testAsync(10, client)).be.false
    // these have the pg client included
    should(await types.point.testAsync(undefined, client)).be.false
    should(await types.point.testAsync(true, client)).be.false
    should(await types.point.testAsync([], client)).be.false
    should(await types.point.testAsync(' ', client)).be.false
    should(await types.point.testAsync('abc', client)).be.false
    should(await types.point.testAsync(new Date(), client)).be.false
    should(
      await types.point.testAsync(
        {
          type: 'Point'
        },
        client
      )
    ).be.false
    should(
      await types.point.testAsync(
        {
          type: 'Point',
          coordinates: [900, -30]
        },
        client
      )
    ).be.false
    should(
      await types.point.testAsync(
        {
          type: 'LineString',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.point.testAsync(
        {
          type: 'Point',
          coordinates: [90, 30]
        },
        client
      )
    ).be.true
  })
  it('types.line should accept a valid line async', async () => {
    should(await types.line.testAsync({}, client)).be.false
    should(await types.line.testAsync(null, client)).be.false
    should(await types.line.testAsync(10, client)).be.false
    should(await types.line.testAsync(undefined, client)).be.false
    should(await types.line.testAsync(true, client)).be.false
    should(await types.line.testAsync([], client)).be.false
    should(await types.line.testAsync(' ', client)).be.false
    should(await types.line.testAsync('abc', client)).be.false
    should(await types.line.testAsync(new Date(), client)).be.false
    should(
      await types.line.testAsync(
        {
          type: 'Point',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.line.testAsync(
        {
          type: 'LineString',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.line.testAsync(
        {
          type: 'LineString',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.true
  })
  it('types.multiline should accept a valid multiline async', async () => {
    should(await types.multiline.testAsync({}, client)).be.false
    should(await types.multiline.testAsync(null, client)).be.false
    should(await types.multiline.testAsync(10, client)).be.false
    should(await types.multiline.testAsync(undefined, client)).be.false
    should(await types.multiline.testAsync(true, client)).be.false
    should(await types.multiline.testAsync([], client)).be.false
    should(await types.multiline.testAsync(' ', client)).be.false
    should(await types.multiline.testAsync('abc', client)).be.false
    should(await types.multiline.testAsync(new Date(), client)).be.false
    should(
      await types.multiline.testAsync(
        {
          type: 'Point',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.multiline.testAsync(
        {
          type: 'LineString',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.multiline.testAsync(
        {
          type: 'LineString',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.false
    should(
      await types.multiline.testAsync(
        {
          type: 'MultiLineString',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.true
  })
  it('types.polygon should accept a valid polygon async', async () => {
    should(await types.polygon.testAsync({}, client)).be.false
    should(await types.polygon.testAsync(null, client)).be.false
    should(await types.polygon.testAsync(10, client)).be.false
    should(await types.polygon.testAsync(undefined, client)).be.false
    should(await types.polygon.testAsync(true, client)).be.false
    should(await types.polygon.testAsync([], client)).be.false
    should(await types.polygon.testAsync(' ', client)).be.false
    should(await types.polygon.testAsync('abc', client)).be.false
    should(await types.polygon.testAsync(new Date(), client)).be.false
    should(
      await types.polygon.testAsync(
        {
          type: 'Point',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.polygon.testAsync(
        {
          type: 'LineString',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.polygon.testAsync(
        {
          type: 'LineString',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.false
    should(
      await types.polygon.testAsync(
        {
          type: 'MultiLineString',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.false
    should(
      await types.polygon.testAsync(
        {
          type: 'Polygon',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.true
  })
  it('types.multipolygon should accept a valid multipolygon async', async () => {
    should(await types.multipolygon.testAsync({}, client)).be.false
    should(await types.multipolygon.testAsync(null, client)).be.false
    should(await types.multipolygon.testAsync(10, client)).be.false
    should(await types.multipolygon.testAsync(undefined, client)).be.false
    should(await types.multipolygon.testAsync(true, client)).be.false
    should(await types.multipolygon.testAsync([], client)).be.false
    should(await types.multipolygon.testAsync(' ', client)).be.false
    should(await types.multipolygon.testAsync('abc', client)).be.false
    should(await types.multipolygon.testAsync(new Date(), client)).be.false
    should(
      await types.multipolygon.testAsync(
        {
          type: 'Point',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.multipolygon.testAsync(
        {
          type: 'LineString',
          coordinates: [90, 30]
        },
        client
      )
    ).be.false
    should(
      await types.multipolygon.testAsync(
        {
          type: 'LineString',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.false
    should(
      await types.multipolygon.testAsync(
        {
          type: 'MultiLineString',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.false
    should(
      await types.multipolygon.testAsync(
        {
          type: 'MultiPolygon',
          coordinates: [
            [90, 30],
            [91, 31]
          ]
        },
        client
      )
    ).be.true
  })
})
