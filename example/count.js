var state = require('../')({ n: 0 })

setInterval(function () {
  console.log(state.get('n', Date.now()/1000))
}, 250)

setTimeout(function () {
  state.set('n', {
    value: state.limit('n')+10,
    time: 1
  })
}, 1000)

setTimeout(function () {
  state.set('n', {
    value: state.limit('n')+100,
    time: 2
  })
}, 4000)
