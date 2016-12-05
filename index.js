module.exports = Plan
var max = Math.max, min = Math.min

function Plan (init) {
  var self = this
  if (!(self instanceof Plan)) return new Plan(init)
  self._events = {}
  self._observed = {}
  self.time = 0
  Object.keys(init || {}).forEach(function (name) {
    self.set(name, { time: 0, value: init[name] })
  })
}

Plan.prototype.get = function (name, time) {
  if (time && typeof time === 'object' && time.time) time = time.time
  this.time = time
  var events = this._events[name]
  if (!events) events = this._events[name] = []
  var ev0 = null, ev1 = null
  for (var i = 0; i < events.length; i++) {
    if (events[i].time >= time) {
      ev1 = events[i]
      break
    }
    ev0 = events[i]
  }
  var obs = this._observed[name]
  var fn = ev1 && ev1.easing || linear
  var t = 0, value = null
  if (ev0 && ev1) {
    t = (time - ev0) / (ev1.time - ev0.time)
    value = mix(ev0.value, ev1.value, fn(t))
  } else if (obs && ev1) {
    t = (time - obs.time) / (ev1.time - obs.time)
    value = mix(obs.value, ev1.value, fn(t))
  } else if (ev0) {
    value = ev0.value
  } else if (ev1) {
    value = ev1.value
  }
  if (!obs) obs = this._observed[name] = {}
  obs.time = time
  obs.value = value
  return value
}

Plan.prototype.tie = function (name) {
  var self = this
  return function (time) {
    return self.get(name, time)
  }
}

Plan.prototype.set = function (name, ev) {
  var events = this._events[name]
  if (!events) events = this._events[name] = []
  events.splice(0,events.length,ev)
}

Plan.prototype.add = function (name, ev) {
  var events = this._events[name]
  if (!events) events = this._events[name] = []
  for (var i = 0; i < events.length && events[i].time < this.time; i++);
  if (i === 0) events.unshift(ev)
  if (i > 0) events.splice(i,0,ev)
}

function linear (t) { return t }
function mix (a, b, t) {
  t = max(min(t,1),0)
  return a*(1-t) + b*t
}
