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
  if (cur && plan && plan.mix) {
    t = (time - cur.time) / (plan.time - cur.time)
    value = plan.mix(cur.value, cur.value, plan.value, fn(t))
  } else if (cur && plan) {
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
  var v = this._planned[name] = {
    time: (ev.time || 0) + this._time,
    value: ev.value,
    easing: ev.easing,
  }
  if (Array.isArray(v.value)) {
    if (v.value.length === 1) v.mix = mixv1
    else if (v.value.length === 2) v.mix = mixv2
    else if (v.value.length === 3) v.mix = mixv3
    else if (v.value.length === 4) v.mix = mixv4
    else v.mix = mixv
  }
}

function linear (t) { return t }
function mix (a, b, t) {
  t = max(min(t,1),0)
  return a*(1-t) + b*t
}

function mixv1 (out, a, b, t) {
  t = max(0,min(1,t))
  out[0] = a[0] * (1-t) + b[0] * t
  return out
}
function mixv2 (out, a, b, t) {
  t = max(0,min(1,t))
  out[0] = a[0] * (1-t) + b[0] * t
  out[1] = a[1] * (1-t) + b[1] * t
  return out
}
function mixv3 (out, a, b, t) {
  t = max(0,min(1,t))
  out[0] = a[0] * (1-t) + b[0] * t
  out[1] = a[1] * (1-t) + b[1] * t
  out[2] = a[2] * (1-t) + b[2] * t
  return out
}
function mixv4 (out, a, b, t) {
  t = max(0,min(1,t))
  out[0] = a[0] * (1-t) + b[0] * t
  out[1] = a[1] * (1-t) + b[1] * t
  out[2] = a[2] * (1-t) + b[2] * t
  out[3] = a[3] * (1-t) + b[3] * t
  return out
}
function mixv (out, a, b, t) {
  t = max(0,min(1,t))
  var len = max(a.length, b.length)
  for (var i = 0; i < len; i++) {
    out[i] = (a[i] || 0) * (1-t) + (b[i] || 0) * t
  }
  return out
}
