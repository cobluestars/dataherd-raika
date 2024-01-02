!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["dataherd-raika"]=t():e["dataherd-raika"]=t()}(this,(()=>(()=>{"use strict";var e={};return{879:function(e,t){var n,r=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,a=t.length;o<a;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))};function o(){var e=n.startTime,t=n.endTime,r=n.peakTimes,o=function(e){return new Date(Date.parse(e+"Z"))},a=o(e),i=o(t),s=new Date;a.getTime()>i.getTime()&&(a=s,i=new Date(s.getTime()+1e3));var l=r;l&&!function(e,t,n){return!e||!(!Array.isArray(e)||!e.every((function(e){return Array.isArray(e)&&2===e.length})))&&e.every((function(e){var r=e[0],a=e[1],i=o(r),s=o(a);return i>=t&&s<=n}))}(l,a,i)&&(console.error("Invalid peak times format or out of range. Defaulting to random timestamp between start and end."),l=void 0);var u=function(e,t){var n=e.getTime()+Math.random()*(t.getTime()-e.getTime());return new Date(n)};if(!r)return u(a,i);var f=r.map((function(e){return[o(e[0]),o(e[1])]})),c=i.getTime()-a.getTime(),m=f.map((function(e){var t=e[0];return(e[1].getTime()-t.getTime())/c*10})),d=Math.max(1,10-m.reduce((function(e,t){return e+t}),0));f.push([a,i]),m.push(d);var p=f[Math.floor(Math.random()*f.length)];return u(p[0],p[1])}Object.defineProperty(t,"__esModule",{value:!0}),t.setUserKeywordCount=t.setUserClickCount=t.trackKeywordEvent=t.trackClickEvent=t.createRandomData=t.gaussianRandom=t.getLocalCustomDataGroup=t.setLocalCustomDataGroup=t.setGlobalUserDefinedItems=t.GlobalUserDefinedItems=t.getRandomTimestamp=t.initializeTimestampSettings=t.endTime=t.startTime=t.userDefinedKeywordCount=t.userDefinedClickCount=void 0,t.userDefinedClickCount=1,t.userDefinedKeywordCount=1,t.startTime=new Date,t.endTime=new Date,t.initializeTimestampSettings=function(e){var t=(new Date).toISOString();n={startTime:e.startTime||t,endTime:e.endTime||t,peakTimes:e.peakTimes}},t.getRandomTimestamp=o,t.GlobalUserDefinedItems=[];var a={};function i(e){return a[e]||[]}function s(e,t){for(var n=0,r=0;0===n;)n=Math.random();for(;0===r;)r=Math.random();var o=Math.sqrt(-2*Math.log(n))*Math.cos(2*Math.PI*r);return o*t+e}function l(e){var t={};return e.forEach((function(e){var n,o,a,i,c,m,d=null!==(n=e.randomizeArrays)&&void 0!==n&&n,p=null!==(o=e.randomizeObjects)&&void 0!==o&&o,v=null!==(a=e.arraySelectionCount)&&void 0!==a?a:1,y=null!==(i=e.objectSelectionCount)&&void 0!==i?i:1,b=null!==(c=e.selectionProbability)&&void 0!==c&&c,h=null!==(m=e.randomizeSelectionCount)&&void 0!==m&&m;switch(e.type){case"number":if("number"==typeof e.options)t[e.name]=e.options;else if(Array.isArray(e.options)&&2===e.options.length){var g=e.options,D=g[0],C=g[1],M=null!=e.distribution?e.distribution:"uniform",T=null!=e.mean?e.mean:(D+C)/2,k=null!=e.standardDeviation?e.standardDeviation:(C-D)/6;if("uniform"===M)t[e.name]=Math.floor(Math.random()*(C-D+1))+D;else if("normal"===M){var w=s(T,k);w=Math.max(D,Math.min(C,w)),t[e.name]=Math.floor(w)}}else console.error("Invalid format for 'number' type in UserDefinedItem: ".concat(e.name));break;case"string":if("string"==typeof e.options)t[e.name]=e.options;else if(Array.isArray(e.options))if(e.options.every((function(e){return"string"==typeof e})))if(!0===b){var I=u(e.options,e.probabilitySetting||[]),A=f(e.options,I);t[e.name]=A.length>0?A[0]:null}else t[e.name]=e.options[Math.floor(Math.random()*e.options.length)];else console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(e.name,", options must be an array of strings"));else console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(e.name));break;case"boolean":t[e.name]=Math.random()<.5;break;case"array":if(Array.isArray(e.options)&&e.options.length>0)if(d)if(b)I=u(e.options,e.probabilitySetting||[],!1),A=(A=f(e.options,I)).slice(0,v),t[e.name]=A.map((function(e){return"object"==typeof e&&null!==e?l([e]):e}));else{var E=v;h&&(E=Math.floor(Math.random()*E)+1);var j=r([],e.options,!0).sort((function(){return.5-Math.random()}));t[e.name]=j.slice(0,E).map((function(e){return"object"==typeof e&&null!==e?l([e]):e}))}else t[e.name]=e.options.map((function(e){return"object"==typeof e&&null!==e?l([e]):e}));else console.error("Invalid format for 'array' type in UserDefinedItem: ".concat(e.name));break;case"object":if("object"!=typeof e.options||null===e.options||Array.isArray(e.options))console.error("Invalid format for 'object' type in UserDefinedItem: ".concat(e.name));else{var U=e.options;if(p){var G=[];if(b)G=(G=f(S=Object.keys(U),I=u(S,e.probabilitySetting||[],!0))).slice(0,y),h&&(G=G.slice(0,Math.floor(Math.random()*G.length)+1));else{var S=Object.keys(U);E=y,h&&(E=Math.floor(Math.random()*E)+1),G=S.sort((function(){return.5-Math.random()})).slice(0,E)}G.forEach((function(n){var r=U[n];r&&"object"==typeof r&&"name"in r&&"type"in r?(t[e.name]=t[e.name]||{},t[e.name][n]=l([r])):(t[e.name]=t[e.name]||{},t[e.name][n]=r)}))}else Object.keys(U).forEach((function(n){var r=U[n];r&&"object"==typeof r&&"name"in r&&"type"in r?(t[e.name]=t[e.name]||{},t[e.name][n]=l([r])):(t[e.name]=t[e.name]||{},t[e.name][n]=r)}))}}})),t}function u(e,t,n){void 0===n&&(n=!1);var r=new Array(e.length).fill(0),o=0,a=[];n&&(a=Object.keys(e)),t.forEach((function(t){var i=-1;n&&"number"==typeof t.identifier?t.identifier<a.length&&(i=t.identifier):n&&"string"==typeof t.identifier?i=a.indexOf(t.identifier):n||(i="number"==typeof t.identifier?t.identifier:e.indexOf(t.identifier)),i>=0&&i<e.length&&(r[i]=t.probability,o+=t.probability)}));var i=100-o,s=r.filter((function(e){return 0===e})).length,l=s>0?i/s:0;return r=r.map((function(e){return 0===e?l:e}))}function f(e,t){var n=[],r=[];if(e.forEach((function(e,o){100*Math.random()<t[o]?n.push(e):0===t[o]&&r.push(e)})),0===n.length&&r.length>0){var o=Math.floor(Math.random()*r.length);n.push(r[o])}return n}t.setGlobalUserDefinedItems=function(e){t.GlobalUserDefinedItems=e},t.setLocalCustomDataGroup=function(e,t){a[e]=t},t.getLocalCustomDataGroup=i,t.gaussianRandom=s,t.createRandomData=l,t.trackClickEvent=function(e,n,r,a,s){void 0===r&&(r=!1),void 0===a&&(a=!1);for(var u={},f=0;f<t.userDefinedClickCount;f++){var c=i(n),m={eventType:e.type,timestamp:o(),clickCount:f+1};if(r&&c.length>0){var d=l(c);Object.assign(m,d)}if(a){var p=l(t.GlobalUserDefinedItems);Object.assign(m,p)}u["".concat(e.type,"_").concat(f+1)]=m}s&&s(u),console.log("Click Event Data:",u)},t.trackKeywordEvent=function(e,n,r,a,s,u){void 0===r&&(r=!1),void 0===a&&(a=!1),void 0===s&&(s=1);for(var f={},c=0;c<t.userDefinedKeywordCount;c++){var m=i(n),d={keyword:e,eventType:n,timestamp:o(),keywordCount:c+1,repeatCount:s};if(r&&m.length>0){var p=l(m);Object.assign(d,p)}if(a){var v=l(t.GlobalUserDefinedItems);Object.assign(d,v)}f["".concat(n,"_").concat(c+1)]=d}u&&u(f),console.log("Keyword Event Data:",f)},t.setUserClickCount=function(e){e>=1&&e<=Number.MAX_SAFE_INTEGER?t.userDefinedClickCount=e:(console.error("Invalid Click Count. Please enter a number between 1 and ".concat(Number.MAX_SAFE_INTEGER,". Default value 1 will be set.")),t.userDefinedClickCount=1)},t.setUserKeywordCount=function(e){e>=1&&e<=Number.MAX_SAFE_INTEGER?t.userDefinedKeywordCount=e:(console.error("Invalid Keyword Count. Please enter a number between 1 and ".concat(Number.MAX_SAFE_INTEGER,". Default value 1 will be set.")),t.userDefinedKeywordCount=1)}}}[879](0,e),e})()));