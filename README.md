# lodash-unwind

[![Build Status](https://travis-ci.com/edwincen/unwind.svg?branch=master)](https://travis-ci.com/edwincen/unwind) [![Greenkeeper badge](https://badges.greenkeeper.io/edwincen/unwind.svg)](https://greenkeeper.io/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Very simple unwind extension for lodash. And it's compatible with mongoose doc.

# Install

```javascript
npm install --save lodash-unwind
```
# Usage

```javascript
unwind(collection, path, [options={}])
```
### Arguments
- ```collection(Array|Object)``` - The collection or object to process.
- ```path(string)``` - The property path to unwind.
- ```[options={}](object)``` - The option object.
- ```[options.ignoreNonArray=true](boolean)``` - Specify whether ignore non-array element/property, default=true.

### Returns
```(Array)``` - Returns new unwinded collection.

### Sample

- #### Unwind normal collection

```javascript
const unwind = require('lodash-unwind')()
const data = [
  {
    a: [ 1, 2 ],
    id: 'a1'
  },
  {
    a: [ 3, 4 ],
    id: 'a2'
  }
]
const output = unwind(data, 'a')
// [
//   {
//     a: 1,
//     id: 'a1'
//   },
//   {
//     a: 2,
//     id: 'a1'
//   },
//   {
//     a: 3,
//     id: 'a2'
//   },
//   {
//     a: 4,
//     id: 'a2'
//   }
// ]
```
- #### Unwind collection with nested property

```javascript
const unwind = require('lodash-unwind')()
const data = [
  {
    a: {
        inner: [ 1, 2 ]
    },
    id: 'a1'
  },
  {
    a: {
        inner: [ 3, 4 ]
    },
    id: 'a2'
  }
]
const output = unwind(data, 'a')
// [
//   {
//     a: { inner: 1 },
//     id: 'a1'
//   },
//   {
//     a: { inner: 2 },
//     id: 'a1'
//   },
//   {
//     a: { inner: 3 },
//     id: 'a2'
//   },
//   {
//     a: { inner: 4 },
//     id: 'a2'
//   }
// ]
```

- #### Unwind object
```javascript
const unwind = require('lodash-unwind')()
const data = {
  a: [ 1, 2 ],
  id: 'a1'
}
const output = unwind(data, 'a')
// [
//   {
//     a: 1,
//     id: 'a1'
//   },
//   {
//     a: 2,
//     id: 'a1'
//   }
// ]
```

## Use unwind as module of lodash
```javascript
const _ = require('lodash')
require('lodash-unwind')({ injected: true })
const data = [
  {
    a: [ 1, 2 ],
    id: 'a1'
  },
  {
    a: [ 3, 4 ],
    id: 'a2'
  }
]
// Use unwind as part of lodash
const output = _.unwind(data, 'a')
```
