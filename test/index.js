/*
 * @Author: edwin
 * @Date:   2019-01-09 16:09:23
 * @Last Modified by: edwin
 * @Last Modified At: 2019-01-09 18:30:32
 */
const expect = require('chai').expect

const normalCollection = [
  {
    a: [ 1, 2, 3, 4 ],
    id: 'a1'
  },
  {
    a: [ 3, 4 ],
    id: 'a2'
  },
  {
    a: [ 4, 1 ],
    id: 'a3'
  }
]

const nestedCollection = [
  {
    a: {
      inner: [ 1, 2, 3, 4 ]
    },
    id: 'a1'
  },
  {
    a: {
      inner: [ 3, 4 ]
    },
    id: 'a2'
  },
  {
    a: {
      inner: [ 4, 1 ]
    },
    id: 'a3'
  }
]

const mongooseCollection = [
  {
    a: {
      inner: [ 1, 2, 3, 4 ]
    },
    id: 'a1',
    toJSON: function () {
      delete this.toJSON
      return this
    } // Simulate the mongoose doc
  },
  {
    a: {
      inner: [ 3, 4 ]
    },
    id: 'a2',
    toObject: function () {
      delete this.toObject
      return this
    }
  },
  {
    a: {
      inner: [ 4, 1 ]
    },
    id: 'a3',
    toJSON: function () {
      delete this.toJSON
      return this
    }
  }
]

const assertNormal = (output) => {
  expect(output).to.have.lengthOf(8)
  expect(output).to.deep.include({ a: 1, id: 'a1' })
  expect(output).to.deep.include({ a: 2, id: 'a1' })
  expect(output).to.deep.include({ a: 3, id: 'a1' })
  expect(output).to.deep.include({ a: 4, id: 'a1' })
  expect(output.filter(i => i.id === 'a1')).to.have.lengthOf(4)
}

const assertNested = (output) => {
  expect(output).to.have.lengthOf(8)
  expect(output).to.deep.include({ a: { inner: 1 }, id: 'a1' })
  expect(output).to.deep.include({ a: { inner: 2 }, id: 'a1' })
  expect(output).to.deep.include({ a: { inner: 3 }, id: 'a1' })
  expect(output).to.deep.include({ a: { inner: 4 }, id: 'a1' })
  expect(output.filter(i => i.id === 'a1')).to.have.lengthOf(4)
}

describe('Use unwind as module', () => {
  const unwind = require('../index')()
  it('should return unwind collection with normal collection', () => {
    const output = unwind(normalCollection, 'a')
    assertNormal(output)
  })
  it('should return unwind collection with nested collection', () => {
    const output = unwind(nestedCollection, 'a.inner')
    assertNested(output)
  })
  it('should return unwind collection with mongoose collection', () => {
    const output = unwind(mongooseCollection, 'a.inner')
    assertNested(output)
  })
})

describe('Use unwind as lodash extension', () => {
  const _ = require('lodash')
  require('../index')({ injected: true })
  it('should return unwind collection with normal collection', () => {
    const output = _.unwind(normalCollection, 'a')
    assertNormal(output)
  })
  it('should return unwind collection with nested collection', () => {
    const output = _.unwind(nestedCollection, 'a.inner')
    assertNested(output)
  })
  it('should return unwind collection with mongoose collection', () => {
    const output = _.unwind(mongooseCollection, 'a.inner')
    assertNested(output)
  })
})
