/*
 * @Author: edwin
 * @Date:   2019-01-09 15:34:30
 * @Last Modified by: edwin
 * @Last Modified At: 2019-01-09 20:10:02
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

const unwind = (array, field, options = { ignoreNonArray: true }) => {
  const res = []
  if (_.isArray(array)) {
    array.forEach(item => {
      const subArray = _.get(item, field)
      if (_.isArray(subArray)) {
        subArray.forEach(i => {
          let cloned = transformDoc(item)
          res.push(_.set(cloned, field, i))
        })
      } else {
        if (!options.ignoreNonArray) {
          res.push(transformDoc(item))
        }
      }
    })
    return res
  } else {
    return options.ignoreNonArray ? [] : array
  }
}

module.exports = (opt) => {
  if (opt && opt.injected) {
    _.mixin({
      'unwind': unwind
    })
  }
  return unwind
}
