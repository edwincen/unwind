/*
 * @Author: edwin
 * @Date:   2019-01-09 16:09:23
 * @Last Modified by: edwin
 * @Last Modified At: 2019-01-17 11:39:49
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

const collectionWithNonArrayElement = [
  {
    a: 234,
    id: 'a1'
  },
  {
    a: [ 3, 4 ],
    id: 'a2'
  }
]

const invalidCollection = {
  a: 1234
}

const mongooseCollection = [
  {
    a: {
      inner: [ 1, 2, 3, 4 ]
    },
    id: 'a1',
    toJSON: function () {
      let res = Object.assign({}, this)
      delete res.toJSON
      return res
    } // Simulate the mongoose doc
  },
  {
    a: {
      inner: [ 3, 4 ]
    },
    id: 'a2',
    toObject: function () {
      let res = Object.assign({}, this)
      delete res.toObject
      return res
    }
  },
  {
    a: {
      inner: [ 4, 1 ]
    },
    id: 'a3',
    toJSON: function () {
      let res = Object.assign({}, this)
      delete res.toJSON
      return res
    }
  }
]

const objectWithCollection = {
  a: [ 1, 2, 3, 4 ],
  id: 'a1'
}

const nestedObjectWithCollection = {
  a: {
    inner: [ 1, 2, 3, 4 ]
  },
  id: 'a1'
}

const assertNormal = (output) => {
  expect(output).to.deep.include({ a: 1, id: 'a1' })
  expect(output).to.deep.include({ a: 2, id: 'a1' })
  expect(output).to.deep.include({ a: 3, id: 'a1' })
  expect(output).to.deep.include({ a: 4, id: 'a1' })
  expect(output.filter(i => i.id === 'a1')).to.have.lengthOf(4)
}

const assertNested = (output) => {
  expect(output).to.deep.include({ a: { inner: 1 }, id: 'a1' })
  expect(output).to.deep.include({ a: { inner: 2 }, id: 'a1' })
  expect(output).to.deep.include({ a: { inner: 3 }, id: 'a1' })
  expect(output).to.deep.include({ a: { inner: 4 }, id: 'a1' })
  expect(output.filter(i => i.id === 'a1')).to.have.lengthOf(4)
}

const executeTest = (func) => {
  it('should return unwind collection with normal collection', () => {
    const output = func(normalCollection, 'a')
    assertNormal(output)
  })
  it('should return unwind collection with nested collection', () => {
    const output = func(nestedCollection, 'a.inner')
    assertNested(output)
  })
  it('should return unwind collection with mongoose collection', () => {
    const output = func(mongooseCollection, 'a.inner')
    assertNested(output)
  })
  it('should return empty collection if source is NOT an array', () => {
    const output = func(invalidCollection, 'a')
    expect(output).to.be.an('array').that.have.lengthOf(0)
  })
  it('should ignore non array element', () => {
    const output = func(collectionWithNonArrayElement, 'a')
    expect(output).to.be.an('array').that.have.lengthOf(2)
  })
  it('should return origin data if option.ignoreNonArray === false', () => {
    const output = func(collectionWithNonArrayElement, 'a', { ignoreNonArray: false })
    expect(output).to.be.an('array').that.have.lengthOf(3)
  })
  it('should return unwinded collection when source is an object', () => {
    const output = func(objectWithCollection, 'a')
    assertNormal(output)
  })
  it('should return unwinded collection when source is an nested object', () => {
    const output = func(nestedObjectWithCollection, 'a.inner')
    assertNested(output)
  })
  it('should return unwinded collection with value wrapped as array', () => {
    const output = func(nestedObjectWithCollection, 'a.inner', { wrapAsArray: true })
    expect(output).to.deep.include({ a: { inner: [1] }, id: 'a1' })
    expect(output).to.deep.include({ a: { inner: [2] }, id: 'a1' })
    expect(output).to.deep.include({ a: { inner: [3] }, id: 'a1' })
    expect(output).to.deep.include({ a: { inner: [4] }, id: 'a1' })
  })
  it('should return unwinded collection with value wrapped as array', () => {
    const output = func(objectWithCollection, 'a', { wrapAsArray: true })
    expect(output).to.deep.include({ a: [1], id: 'a1' })
    expect(output).to.deep.include({ a: [2], id: 'a1' })
    expect(output).to.deep.include({ a: [3], id: 'a1' })
    expect(output).to.deep.include({ a: [4], id: 'a1' })
    expect(output.filter(i => i.id === 'a1')).to.have.lengthOf(4)
  })
}

describe('Use unwind as module', () => {
  const unwind = require('../index')()
  executeTest(unwind)
})

describe('Use unwind as lodash extension', () => {
  const _ = require('lodash')
  require('../index')({ injected: true })
  executeTest(_.unwind)
})
