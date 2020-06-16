/* money.js 0.2, MIT license, http://openexchangerates.github.io/money.js */
(function (g, j) {
  var b = function (a) {
    return new i(a);
  };
  b.version = "0.1.3";
  var c = g.fxSetup || { rates: {}, base: "" };
  b.rates = c.rates;
  b.base = c.base;
  b.settings = { from: c.from || b.base, to: c.to || b.base };
  var h = (b.convert = function (a, e) {
      if ("object" === typeof a && a.length) {
        for (var d = 0; d < a.length; d++) a[d] = h(a[d], e);
        return a;
      }
      e = e || {};
      if (!e.from) e.from = b.settings.from;
      if (!e.to) e.to = b.settings.to;
      var d = e.to,
        c = e.from,
        f = b.rates;
      f[b.base] = 1;
      if (!f[d] || !f[c]) throw "fx error";
      d = c === b.base ? f[d] : d === b.base ? 1 / f[c] : f[d] * (1 / f[c]);
      return a * d;
    }),
    i = function (a) {
      "string" === typeof a
        ? ((this._v = parseFloat(a.replace(/[^0-9-.]/g, ""))),
          (this._fx = a.replace(/([^A-Za-z])/g, "")))
        : (this._v = a);
    },
    c = (b.prototype = i.prototype);
  c.convert = function () {
    var a = Array.prototype.slice.call(arguments);
    a.unshift(this._v);
    return h.apply(b, a);
  };
  c.from = function (a) {
    a = b(h(this._v, { from: a, to: b.base }));
    a._fx = b.base;
    return a;
  };
  c.to = function (a) {
    return h(this._v, { from: this._fx ? this._fx : b.settings.from, to: a });
  };
  if ("undefined" !== typeof exports) {
    if ("undefined" !== typeof module && module.exports)
      exports = module.exports = b;
    exports.fx = fx;
  } else
    "function" === typeof define && define.amd
      ? define([], function () {
          return b;
        })
      : ((b.noConflict = (function (a) {
          return function () {
            g.fx = a;
            b.noConflict = j;
            return b;
          };
        })(g.fx)),
        (g.fx = b));
})(this);


var request = new XMLHttpRequest()
var ratesFetched = []; 
// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://api.exchangeratesapi.io/latest', true)

request.onload = function() {
  // Begin accessing JSON data here
  var ratesFetched = JSON.parse(request.response).rates;
  fx.base = "EUR";
    fx.rates = {
        "EUR" : 1,
        "GBP" : ratesFetched.GBP,
        "HKD" : ratesFetched.HKD,
        "USD" : ratesFetched.USD,
        "ISK" : ratesFetched.ISK,
        "PHP" : ratesFetched.PHP,
        "DKK" : ratesFetched.DKK,
        "HUF" : ratesFetched.HUF,
        "CZK" : ratesFetched.CZK,
        "AUD" : ratesFetched.AUD,
        "RON" : ratesFetched.RON,
        "SEK" : ratesFetched.SEK,
        "IDR" : ratesFetched.IDR,
        "INR" : ratesFetched.INR,
        "BRL" : ratesFetched.BRL,
        "RUB" : ratesFetched.RUB,
        "HRK" : ratesFetched.HRK,
        "JPY" : ratesFetched.JPY,
        "THB" : ratesFetched.THB,
        "CHF" : ratesFetched.CHF,
        "SGD" : ratesFetched.SGD,
        "PLN" : ratesFetched.PLN,
        "BGN" : ratesFetched.BGN,
        "TRY" : ratesFetched.TRY,
        "CNY" : ratesFetched.CNY,
        "NOK" : ratesFetched.NOK,
        "NZD" : ratesFetched.NZD,
        "ZAR" : ratesFetched.ZAR,
        "MXN" : ratesFetched.MXN,
        "ILS" : ratesFetched.ILS,
        "GBP" : ratesFetched.GBP,
        "KRW" : ratesFetched.KRW,
        "MYR" : ratesFetched.MYR
    };
    
    // console.log(fx.convert(6, {from: "EUR", to: "INR"}));

}

// Send request
request.send()

//Page Functionalities
var input1 = document.querySelector("#input1");
var input2 = document.querySelector("#input2");
var selection1 = document.querySelector("#selection1");
var selection2 = document.querySelector("#selection2");
var ans = document.querySelector(".ans");
input1.addEventListener("keyup",(e)=>{
    let val = fx.convert(input1.value, {from: selection1.value, to: selection2.value});
    input2.value = val.toFixed(3);
})
input2.addEventListener("keyup",(e)=>{
    let val = fx.convert(input2.value, {from: selection2.value, to: selection1.value});
    input1.value = val.toFixed(3);
})
selection1.addEventListener("change",(e)=>{
  let val = fx.convert(input2.value, {from: selection2.value, to: selection1.value});
  input1.value = val.toFixed(3);  
})
selection2.addEventListener("change",(e)=>{
  let val = fx.convert(input1.value, {from: selection1.value, to: selection2.value});
  input2.value = val.toFixed(3);
})