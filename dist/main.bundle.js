!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["dataherd-raika"]=t():e["dataherd-raika"]=t()}(this,(()=>(()=>{"use strict";var e={};return{879:function(e,t){var n,o=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var o,a=0,r=t.length;a<r;a++)!o&&a in t||(o||(o=Array.prototype.slice.call(t,0,a)),o[a]=t[a]);return e.concat(o||Array.prototype.slice.call(t))};function a(){var e=n.startTime,t=n.endTime,o=n.peakTimes,a=n.peakTimeWeight,r=function(e){return new Date(Date.parse(e+"Z"))},i=r(e),s=r(t);i.getTime()>s.getTime()&&(i=new Date,s=new Date(i.getTime()+1e3));var c=function(e,t){var n=e.getTime()+Math.random()*(t.getTime()-e.getTime());return new Date(n)},l=(o||[]).map((function(e){return[r(e[0]),r(e[1])]})),m=s.getTime()-i.getTime(),f=l.reduce((function(e,t){var n=t[0];return e+(t[1].getTime()-n.getTime())}),0),u=a||1.6,d=f/m,p=(m-f)/m;if(p=1-(d=d*u/(d*u+p)),Math.random()<d){var y=l[Math.floor(Math.random()*l.length)];return c(y[0],y[1])}for(var h=[],b=i,v=0,g=l;v<g.length;v++){var D=g[v];b<D[0]&&h.push([b,D[0]]),b=D[1]}b<s&&h.push([b,s]);var M=h[Math.floor(Math.random()*h.length)];return c(M[0],M[1])}Object.defineProperty(t,"__esModule",{value:!0}),t.setUserKeywordCount=t.setUserClickCount=t.trackKeywordEvent=t.trackClickEvent=t.setShotgunMode=t.createRandomData=t.gaussianRandom=t.getLocalCustomDataGroup=t.setLocalCustomDataGroup=t.setGlobalUserDefinedItems=t.GlobalUserDefinedItems=t.getRandomTimestamp=t.initializeTimestampSettings=t.endTime=t.startTime=t.userDefinedKeywordCount=t.userDefinedClickCount=void 0,t.userDefinedClickCount=1,t.userDefinedKeywordCount=1,t.startTime=new Date,t.endTime=new Date,t.initializeTimestampSettings=function(e){var t=(new Date).toISOString();n={startTime:e.startTime||t,endTime:e.endTime||t,peakTimes:e.peakTimes,peakTimeWeight:e.peakTimeWeight||1.6}},t.getRandomTimestamp=a,t.GlobalUserDefinedItems=[];var r={};function i(e){return r[e]||[]}function s(e,t){for(var n=0,o=0;0===n;)n=Math.random();for(;0===o;)o=Math.random();var a=Math.sqrt(-2*Math.log(n))*Math.cos(2*Math.PI*o);return a*t+e}function c(e,t){void 0===t&&(t=!1);var n,a={};return t||e.forEach((function(e){e.name&&"object"===e.type&&e.cacheSettings&&!0===e.cacheSettings.enableCacheSimulation&&!e.options&&(n=function(e){if(!e.enableCacheSimulation)return{totalDelay:0,simulatedDelay:0};for(var t=performance.now(),n={size:e.simulatedCacheSize,delay:e.simulatedDelay,content:[]},o="",a=0;a<1e6*e.simulatedCacheSize;a++)o+="QUICKBROWNFOXJUMPSOVERTHELAZYDOGquickbrownfoxjumpsoverthelazydog0123456789".charAt(Math.floor(74*Math.random()));n.content.push(o);var r=performance.now()-t,i=e.simulatedDelay+r;return e.simulatedDelay>0&&setTimeout((function(){}),e.simulatedDelay),{simulatedCacheSize_MB:e.simulatedCacheSize,simulatedCacheDelay_ms:r,simulatedDelay_ms:e.simulatedDelay,totalDelay_ms:i}}(e.cacheSettings))})),e.forEach((function(e){var t,n,r,i,f,u,d=function(e,t){if(e.contextBasedOptions)return e.contextBasedOptions&&e.contextBasedOptions(t)}(e,a);if(void 0!==d)if("object"==typeof d&&null!==d)switch(e.type){case"number":a[e.name]=function(e){var t=e.options[0],n=e.options[1],o=e.mean||(t+n)/2,a=e.standardDeviation||(n-t)/6,r=e.distribution||"uniform";if("uniform"===r)return Math.floor(Math.random()*(n-t+1))+t;if("normal"===r){var i=s(o,a);return Math.max(t,Math.min(n,i))}}(d);break;case"string":a[e.name]=function(e){if("string"==typeof e.options)return e.options;if(Array.isArray(e.options)){if(e.options.every((function(e){return"string"==typeof e}))){if(!0===e.selectionProbability){var t=l(e.options,e.probabilitySetting||[]),n=m(e.options,t);return n.length>0?n[0]:null}return e.options[Math.floor(Math.random()*e.options.length)]}console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(e.name,", options must be an array of strings"))}else console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(e.name))}(d);break;case"boolean":a[e.name]=function(e){if("boolean"==typeof e.options)return Math.random()<.5}(d);break;case"array":a[e.name]=function(e){if(Array.isArray(e.options)&&e.options.length>0){if(e.randomizeArrays){if(e.selectionProbability){var t=l(e.options,e.probabilitySetting||[],!1),n=m(e.options,t);return(n=n.slice(0,e.arraySelectionCount)).map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}))}var a=e.arraySelectionCount;return e.randomizeSelectionCount&&(a=Math.floor(Math.random()*a)+1),o([],e.options,!0).sort((function(){return.5-Math.random()})).slice(0,a).map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}))}return e.options.map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}))}console.error("Invalid format for 'array' type in UserDefinedItem: ".concat(e.name))}(d);break;case"object":a[e.name]=function(e){if("object"==typeof e.options&&null!==e.options&&!Array.isArray(e.options)){var t=e.options;if(e.randomizeObjects){var n=[];if(e.selectionProbability)n=(n=m(o=Object.keys(t),l(o,e.probabilitySetting||[],!0))).slice(0,e.objectSelectionCount),e.randomizeSelectionCount&&(n=n.slice(0,Math.floor(Math.random()*n.length)+1));else{var o=Object.keys(t),a=e.objectSelectionCount;e.randomizeSelectionCount&&(a=Math.floor(Math.random()*a)+1),n=o.sort((function(){return.5-Math.random()})).slice(0,a)}n.forEach((function(e){var n=t[e];return n&&"object"==typeof n&&"name"in n&&"type"in n?c([n],!0).randomData:n})),0===n.length&&console.error("Invalid object configuration for randomizeObjects in UserDefinedItem: ".concat(e.name))}else Object.keys(t).forEach((function(e){var n=t[e];return n&&"object"==typeof n&&"name"in n&&"type"in n?c([n],!0).randomData:n})),0===Object.keys(t).length&&console.error("Invalid object configuration for non-randomized objects in UserDefinedItem: ".concat(e.name))}}(d);break;default:console.error("Unsupported type in contextBasedOptions for ".concat(e.name))}else a[e.name]=d;else{var p=null!==(t=e.randomizeArrays)&&void 0!==t&&t,y=null!==(n=e.randomizeObjects)&&void 0!==n&&n,h=null!==(r=e.arraySelectionCount)&&void 0!==r?r:1,b=null!==(i=e.objectSelectionCount)&&void 0!==i?i:1,v=null!==(f=e.selectionProbability)&&void 0!==f&&f,g=null!==(u=e.randomizeSelectionCount)&&void 0!==u&&u;switch(e.type){case"number":if("number"==typeof e.options)a[e.name]=e.options;else if(Array.isArray(e.options)&&2===e.options.length){var D=e.options,M=D[0],C=D[1],j=null!=e.distribution?e.distribution:"uniform",I=null!=e.mean?e.mean:(M+C)/2,k=null!=e.standardDeviation?e.standardDeviation:(C-M)/6;if("uniform"===j)a[e.name]=Math.floor(Math.random()*(C-M+1))+M;else if("normal"===j){var T=s(I,k);T=Math.max(M,Math.min(C,T)),a[e.name]=Math.floor(T)}}else console.error("Invalid format for 'number' type in UserDefinedItem: ".concat(e.name));break;case"string":if("string"==typeof e.options)a[e.name]=e.options;else if(Array.isArray(e.options))if(e.options.every((function(e){return"string"==typeof e})))if(!0===v){var S=l(e.options,e.probabilitySetting||[]),w=m(e.options,S);a[e.name]=w.length>0?w[0]:null}else a[e.name]=e.options[Math.floor(Math.random()*e.options.length)];else console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(e.name,", options must be an array of strings"));else console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(e.name));break;case"boolean":a[e.name]=Math.random()<.5;break;case"array":if(Array.isArray(e.options)&&e.options.length>0)if(p)if(v)S=l(e.options,e.probabilitySetting||[],!1),w=(w=m(e.options,S)).slice(0,h),a[e.name]=w.map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}));else{var A=h;g&&(A=Math.floor(Math.random()*A)+1);var O=o([],e.options,!0).sort((function(){return.5-Math.random()}));a[e.name]=O.slice(0,A).map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}))}else a[e.name]=e.options.map((function(e){return"object"==typeof e&&null!==e?c([e],!0).randomData:e}));else console.error("Invalid format for 'array' type in UserDefinedItem: ".concat(e.name));break;case"object":if("object"==typeof e.options&&null!==e.options&&!Array.isArray(e.options)){var E=e.options;if(y){var U=[];if(v)U=(U=m(z=Object.keys(E),S=l(z,e.probabilitySetting||[],!0))).slice(0,b),g&&(U=U.slice(0,Math.floor(Math.random()*U.length)+1));else{var z=Object.keys(E);A=b,g&&(A=Math.floor(Math.random()*A)+1),U=z.sort((function(){return.5-Math.random()})).slice(0,A)}U.forEach((function(t){var n=E[t];if(n&&"object"==typeof n&&"name"in n&&"type"in n)return a[e.name]=a[e.name]||{},c([n],!0).randomData;a[e.name]=a[e.name]||{},a[e.name][t]=n})),0===U.length&&console.error("Invalid object configuration for randomizeObjects in UserDefinedItem: ".concat(e.name))}else Object.keys(E).forEach((function(t){var n=E[t];if(n&&"object"==typeof n&&"name"in n&&"type"in n)return a[e.name]=a[e.name]||{},c([n],!0).randomData;a[e.name]=a[e.name]||{},a[e.name][t]=n})),0===Object.keys(E).length&&console.error("Invalid object configuration for non-randomized objects in UserDefinedItem: ".concat(e.name))}}}})),{randomData:a,cacheImpact:n}}function l(e,t,n){void 0===n&&(n=!1);var o=new Array(e.length).fill(0),a=0,r=[];if(n&&(r=Object.keys(e)),t.forEach((function(t){var i=-1;n&&"number"==typeof t.identifier?t.identifier<r.length&&(i=t.identifier):n&&"string"==typeof t.identifier?i=r.indexOf(t.identifier):n||(i="number"==typeof t.identifier?t.identifier:e.indexOf(t.identifier)),i>=0&&i<e.length&&(o[i]=t.probability,a+=t.probability)})),a<100){var i=o.filter((function(e){return 0===e})),s=(100-a)/i.length;o=o.map((function(e){return 0===e?s:e}))}return o}function m(e,t){var n=[];if(e.forEach((function(e,o){100*Math.random()<t[o]&&n.push(e)})),0===n.length){var o=e.filter((function(e,n){return 0===t[n]}));if(o.length>0){var a=Math.floor(Math.random()*o.length);n.push(o[a])}else a=Math.floor(Math.random()*e.length),n.push(e[a])}return n}t.setGlobalUserDefinedItems=function(e){t.GlobalUserDefinedItems=e},t.setLocalCustomDataGroup=function(e,t){r[e]=t},t.getLocalCustomDataGroup=i,t.gaussianRandom=s,t.createRandomData=c;var f=!1,u=1e3;function d(e,t){var n=Object.keys(e),o=0;!function a(){var r;if(o<n.length){var i=n[o];t(((r={})[i]=e[i],r)),o++,setTimeout(a,u)}}()}t.setShotgunMode=function(e,t){f=e,u=t},t.trackClickEvent=function(e,n,o,r,s){void 0===o&&(o=!1),void 0===r&&(r=!1);for(var l={},m=0;m<t.userDefinedClickCount;m++){var u={eventType:e.type,timestamp:a(),clickCount:m+1};if(o){var p=c(i(n)),y=p.randomData,h=p.cacheImpact;Object.assign(u,y),h&&(u.cacheImpact=h)}if(r){var b=c(t.GlobalUserDefinedItems);y=b.randomData,h=b.cacheImpact,Object.assign(u,y),h&&(u.cacheImpact=h)}l["".concat(e.type,"_").concat(m+1)]=u}f&&s?d(l,s):s&&s(l),console.log("Click Event Data:",l)},t.trackKeywordEvent=function(e,n,o,r,s,l){void 0===o&&(o=!1),void 0===r&&(r=!1),void 0===s&&(s=1);for(var m={},u=0;u<t.userDefinedKeywordCount;u++){var p={keyword:e,eventType:n,timestamp:a(),keywordCount:u+1,repeatCount:s};if(o){var y=c(i(n)),h=y.randomData;(v=y.cacheImpact)&&(p.cacheImpact=v),Object.assign(p,h)}if(r){var b=c(t.GlobalUserDefinedItems),v=(h=b.randomData,b.cacheImpact);Object.assign(p,h),v&&(p.cacheImpact=v)}m["".concat(n,"_").concat(u+1)]=p}f&&l?d(m,l):l&&l(m),console.log("Keyword Event Data:",m)},t.setUserClickCount=function(e){e>=1&&e<=Number.MAX_SAFE_INTEGER?t.userDefinedClickCount=e:(console.error("Invalid Click Count. Please enter a number between 1 and ".concat(Number.MAX_SAFE_INTEGER,". Default value 1 will be set.")),t.userDefinedClickCount=1)},t.setUserKeywordCount=function(e){e>=1&&e<=Number.MAX_SAFE_INTEGER?t.userDefinedKeywordCount=e:(console.error("Invalid Keyword Count. Please enter a number between 1 and ".concat(Number.MAX_SAFE_INTEGER,". Default value 1 will be set.")),t.userDefinedKeywordCount=1)}}}[879](0,e),e})()));