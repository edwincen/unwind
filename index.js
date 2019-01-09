/*
 * @Author: edwin
 * @Date:   2019-01-09 15:34:30
 * @Last Modified by: edwin
 * @Last Modified At: 2019-01-09 18:30:07
 */
const _ = require.main.require('lodash')

const transformDoc = (doc) => {
  let newDoc = doc
  if (typeof doc.toObject === 'function') {
    newDoc = doc.toObject()
  } else if (typeof doc.toJSON === 'function') {
    newDoc = doc.toJSON()
  }
  return newDoc
}

const unwind = (array, field) => {
  const res = []
  if (_.isArray(array)) {
    array.forEach(item => {
      let tmp = transformDoc(item)
      const subArray = _.get(tmp, field)
      if (_.isArray(subArray)) {
        subArray.forEach(i => {
          let cloned = _.cloneDeep(tmp)
          res.push(_.set(cloned, field, i))
        })
      }
    })
    return res
  } else {
    return array
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
