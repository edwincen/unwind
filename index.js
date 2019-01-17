/*
 * @Author: edwin
 * @Date:   2019-01-09 15:34:30
 * @Last Modified by: edwin
 * @Last Modified At: 2019-01-17 11:37:35
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
      let val = i
      if (options.wrapAsArray) {
        val = [ i ]
      }
      target.push(_.set(cloned, field, val))
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

const unwind = (source, field, options = { ignoreNonArray: true, wrapAsArray: false }) => {
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
