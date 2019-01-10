/*
 * @Author: edwin
 * @Date:   2019-01-09 15:34:30
 * @Last Modified by: edwin
 * @Last Modified At: 2019-01-10 11:22:32
 */
const _ = require.main.require('lodash')

const transformDoc = (doc) => {
  let cloned
  if (typeof doc.toObject === 'function') {
    cloned = doc.toObject()
  } else if (typeof doc.toJSON === 'function') {
    cloned = doc.toJSON()
  } else {
    cloned = doc
  }
  return _.cloneDeep(cloned)
}

const unwindCore = (target, source, field, options) => {
  const subArray = _.get(source, field)
  if (_.isArray(subArray)) {
    subArray.forEach(i => {
      let cloned = transformDoc(source)
      target.push(_.set(cloned, field, i))
    })
  } else {
    if (!options.ignoreNonArray) {
      target.push(transformDoc(source))
    }
  }
}

const unwindCollection = (array, field, options) => {
  const res = []
  _.each(array, item => {
    unwindCore(res, item, field, options)
  })
  return res
}

const unwindObject = (object, field, options) => {
  const res = []
  unwindCore(res, object, field, options)
  return res
}

const unwind = (source, field, options = { ignoreNonArray: true }) => {
  let func = () => { return [] }
  if (_.isArray(source)) {
    func = unwindCollection
  } else if (_.isObject(source)) {
    func = unwindObject
  }
  return func(source, field, options)
}

module.exports = (opt) => {
  if (opt && opt.injected) {
    _.mixin({
      'unwind': unwind
    })
  }
  return unwind
}
