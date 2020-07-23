!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e(require("axios"));else if("function"==typeof define&&define.amd)define(["axios"],e);else{var n="object"==typeof exports?e(require("axios")):e(t.axios);for(var o in n)("object"==typeof exports?exports:t)[o]=n[o]}}(window,(function(t){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(e,n){e.exports=t},function(t,e,n){"use strict";n.r(e),n.d(e,"BAD_REQUEST",(function(){return r})),n.d(e,"NOT_FOUND",(function(){return a})),n.d(e,"AUTHORIZATION_FAILED",(function(){return s})),n.d(e,"ACCESS_DENIED",(function(){return c})),n.d(e,"SERVER_ERROR",(function(){return i})),n.d(e,"UNKNOWN_ERROR",(function(){return u})),n.d(e,"ConnectorBase",(function(){return l})),n.d(e,"handleAxiosError",(function(){return d})),n.d(e,"buildError",(function(){return y})),n.d(e,"ConnectorCrud",(function(){return x}));var o,r=400,a=404,s=401,c=403,i=500,u=1,f=n(0),p=n.n(f),l=function(t,e,n){var o=this;void 0===e&&(e=!0),this.getAxios=function(){return o.axiosInstance?o.axiosInstance:p.a},this.baseUrl=t,this.axiosInstance=n,this.axiosInstance?this.axiosInstance.defaults.withCredentials=e:p.a.defaults.withCredentials=e},h=(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),d=function(t){return t.response?y(t.response):t.request?{type:u,message:t.message,content:t.request}:{type:u,message:t.message}},y=function(t){var e;switch(t.status){case 400:e={type:r,constaintViolations:t.data};break;case 401:e={type:s};break;case 403:e={type:c,message:t.data||t.statusText};break;case 404:e={type:a,url:t.config.url};break;case 500:e={type:i,error:t.data};break;default:e={type:u,errorCode:t.status,message:t.statusText,content:t.data}}return e},x=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.axios=e.getAxios(),e.create=function(t,n){return void 0===n&&(n=!0),new Promise((function(o,r){e.axios.post(e.baseUrl,t,{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8"}}).then((function(t){if(201===t.status){var a=t.headers.location;n?e.axios.get(a,{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8"}}).then((function(t){200===t.status?o(t.data):r(y(t))})).catch((function(t){return r(d(t))})):o(a.substring(a.lastIndexOf("/")+1))}else r(y(t))})).catch((function(t){return r(d(t))}))}))},e.update=function(t,n,o){return void 0===o&&(o=!0),new Promise((function(r,a){e.axios.put(e.baseUrl+"/"+t,n,{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8"}}).then((function(n){200===n.status?o?e.axios.get(e.baseUrl+"/"+t,{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8"}}).then((function(t){200===t.status?r(t.data):a(y(t))})).catch((function(t){return a(d(t))})):r():a(y(n))})).catch((function(t){return a(d(t))}))}))},e.delete=function(t){return new Promise((function(n,o){e.axios.delete(e.baseUrl+"/"+t,{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8"}}).then((function(t){200===t.status?n():o(y(t))})).catch((function(t){return o(d(t))}))}))},e.postSearchRequest=function(t){return new Promise((function(n,o){e.axios.post(e.baseUrl+"/search",t,{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8","X-Cache-Control":"no-cache"}}).then((function(t){if(201===t.status){var e=t.headers.location;n(e.split("/").pop())}else o(y(t))})).catch((function(t){return o(d(t))}))}))},e.search=function(t,n,o){return new Promise((function(r,a){e.axios.get(e.baseUrl+"/search/"+t+"/resultset?pageSize="+n+"&page="+o,{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8","Cache-Control":"no-cache"}}).then((function(t){200===t.status?r(t.data):204===t.status?r([]):a(y(t))})).catch((function(t){return a(d(t))}))}))},e.getResultSetSize=function(t){return new Promise((function(n,o){e.axios.get(e.baseUrl+"/search/"+t+"/resultset-size",{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8","X-Cache-Control":"no-cache"}}).then((function(t){200===t.status?n(t.data):o(y(t))})).catch((function(t){return o(d(t))}))}))},e.getRecordById=function(t){return new Promise((function(n,o){e.axios.get(e.baseUrl+"/"+t,{headers:{Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8"}}).then((function(t){200===t.status?n(t.data):o(y(t))})).catch((function(t){return o(d(t))}))}))},e}return h(e,t),e}(l)}])}));
//# sourceMappingURL=index.js.map