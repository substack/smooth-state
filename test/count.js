var test = require('tape')
var smooth = require('../')

test('count', function (t) {
  t.plan(1)
  var state = smooth({ n: 0 })
  var output = []
  output.push(state.get('n', 1000.00))
  output.push(state.get('n', 1000.25))
  output.push(state.get('n', 1000.50))
  output.push(state.get('n', 1000.75))
  state.set('n', {
    value: state.limit('n')+10,
    time: 1
  })
  output.push(state.get('n', 1001.00))
  output.push(state.get('n', 1001.25))
  output.push(state.get('n', 1001.50))
  output.push(state.get('n', 1001.75))
  output.push(state.get('n', 1002.00))
  output.push(state.get('n', 1002.25))
  output.push(state.get('n', 1002.50))
  output.push(state.get('n', 1002.75))
  state.set('n', {
    value: state.limit('n')+100,
    time: 2
  })
  output.push(state.get('n', 1003.00))
  output.push(state.get('n', 1003.25))
  output.push(state.get('n', 1003.50))
  output.push(state.get('n', 1003.75))
  output.push(state.get('n', 1004.00))
  output.push(state.get('n', 1004.25))
  output.push(state.get('n', 1004.50))
  output.push(state.get('n', 1004.75))
  output.push(state.get('n', 1005.00))
  output.push(state.get('n', 1005.25))
  output.push(state.get('n', 1005.50))
  output.push(state.get('n', 1005.75))
  t.deepEqual(output, [
    0, 0, 0, 0, 2.5, 5, 7.5, 10, 10, 10, 10, 10,
    22.5, 35, 47.5, 60, 72.5, 85, 97.5, 110,
    110, 110, 110, 110
  ])
})
