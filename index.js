module.exports = Plan
var max = Math.max, min = Math.min

function Plan (init) {
  var self = this
  if (!(self instanceof Plan)) return new Plan(init)
  self._planned = {}
  self._current = {}
  self._time = 0
  Object.keys(init || {}).forEach(function (name) {
    self.set(name, { time: 0, value: init[name] })
  })
}

Plan.prototype.get = function (name, time) {
  if (time && typeof time === 'object' && time.time) time = time.time
  this._time = time
  var plan = this._planned[name]
  var cur = this._current[name]
  if (!plan) return null
  var fn = plan.easing || linear
  var t = 0, value = null
  if (cur && plan) {
    t = (time - cur.time) / (plan.time - cur.time)
    value = mix(cur.value, plan.value, fn(t))
  } else if (plan) {
    value = plan.value
  }
  if (!cur) cur = this._current[name] = {}
  cur.time = time
  cur.value = value
  return value
}

Plan.prototype.limit = function (name) {
  var plan =  this._planned[name]
  return plan ? plan.value : null
}

Plan.prototype.tie = function (name) {
  var self = this
  return function (time) {
    return self.get(name, time)
  }
}

Plan.prototype.set = function (name, ev) {
  this._planned[name] = {
    time: (ev.time || 0) + this._time,
    value: ev.value,
    easing: ev.easing
  }
}

function linear (t) { return t }
function mix (a, b, t) {
  t = max(min(t,1),0)
  return a*(1-t) + b*t
}
