# smooth-state

smoothly interpolate state changes over time

``` js
var state = require('smooth-state')({ n: 0 })

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
```

```
$ node count.js 
0
0
0
2.5
5.059998035430908
7.579998970031739
10
10
10
10
10
10
10
10
10
22.5
35.0499963760376
47.60000467300415
60.10000467300415
72.65000104904175
85.19999742507935
97.7500057220459
110
110
110
110
110
110
110
110
110
110
^C
```

# api

``` js
var smooth = require('smooth-state')
```

## var state = smooth(values)

Create a new state object `state` given some initial `values`.

Each value can be a number or an array of numbers.

## state.set(name, update)

Set the future value for the variable `name`:

* `update.value` - value to set
* `update.time` - duration of the transition to the future value
* `update.easing` - optional easing function

Values can be a number or an array of numbers.

Easing functions take a parameter `t` between `0` and `1` and should return
values between `0` and `1`. You can get easing functions from the [eases][1]
package.

[1]: https://www.npmjs.com/package/eases

## state.get(name, time)

Return the value of `name` at `time`.

## state.limit(name)

Get the limit of the future value for `name`. This is the same as whichever
value was last set with `state.set(name)`.

## state.tie(name)

Return a `function (time) {}` that returns the value for `name` given a `time`.

# install

```
npm install smooth-state
```

# license

BSD
