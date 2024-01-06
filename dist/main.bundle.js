!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["dataherd-raika"]=t():e["dataherd-raika"]=t()}(this,(()=>(()=>{"use strict";var e={};return{879:function(e,t){var n,a=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var a,o=0,r=t.length;o<r;o++)!a&&o in t||(a||(a=Array.prototype.slice.call(t,0,o)),a[o]=t[o]);return e.concat(a||Array.prototype.slice.call(t))};function o(){var e=n.startTime,t=n.endTime,a=n.peakTimes,o=function(e){return new Date(Date.parse(e+"Z"))},r=o(e),i=o(t),s=new Date;r.getTime()>i.getTime()&&(r=s,i=new Date(s.getTime()+1e3));var c=a;c&&!function(e,t,n){return!e||!(!Array.isArray(e)||!e.every((function(e){return Array.isArray(e)&&2===e.length})))&&e.every((function(e){var a=e[0],r=e[1],i=o(a),s=o(r);return i>=t&&s<=n}))}(c,r,i)&&(console.error("Invalid peak times format or out of range. Defaulting to random timestamp between start and end."),c=void 0);var l=function(e,t){var n=e.getTime()+Math.random()*(t.getTime()-e.getTime());return new Date(n)};if(!a)return l(r,i);var m=a.map((function(e){return[o(e[0]),o(e[1])]})),u=i.getTime()-r.getTime(),f=m.map((function(e){var t=e[0];return(e[1].getTime()-t.getTime())/u*10})),d=Math.max(1,10-f.reduce((function(e,t){return e+t}),0));m.push([r,i]),f.push(d);var p=m[Math.floor(Math.random()*m.length)];return l(p[0],p[1])}Object.defineProperty(t,"__esModule",{value:!0}),t.setUserKeywordCount=t.setUserClickCount=t.trackKeywordEvent=t.trackClickEvent=t.setShotgunMode=t.createRandomData=t.gaussianRandom=t.getLocalCustomDataGroup=t.setLocalCustomDataGroup=t.setGlobalUserDefinedItems=t.GlobalUserDefinedItems=t.getRandomTimestamp=t.initializeTimestampSettings=t.endTime=t.startTime=t.userDefinedKeywordCount=t.userDefinedClickCount=void 0,t.userDefinedClickCount=1,t.userDefinedKeywordCount=1,t.startTime=new Date,t.endTime=new Date,t.initializeTimestampSettings=function(e){var t=(new Date).toISOString();n={startTime:e.startTime||t,endTime:e.endTime||t,peakTimes:e.peakTimes}},t.getRandomTimestamp=o,t.GlobalUserDefinedItems=[];var r={};function i(e){return r[e]||[]}function s(e,t){for(var n=0,a=0;0===n;)n=Math.random();for(;0===a;)a=Math.random();var o=Math.sqrt(-2*Math.log(n))*Math.cos(2*Math.PI*a);return o*t+e}function c(e,t){void 0===t&&(t=!1);var n,o={};return t||e.forEach((function(e){e.name&&"object"===e.type&&e.cacheSettings&&!0===e.cacheSettings.enableCacheSimulation&&!e.options&&(n=function(e){if(!e.enableCacheSimulation)return{totalDelay:0,simulatedDelay:0};for(var t=performance.now(),n={size:e.simulatedCacheSize,delay:e.simulatedDelay,content:[]},a="",o=0;o<1e6*e.simulatedCacheSize;o++)a+="QUICKBROWNFOXJUMPSOVERTHELAZYDOGquickbrownfoxjumpsoverthelazydog0123456789".charAt(Math.floor(74*Math.random()));n.content.push(a);var r=performance.now()-t,i=e.simulatedDelay+r;return e.simulatedDelay>0&&setTimeout((function(){}),e.simulatedDelay),{simulatedCacheSize_MB:e.simulatedCacheSize,simulatedCacheDelay_ms:r,simulatedDelay_ms:e.simulatedDelay,totalDelay_ms:i}}(e.cacheSettings))})),e.forEach((function(e){var t,n,r,i,u,f,d=null!==(t=e.randomizeArrays)&&void 0!==t&&t,p=null!==(n=e.randomizeObjects)&&void 0!==n&&n,h=null!==(r=e.arraySelectionCount)&&void 0!==r?r:1,y=null!==(i=e.objectSelectionCount)&&void 0!==i?i:1,v=null!==(u=e.selectionProbability)&&void 0!==u&&u,b=null!==(f=e.randomizeSelectionCount)&&void 0!==f&&f;switch(e.type){case"number":if("number"==typeof e.options)o[e.name]=e.options;else if(Array.isArray(e.options)&&2===e.options.length){var g=e.options,D=g[0],C=g[1],M=null!=e.distribution?e.distribution:"uniform",I=null!=e.mean?e.mean:(D+C)/2,T=null!=e.standardDeviation?e.standardDeviation:(C-D)/6;if("uniform"===M)o[e.name]=Math.floor(Math.random()*(C-D+1))+D;else if("normal"===M){var k=s(I,T);k=Math.max(D,Math.min(C,k)),o[e.name]=Math.floor(k)}}else console.error("Invalid format for 'number' type in UserDefinedItem: ".concat(e.name));break;case"string":if("string"==typeof e.options)o[e.name]=e.options;else if(Array.isArray(e.options))if(e.options.every((function(e){return"string"==typeof e})))if(!0===v){var w=l(e.options,e.probabilitySetting||[]),j=m(e.options,w);o[e.name]=j.length>0?j[0]:null}else o[e.name]=e.options[Math.floor(Math.random()*e.options.length)];else console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(e.name,", options must be an array of strings"));else console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(e.name));break;case"boolean":o[e.name]=Math.random()<.5;break;case"array":if(Array.isArray(e.options)&&e.options.length>0)if(d)if(v)w=l(e.options,e.probabilitySetting||[],!1),j=(j=m(e.options,w)).slice(0,h),o[e.name]=j.map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}));else{var A=h;b&&(A=Math.floor(Math.random()*A)+1);var E=a([],e.options,!0).sort((function(){return.5-Math.random()}));o[e.name]=E.slice(0,A).map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}))}else o[e.name]=e.options.map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}));else console.error("Invalid format for 'array' type in UserDefinedItem: ".concat(e.name));break;case"object":if("object"==typeof e.options&&null!==e.options&&!Array.isArray(e.options)){var S=e.options;if(p){var O=[];if(v)O=(O=m(U=Object.keys(S),w=l(U,e.probabilitySetting||[],!0))).slice(0,y),b&&(O=O.slice(0,Math.floor(Math.random()*O.length)+1));else{var U=Object.keys(S);A=y,b&&(A=Math.floor(Math.random()*A)+1),O=U.sort((function(){return.5-Math.random()})).slice(0,A)}O.forEach((function(t){var n=S[t];if(n&&"object"==typeof n&&"name"in n&&"type"in n)return o[e.name]=o[e.name]||{},c([n],!0).randomData;o[e.name]=o[e.name]||{},o[e.name][t]=n})),0===O.length&&console.error("Invalid object configuration for randomizeObjects in UserDefinedItem: ".concat(e.name))}else Object.keys(S).forEach((function(t){var n=S[t];if(n&&"object"==typeof n&&"name"in n&&"type"in n)return o[e.name]=o[e.name]||{},c([n],!0).randomData;o[e.name]=o[e.name]||{},o[e.name][t]=n})),0===Object.keys(S).length&&console.error("Invalid object configuration for non-randomized objects in UserDefinedItem: ".concat(e.name))}}})),{randomData:o,cacheImpact:n}}function l(e,t,n){void 0===n&&(n=!1);var a=new Array(e.length).fill(0),o=0,r=[];if(n&&(r=Object.keys(e)),t.forEach((function(t){var i=-1;n&&"number"==typeof t.identifier?t.identifier<r.length&&(i=t.identifier):n&&"string"==typeof t.identifier?i=r.indexOf(t.identifier):n||(i="number"==typeof t.identifier?t.identifier:e.indexOf(t.identifier)),i>=0&&i<e.length&&(a[i]=t.probability,o+=t.probability)})),o<100){var i=a.filter((function(e){return 0===e})),s=(100-o)/i.length;a=a.map((function(e){return 0===e?s:e}))}return a}function m(e,t){var n=[];if(e.forEach((function(e,a){100*Math.random()<t[a]&&n.push(e)})),0===n.length){var a=e.filter((function(e,n){return 0===t[n]}));if(a.length>0){var o=Math.floor(Math.random()*a.length);n.push(a[o])}else o=Math.floor(Math.random()*e.length),n.push(e[o])}return n}t.setGlobalUserDefinedItems=function(e){t.GlobalUserDefinedItems=e},t.setLocalCustomDataGroup=function(e,t){r[e]=t},t.getLocalCustomDataGroup=i,t.gaussianRandom=s,t.createRandomData=c;var u=!1,f=1e3;function d(e,t){var n=Object.keys(e),a=0;!function o(){var r;if(a<n.length){var i=n[a];t(((r={})[i]=e[i],r)),a++,setTimeout(o,f)}}()}t.setShotgunMode=function(e,t){u=e,f=t},t.trackClickEvent=function(e,n,a,r,s){void 0===a&&(a=!1),void 0===r&&(r=!1);for(var l={},m=0;m<t.userDefinedClickCount;m++){var f={eventType:e.type,timestamp:o(),clickCount:m+1};if(a){var p=c(i(n)),h=p.randomData,y=p.cacheImpact;Object.assign(f,h),y&&(f.cacheImpact=y)}if(r){var v=c(t.GlobalUserDefinedItems);h=v.randomData,y=v.cacheImpact,Object.assign(f,h),y&&(f.cacheImpact=y)}l["".concat(e.type,"_").concat(m+1)]=f}u&&s?d(l,s):s&&s(l),console.log("Click Event Data:",l)},t.trackKeywordEvent=function(e,n,a,r,s,l){void 0===a&&(a=!1),void 0===r&&(r=!1),void 0===s&&(s=1);for(var m={},f=0;f<t.userDefinedKeywordCount;f++){var p={keyword:e,eventType:n,timestamp:o(),keywordCount:f+1,repeatCount:s};if(a){var h=c(i(n)),y=h.randomData;(b=h.cacheImpact)&&(p.cacheImpact=b),Object.assign(p,y)}if(r){var v=c(t.GlobalUserDefinedItems),b=(y=v.randomData,v.cacheImpact);Object.assign(p,y),b&&(p.cacheImpact=b)}m["".concat(n,"_").concat(f+1)]=p}u&&l?d(m,l):l&&l(m),console.log("Keyword Event Data:",m)},t.setUserClickCount=function(e){e>=1&&e<=Number.MAX_SAFE_INTEGER?t.userDefinedClickCount=e:(console.error("Invalid Click Count. Please enter a number between 1 and ".concat(Number.MAX_SAFE_INTEGER,". Default value 1 will be set.")),t.userDefinedClickCount=1)},t.setUserKeywordCount=function(e){e>=1&&e<=Number.MAX_SAFE_INTEGER?t.userDefinedKeywordCount=e:(console.error("Invalid Keyword Count. Please enter a number between 1 and ".concat(Number.MAX_SAFE_INTEGER,". Default value 1 will be set.")),t.userDefinedKeywordCount=1)}}}[879](0,e),e})()));