# lodash-unwind
Very simple unwind extension for lodash. And it's compatible with mongoose doc.

# Install

```javascript
npm install --save lodash-unwind
```
# Usage

## unwind(collection, field)

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
