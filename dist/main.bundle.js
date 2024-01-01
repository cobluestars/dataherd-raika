/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dataherd-raika"] = factory();
	else
		root["dataherd-raika"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/trackUserEvents.js":
/*!********************************!*\
  !*** ./src/trackUserEvents.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nvar __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {\n    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {\n        if (ar || !(i in from)) {\n            if (!ar) ar = Array.prototype.slice.call(from, 0, i);\n            ar[i] = from[i];\n        }\n    }\n    return to.concat(ar || Array.prototype.slice.call(from));\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.setTimestampRange = exports.setUserKeywordCount = exports.setUserClickCount = exports.trackKeywordEvent = exports.trackClickEvent = exports.createRandomData = exports.gaussianRandom = exports.getLocalCustomDataGroup = exports.setLocalCustomDataGroup = exports.setGlobalUserDefinedItems = exports.GlobalUserDefinedItems = exports.getRandomTimestamp = exports.endTime = exports.startTime = exports.userDefinedKeywordCount = exports.userDefinedClickCount = void 0;\n// ./src/trackUserEvents.ts\nexports.userDefinedClickCount = 1;\nexports.userDefinedKeywordCount = 1;\nexports.startTime = new Date(); // initialize start time\nexports.endTime = new Date(); // initialize end time\n//startTime - endTime 시간 범위 내에서 랜덤한 타임스탬프 생성\nfunction getRandomTimestamp(start, end) {\n    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));\n}\nexports.getRandomTimestamp = getRandomTimestamp;\n// 전역 커스텀 데이터들을 관리하기 위한 UserDefinedItem 배열\nexports.GlobalUserDefinedItems = [];\n// 다양한 로컬 커스텀 데이터 그룹들을 관리하기 위한 '객체' \nvar localCustomDataGroups = {};\n// 전역 커스텀 데이터 설정 함수\nfunction setGlobalUserDefinedItems(items) {\n    exports.GlobalUserDefinedItems = items;\n}\nexports.setGlobalUserDefinedItems = setGlobalUserDefinedItems;\n// 로컬 커스텀 데이터 그룹 설정 함수\nfunction setLocalCustomDataGroup(eventType, items) {\n    localCustomDataGroups[eventType] = items;\n}\nexports.setLocalCustomDataGroup = setLocalCustomDataGroup;\n//로컬 커스텀 데이터 그룹 반환 함수\nfunction getLocalCustomDataGroup(eventType) {\n    return localCustomDataGroups[eventType] || [];\n}\nexports.getLocalCustomDataGroup = getLocalCustomDataGroup;\n//정규 분포(가우스 분포) 랜덤 숫자 생성 함수\nfunction gaussianRandom(mean, standardDeviation) {\n    var u = 0, v = 0;\n    while (u === 0)\n        u = Math.random();\n    while (v === 0)\n        v = Math.random();\n    var num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);\n    num = num * standardDeviation + mean; //평균 및 표준편차 조정\n    return num;\n}\nexports.gaussianRandom = gaussianRandom;\n//랜덤 데이터 생성 함수\nfunction createRandomData(items) {\n    var randomData = {};\n    items.forEach(function (item) {\n        var _a, _b, _c, _d, _e, _f;\n        //배열 & 객체의 항목들에 대한 랜덤 처리 여부\n        var randomizeArrays = (_a = item.randomizeArrays) !== null && _a !== void 0 ? _a : false; // 기본값: false\n        var randomizeObjects = (_b = item.randomizeObjects) !== null && _b !== void 0 ? _b : false; // 기본값: false\n        //배열 & 객체의 항목들을 랜덤 선택 처리할 시, 선택 갯수 정의 \n        var arraySelectionCount = (_c = item.arraySelectionCount) !== null && _c !== void 0 ? _c : 1; // 기본값을 1로 설정\n        var objectSelectionCount = (_d = item.objectSelectionCount) !== null && _d !== void 0 ? _d : 1; // 기본값을 1로 설정\n        //'문자열 그룹', '배열', '객체' 항목의 랜덤 선택 시, 특정 항목(들)이 선택될 확률 임의 조정 여부 (디폴트: false)\n        var selectionProbability = (_e = item.selectionProbability) !== null && _e !== void 0 ? _e : false; // 기본값: false\n        //선택 갯수 내에서 무작위 선택 여부 (ex: 3개 선택 시 2개만 선택될 수 있음.)\n        var randomizeSelectionCount = (_f = item.randomizeSelectionCount) !== null && _f !== void 0 ? _f : false; // 기본값: false\n        switch (item.type) {\n            case 'number':\n                //숫자 처리\n                //단일 숫자일 경우, 이를 디폴트 값으로 설정\n                if (typeof item.options === 'number') {\n                    randomData[item.name] = item.options;\n                }\n                //숫자 범위가 [ n, m ] 배열 형태로 주어질 경우, 그 확률이 '무작위' 혹은 '정규 분포'를 따르도록 설정\n                else if (Array.isArray(item.options) && item.options.length === 2) {\n                    var _g = item.options, min = _g[0], max = _g[1];\n                    // 확률분포 디폴트 설정: 'uniform' (완전 랜덤)\n                    var distribution = item.distribution != null ? item.distribution : 'uniform';\n                    // 평균값의 디폴트 설정: 중간값\n                    var mean = item.mean != null ? item.mean : (min + max) / 2;\n                    // 표준편차의 디폴트 설정: 6시그마\n                    var standardDeviation = item.standardDeviation != null ? item.standardDeviation : (max - min) / 6;\n                    if (distribution === 'uniform') { //완전 랜덤\n                        randomData[item.name] = Math.floor(Math.random() * (max - min + 1)) + min;\n                    }\n                    else if (distribution === 'normal') { //정규 분포(가우스 분포)\n                        var normalValue = gaussianRandom(mean, standardDeviation);\n                        //결과값을 범위 내로 조정\n                        normalValue = Math.max(min, Math.min(max, normalValue));\n                        randomData[item.name] = Math.floor(normalValue);\n                    }\n                }\n                else {\n                    console.error(\"Invalid format for 'number' type in UserDefinedItem: \".concat(item.name));\n                }\n                break;\n            case 'string':\n                //문자열 처리\n                if (typeof item.options === 'string') {\n                    // 단일 문자열인 경우, 이를 디폴트 값으로 설정\n                    randomData[item.name] = item.options;\n                }\n                else if (Array.isArray(item.options)) {\n                    //문자열 배열인 경우\n                    if (item.options.every(function (option) { return typeof option === 'string'; })) {\n                        //랜덤하게 선택 \n                        if (selectionProbability === true) {\n                            //확률 기반 선택 적용\n                            var probabilities = settingProbabilities(item.options, item.probabilitySetting || []);\n                            var selectedOptions = applyProbabilityBasedSelection(item.options, probabilities);\n                            randomData[item.name] = selectedOptions.length > 0 ? selectedOptions[0] : null;\n                        }\n                        else {\n                            //무작위 선택\n                            randomData[item.name] = item.options[Math.floor(Math.random() * item.options.length)];\n                        }\n                    }\n                    else {\n                        // 배열이지만 문자열만 포함하지 않는 경우\n                        console.error(\"Invalid format for 'string' type in UserDefinedItem: \".concat(item.name, \", options must be an array of strings\"));\n                    }\n                }\n                else {\n                    console.error(\"Invalid format for 'string' type in UserDefinedItem: \".concat(item.name));\n                }\n                break;\n            case 'boolean':\n                //boolean 처리\n                randomData[item.name] = Math.random() < 0.5;\n                break;\n            case 'array':\n                // 배열 처리\n                if (Array.isArray(item.options) && item.options.length > 0) {\n                    if (randomizeArrays) {\n                        // 랜덤 요소 선택\n                        if (selectionProbability) {\n                            //확률 기반 선택 적용\n                            var probabilities = settingProbabilities(item.options, item.probabilitySetting || []);\n                            var selectedOptions_1 = applyProbabilityBasedSelection(item.options, probabilities);\n                            var selectedCount = arraySelectionCount;\n                            // 선택 갯수 내에서, 확률 옵션을 적용한 요소가 세팅한 확률로 무조건 선택됨.\n                            if (randomizeSelectionCount) {\n                                selectedCount = Math.floor(Math.random() * selectedCount) + 1;\n                            }\n                            // 남은 선택 갯수 계산\n                            var remainingSelectionCount = arraySelectionCount - selectedOptions_1.length;\n                            if (randomizeSelectionCount) {\n                                remainingSelectionCount = Math.floor(Math.random() * remainingSelectionCount) + 1;\n                            }\n                            // 남은 요소들을 무작위로 섞어 선택\n                            var remainingOptions = item.options.filter(function (option) { return !selectedOptions_1.includes(option); });\n                            var shuffledRemaining = __spreadArray([], remainingOptions, true).sort(function () { return 0.5 - Math.random(); });\n                            selectedOptions_1 = selectedOptions_1.concat(shuffledRemaining.slice(0, remainingSelectionCount));\n                            // 최종 선택된 요소들에 대한 처리\n                            randomData[item.name] = selectedOptions_1.map(function (subItem) {\n                                // 배열의 각 요소가 또 다른 배열이나 객체일 경우, 재귀적으로 처리\n                                if (Array.isArray(subItem)) {\n                                    // subItem이 배열인 경우, 배열 내의 각 항목을 UserDefinedItem으로 간주하고 재귀적으로 처리\n                                    return createRandomData(subItem);\n                                }\n                                else if (typeof subItem === 'object' && subItem !== null) {\n                                    // subItem이 객체인 경우, UserDefinedItem 타입의 속성을 가지고 있는지 확인\n                                    if ('name' in subItem && 'type' in subItem) {\n                                        // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 처리\n                                        return createRandomData([subItem]);\n                                    }\n                                    else {\n                                        // subItem이 UserDefinedItem 타입이 아닌 경우, 오류 처리\n                                        console.error(\"Invalid sub-item format in UserDefinedItem: \".concat(JSON.stringify(subItem)));\n                                        return null;\n                                    }\n                                }\n                                return subItem;\n                            });\n                        }\n                        else {\n                            //완전 랜덤 선택 적용\n                            var selectedCount = arraySelectionCount;\n                            // 선택 갯수 내에서 갯수 무작위 선택\n                            if (randomizeSelectionCount) {\n                                selectedCount = Math.floor(Math.random() * selectedCount) + 1;\n                            }\n                            var shuffled = __spreadArray([], item.options, true).sort(function () { return 0.5 - Math.random(); }); //배열을 무작위로 섞음\n                            randomData[item.name] = shuffled.slice(0, selectedCount).map(function (subItem) {\n                                // 배열의 각 요소가 또 다른 배열이나 객체일 경우, 재귀적으로 처리\n                                if (Array.isArray(subItem) || (typeof subItem === 'object' && subItem !== null)) {\n                                    return createRandomData([subItem]);\n                                }\n                                return subItem;\n                            });\n                        }\n                    }\n                    else {\n                        // 전체 요소 포함\n                        randomData[item.name] = item.options.map(function (subItem) {\n                            // 배열의 각 요소가 또 다른 배열이나 객체인 경우, 재귀적으로 처리\n                            if (Array.isArray(subItem) || (typeof subItem === 'object' && subItem !== null)) {\n                                return createRandomData([subItem]);\n                            }\n                            return subItem;\n                        });\n                    }\n                }\n                else {\n                    console.error(\"Invalid format for 'array' type in UserDefinedItem: \".concat(item.name));\n                }\n                break;\n            case 'object':\n                // 객체 처리\n                // 타입 단언 사용, item.options가 Record<string, any>(객체 속성 string, 프로퍼티 any)인지 확인\n                if (typeof item.options === 'object' && item.options !== null && !Array.isArray(item.options)) {\n                    var options_1 = item.options;\n                    if (randomizeObjects) {\n                        // 랜덤 속성 선택\n                        var selectedOptionKeys_1;\n                        // 랜덤하게 선택할 키의 수를 결정\n                        var selectedCount = objectSelectionCount;\n                        if (selectionProbability) {\n                            //확률 기반 선택 적용\n                            // 선택 갯수 내에서 갯수 무작위 선택\n                            if (randomizeSelectionCount) {\n                                selectedCount = Math.floor(Math.random() * selectedCount) + 1;\n                            }\n                            // 확률 기반 선택\n                            var keys = Object.keys(options_1);\n                            var probabilities = settingProbabilities(keys, item.probabilitySetting || []);\n                            selectedOptionKeys_1 = applyProbabilityBasedSelection(keys, probabilities);\n                            // 확률 기반 선택 이후의 남은 선택 갯수 계산\n                            var remainingSelectionCount = objectSelectionCount - selectedOptionKeys_1.length;\n                            if (randomizeSelectionCount) {\n                                remainingSelectionCount = Math.min(remainingSelectionCount, keys.length - selectedOptionKeys_1.length);\n                                remainingSelectionCount = Math.floor(Math.random() * remainingSelectionCount) + 1;\n                            }\n                            // 남은 키들을 무작위로 섞어 선택\n                            var remainingKeys = keys.filter(function (key) { return !selectedOptionKeys_1.includes(key); });\n                            var shuffledRemaining = __spreadArray([], remainingKeys, true).sort(function () { return 0.5 - Math.random(); });\n                            shuffledRemaining.slice(0, remainingSelectionCount).forEach(function (key) {\n                                selectedOptions_2[key] = options_1[key];\n                            });\n                            // 최종 선택된 키에 해당하는 속성만 포함하는 새 객체 생성\n                            var selectedOptions_2 = selectedOptionKeys_1.slice(0, selectedCount).reduce(function (acc, key) {\n                                acc[key] = options_1[key];\n                                return acc;\n                            }, {}); //selectedOptions에도 타입 단언을 추가 사용                        \n                            // 최종 선택된 속성들에 대해 처리\n                            Object.keys(selectedOptions_2).forEach(function (key) {\n                                var subItem = selectedOptions_2[key];\n                                if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {\n                                    // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출\n                                    randomData[item.name] = randomData[item.name] || {};\n                                    randomData[item.name][key] = createRandomData([subItem]);\n                                }\n                                else {\n                                    randomData[item.name] = randomData[item.name] || {};\n                                    randomData[item.name][key] = subItem;\n                                }\n                            });\n                        }\n                        else {\n                            //완전 랜덤 선택 적용\n                            // 선택 갯수 내에서 갯수 무작위 선택\n                            if (randomizeSelectionCount) {\n                                selectedCount = Math.floor(Math.random() * selectedCount) + 1;\n                            }\n                            // 객체의 키를 배열로 변환하고, 무작위로 섞음\n                            var keys = Object.keys(options_1);\n                            var shuffledKeys = keys.sort(function () { return 0.5 - Math.random(); });\n                            // 선택된 키에 해당하는 속성만 포함하는 새 객체 생성\n                            var selectedOptions_3 = shuffledKeys.slice(0, selectedCount).reduce(function (acc, key) {\n                                acc[key] = options_1[key];\n                                return acc;\n                            }, {}); //selectedOptions에도 타입 단언을 추가 사용                        \n                            // 선택된 속성들에 대해 처리\n                            Object.keys(selectedOptions_3).forEach(function (key) {\n                                var subItem = selectedOptions_3[key];\n                                if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {\n                                    // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출\n                                    randomData[item.name] = randomData[item.name] || {};\n                                    randomData[item.name][key] = createRandomData([subItem]);\n                                }\n                                else {\n                                    randomData[item.name] = randomData[item.name] || {};\n                                    randomData[item.name][key] = subItem;\n                                }\n                            });\n                        }\n                    }\n                    else {\n                        // 전체 속성 포함\n                        Object.keys(options_1).forEach(function (key) {\n                            var subItem = options_1[key];\n                            if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {\n                                // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출\n                                randomData[item.name] = randomData[item.name] || {};\n                                randomData[item.name][key] = createRandomData([subItem]);\n                            }\n                            else {\n                                // 기본값으로 설정\n                                randomData[item.name] = randomData[item.name] || {};\n                                randomData[item.name][key] = subItem;\n                            }\n                        });\n                    }\n                }\n                else {\n                    console.error(\"Invalid format for 'object' type in UserDefinedItem: \".concat(item.name));\n                }\n                break;\n        }\n    });\n    return randomData;\n}\nexports.createRandomData = createRandomData;\n/** 확률 세팅 함수: 배열, 객체의 요소마다 설정한 확률을 세팅함. */\nfunction settingProbabilities(options, settings) {\n    var probabilities = new Array(options.length).fill(0);\n    settings.forEach(function (setting) {\n        var index = typeof setting.identifier === 'number' ? setting.identifier : options.indexOf(setting.identifier);\n        probabilities[index] = setting.probability;\n    });\n    return probabilities;\n}\n/** 세팅된 확률로 항목(들)을 선택하게 하는 함수 */\nfunction applyProbabilityBasedSelection(options, probabilities) {\n    var selectedOptions = [];\n    options.forEach(function (option, index) {\n        if (Math.random() * 100 < probabilities[index]) {\n            selectedOptions.push(option);\n        }\n    });\n    return selectedOptions;\n}\n//사용자 클릭 이벤트 리스너 추적 함수 Click Event Listener\nfunction trackClickEvent(event, eventType, includeLocalCustomData, includeGlobalCustomData, callback) {\n    if (includeLocalCustomData === void 0) { includeLocalCustomData = false; }\n    if (includeGlobalCustomData === void 0) { includeGlobalCustomData = false; }\n    // eventData객체를 저장하기 위한 객체\n    var allEventData = {};\n    for (var i = 0; i < exports.userDefinedClickCount; i++) { //설정한 클릭 횟수만큼 이벤트 데이터 객체 생성\n        var localCustomDataList = getLocalCustomDataGroup(eventType);\n        var eventData = {\n            eventType: event.type,\n            timestamp: getRandomTimestamp(exports.startTime, exports.endTime),\n            clickCount: i + 1, //각 이벤트에 대한 고유한 클릭 카운트 부여\n        };\n        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)\n        if (includeLocalCustomData && localCustomDataList.length > 0) {\n            var localCustomData = createRandomData(localCustomDataList);\n            Object.assign(eventData, localCustomData);\n        }\n        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)\n        if (includeGlobalCustomData) {\n            //customData 생성\n            var globalCustomData = createRandomData(exports.GlobalUserDefinedItems);\n            Object.assign(eventData, globalCustomData);\n        }\n        var eventId = \"\".concat(event.type, \"_\").concat(i + 1); // 고유 식별자 생성\n        allEventData[eventId] = eventData; // 객체에 생성된 eventData 저장\n    }\n    // 콜백 함수 호출\n    if (callback) {\n        callback(allEventData);\n    }\n    console.log('Click Event Data:', allEventData);\n}\nexports.trackClickEvent = trackClickEvent;\n//사용자 입력 키워드 이벤트 추적 함수 Keyword Event\nfunction trackKeywordEvent(keyword, eventType, includeLocalCustomData, includeGlobalCustomData, repeatCount, callback) {\n    if (includeLocalCustomData === void 0) { includeLocalCustomData = false; }\n    if (includeGlobalCustomData === void 0) { includeGlobalCustomData = false; }\n    if (repeatCount === void 0) { repeatCount = 1; }\n    // eventData객체를 저장하기 위한 객체\n    var allEventData = {};\n    for (var i = 0; i < exports.userDefinedKeywordCount; i++) { //설정한 키워드 입력 횟수만큼 이벤트 데이터 객체 생성\n        var localCustomDataList = getLocalCustomDataGroup(eventType);\n        var eventData = {\n            keyword: keyword,\n            eventType: eventType,\n            timestamp: getRandomTimestamp(exports.startTime, exports.endTime),\n            keywordCount: i + 1, //각 이벤트에 대한 고유한 키워드 카운트 부여\n            repeatCount: repeatCount,\n        };\n        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)\n        if (includeLocalCustomData && localCustomDataList.length > 0) {\n            var localCustomData = createRandomData(localCustomDataList);\n            Object.assign(eventData, localCustomData);\n        }\n        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)\n        if (includeGlobalCustomData) {\n            //customData 생성\n            var globalCustomData = createRandomData(exports.GlobalUserDefinedItems);\n            Object.assign(eventData, globalCustomData);\n        }\n        var eventId = \"\".concat(eventType, \"_\").concat(i + 1); // 고유 식별자 생성\n        allEventData[eventId] = eventData; // 객체에 eventData 저장\n    }\n    // 콜백 함수 호출\n    if (callback) {\n        callback(allEventData);\n    }\n    console.log('Keyword Event Data:', allEventData);\n}\nexports.trackKeywordEvent = trackKeywordEvent;\n/**클릭 횟수를 사용자가 직접 조정할 수 있는 함수:\n * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)\n * setUserClickCount(100): 클릭 횟수 100회로 설정*/\nfunction setUserClickCount(ClickEventCount) {\n    if (ClickEventCount >= 1 && ClickEventCount <= Number.MAX_SAFE_INTEGER) {\n        exports.userDefinedClickCount = ClickEventCount;\n    }\n    else {\n        console.error(\"Invalid Click Count. Please enter a number between 1 and \".concat(Number.MAX_SAFE_INTEGER, \". Default value 1 will be set.\"));\n        exports.userDefinedClickCount = 1; // Set a default value 1\n    }\n}\nexports.setUserClickCount = setUserClickCount;\n/**특정 키워드 생성 & 검색 횟수를 사용자가 직접 조정할 수 있는 함수:\n * * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)\n * setUserKeywordCount(100): 키워드 생성 & 검색 횟수 100회로 설정*/\nfunction setUserKeywordCount(KeywordEventCount) {\n    if (KeywordEventCount >= 1 && KeywordEventCount <= Number.MAX_SAFE_INTEGER) {\n        exports.userDefinedKeywordCount = KeywordEventCount;\n    }\n    else {\n        console.error(\"Invalid Keyword Count. Please enter a number between 1 and \".concat(Number.MAX_SAFE_INTEGER, \". Default value 1 will be set.\"));\n        exports.userDefinedKeywordCount = 1; // Set a default value 1\n    }\n}\nexports.setUserKeywordCount = setUserKeywordCount;\n/**시작 및 종료 시간 설정 함수:\n * 얘사: 2024-01-01 자정 ~ 오전 8시 사이의 랜덤한 타임스탬프를 생성하고 싶다면,\n * setTimestampRange(new Date('2024-01-01T00:00:00'), newDate('2024-01-01T08:00:00'));*/\nfunction setTimestampRange(start, end) {\n    // start가 end보다 미래일 경우 에러 출력\n    if (start.getTime() > end.getTime()) {\n        console.error(\"Error: start date cannot be later than end date.\");\n        return;\n    }\n    exports.startTime = start;\n    exports.endTime = end;\n}\nexports.setTimestampRange = setTimestampRange;\n/**\n *\n### 사용법 및 예상 결과\n\n#### 1. 시작 및 종료 시간 설정\n\n```javascript\nsetTimestampRange(new Date('2024-01-01T00:00:00'), new Date('2024-01-01T08:00:00'));\n```\n\n이 함수는 이벤트 타임스탬프를 생성할 때 사용되는 시간 범위를 설정합니다.\n2024-01-01 자정 ~ 오전 8시 사이의 랜덤한 타임스탬프를 생성하고 싶다면, 위 코드처럼 설정하면 됩니다.\n\n\n#### 2. 특정 키워드 생성 & 검색 횟수 조정\n\n```javascript\nsetUserClickCount(3);\nsetUserKeywordCount(3);\n```\n\n이 함수들은 사용자가 클릭하거나 키워드를 생성/검색할 때마다 적용되는 카운트, 만들어지는 데이터 수를 설정합니다.\n\n\n#### 3. 전역 커스텀 데이터 설정\n\n```javascript\nsetGlobalUserDefinedItems([\n    // 전역 커스텀 데이터 항목들\n    { name: 'age', type: 'number', options: [10, 50], distribution: 'uniform'},\n    { name: 'job', type: 'string', options: ['student', 'web developer', 'accountant'] },\n    { name: 'salary', type: 'number', options: [25000, 100000], distribution: 'normal', mean: 36000, standardDeviation: (100000 - 25000) / 6 },\n    { name: 'drinks', type: 'array', options: ['Americano', 'Latte', 'Cappuccino', 'Green Tea Latte'], randomizeArrays: true },\n    { name: 'hobbies', type: 'object', options: { hobby1: 'reading', hobby2: 'gaming', hobby3: 'coding', hobby4: 'hiking' }, randomizeObjects: true }\n]);\n```\n\n```javascript\nconst GlobalUserDefinedItems: UserDefinedItem[] = [\n    {\n        name: 'job',\n        type: 'array',\n        options:[\n                    {\n                        name: 'student',\n                        type: 'array',\n                        options: [\n                            {\n                                name: 'age',\n                                type: 'number',\n                                options: [10, 30]\n                            },\n                            {\n                                name: 'salary',\n                                type: 'number',\n                                options: [8000, 20000]\n                            }\n                        ]\n                    },\n                    {\n                        name: 'developer',\n                        type: 'array',\n                        options: [\n                            {\n                                name: 'age',\n                                type: 'number',\n                                options: [20, 60]\n                            },\n                            {\n                                name: 'salary',\n                                type: 'number',\n                                distribution: 'normal',\n                                mean: 50000,\n                                options: [40000, 100000]\n                            }\n                        ]\n                    },\n                    {\n                        name: 'accountant',\n                        type: 'array',\n                        options: [\n                            {\n                                name: 'age',\n                                type: 'number',\n                                options: [20, 60]\n                            },\n                            {\n                                name: 'salary',\n                                type: 'number',\n                                distribution: 'normal',\n                                mean: 50000,\n                                options: [40000, 100000]\n                            }\n                        ]\n                    }\n                ],\n        randomizeArrays: true\n        selectionProbability: true,\n        probabilitySettings: [\n                { identifier: 1, probability: 45 }, //(45% 확률로 developer 선택)\n                { identifier: 2, probability: 45 }, //(45% 확률로 accountant 선택)\n        ]\n    },\n    {\n        name: 'favorite drinks',\n        type: 'array',\n        options: ['Americano', 'Latte', 'Cappuccino', 'Green Tea Latte'],\n        randomizeArrays: true\n    },\n    {\n        name: 'hobbies',\n        type: 'object',\n        options: { hobby1: 'reading', hobby2: 'gaming', hobby3: 'coding', hobby4: 'hiking' },\n        randomizeObjects: true,\n        objectSelectionCount: 3,\n        randomizeSelectionCount: true\n    }\n];\n```\n\n#### 예상 결과:\n\n전역 커스텀 데이터가 이벤트 데이터에 포함됩니다.\n예를 들어, 사용자의 나이, 직업, 연봉, 선호 음료, 취미 등이 데이터에 포함될 수 있습니다.\n\n```json\n{\n    \"eventType\": \"click\",\n    \"timestamp\": \"2024-01-01T19:40:47.615Z\",\n    \"clickCount\": 3,\n    \"job\": [\n        {\n            \"developer\": [\n                {\n                    \"age\": 30\n                },\n                {\n                    \"salary\": 55220\n                }\n            ]\n        }\n    ],\n    \"favorite drinks\": [\n        \"Americano\"\n    ],\n    \"hobbies\": {\n        \"hobby1\": \"reading\",\n        \"hobby3\": \"coding\"\n    }\n}\n```\n\n\n#### 4. 로컬 커스텀 데이터 그룹 설정\n\n```javascript\nsetLocalCustomDataGroup('clickEventCategoryA', [\n    { name: 'categoryA-specific', type: 'string', options: ['Option1', 'Option2'] }\n]);\nsetLocalCustomDataGroup('clickEventCategoryB', [\n    { name: 'categoryB-specific', type: 'number', options: [1, 10] }\n]);\n```\n\n\n#### 5. 클릭 이벤트 리스너 설정/ 클릭 이벤트 추적 함수 사용\n\n```javascript\ndocument.getElementById('elementA').addEventListener('click', (event) => {\n    trackClickEvent(event, 'clickEventCategoryA', true, false);\n});\ndocument.getElementById('elementB').addEventListener('click', (event) => {\n    trackClickEvent(event, 'clickEventCategoryB', false, true);\n});\n```\n\n#### 예상 결과:\n\nelementA 클릭 시\n\n로컬 커스텀 데이터(clickEventCategoryA 그룹에 정의된 데이터)가 클릭 이벤트 데이터에 포함되어 전송됩니다.\n이 데이터는 trackClickEvent 함수의 세 번째 매개변수로 true를 지정하여 로컬 커스텀 데이터를 포함하도록 설정합니다.\n\n```json\n{\n    \"eventType\": \"click\",\n    \"elementId\": \"elementA\",\n    \"timestamp\": \"2024-01-01T02:30:00.000Z\",\n    \"clickCount\": 1,\n    \"localCustomData\": {\n        \"categoryA-specific\": \"Option1\"\n    }\n}\n```\n\nelementB 클릭 시\n\n전역 커스텀 데이터(GlobalUserDefinedItems에 정의된 데이터)가 클릭 이벤트 데이터에 포함되어 전송됩니다.\n이 데이터는 trackClickEvent 함수의 네 번째 매개변수로 true를 지정하여 전역 커스텀 데이터를 포함하도록 설정합니다.\n\n```json\n{\n    \"eventType\": \"click\",\n    \"elementId\": \"elementB\",\n    \"timestamp\": \"2024-01-01T03:45:00.000Z\",\n    \"clickCount\": 1,\n    \"globalCustomData\": {\n        \"age\": 30,\n        \"job\": \"accountant\",\n        \"salary\": 55000,\n        \"drinks\": [\"Cappuccino\"],\n        \"hobbies\": {\"hobby1\": \"coding\", \"hobby2\": \"hiking\"}\n    }\n}\n```\n\n\n#### 6. 키워드 이벤트 추적 함수 사용\n\n키워드 이벤트 추적 함수\n\n```javascript\nfunction simulateKeywordEvent() {\n    const keyword = \"exampleKeyword\";\n    trackKeywordEvent(keyword, 'search', true, 1, true);\n}\n\nsimulateKeywordEvent(); // 함수 호출로 키워드 이벤트 시뮬레이션\n```\n\n#### 예상 결과:\n\n키워드 이벤트가 추적되며, 해당 이벤트에 관련된 데이터가 포함됩니다.\n\n```json\n{\n    \"keyword\": \"exampleKeyword\",\n    \"eventType\": \"search\",\n    \"timestamp\": \"2024-01-01T04:00:00.000Z\",\n    \"keywordCount\": 1,\n    \"repeatCount\": 1,\n    \"age\": 32,\n    \"job\": \"developer\",\n    \"salary\": 30000,\n    \"drinks\": [\"Green Tea Latte\"],\n    \"hobbies\": {\"hobby1\": \"gaming\"}\n}\n```\n\n\n#### 7. 서버 데이터 저장\n\n이벤트 추적 함수(trackClickEvent 또는 trackKeywordEvent)에 콜백 함수를 전달하여, 이벤트 데이터를 서버로 전송할 수 있습니다.\n이 콜백 함수는 이벤트 데이터를 받아 서버 API 엔드포인트로 전송하는 로직을 포함합니다.\n\n```javascript\n// 예시: 클릭 이벤트 데이터를 서버로 전송하는 콜백 함수\nconst sendEventToServer = async (eventData) => {\n    try {\n        const response = await fetch('/api/save-event-data', {\n            method: 'POST',\n            body: JSON.stringify(eventData),\n            headers: {'Content-Type': 'application/json'}\n        });\n        if (!response.ok) throw new Error('Network response was not ok');\n    } catch (error) {\n        console.error('Error sending event data:', error);\n    }\n};\n\n// 클릭 이벤트 추적 함수 호출 시 콜백 함수 전달\ntrackClickEvent(event, 'eventType', true, true, sendEventToServer);\n```\n\n예상 결과\n위의 콜백 함수를 사용하여 이벤트 추적 시, 다음과 같은 흐름으로 데이터가 처리됩니다:\n\n1. 사용자의 클릭 또는 키워드 입력 이벤트가 발생합니다.\n2. trackClickEvent 또는 trackKeywordEvent 함수가 호출되며, 이벤트 데이터가 생성됩니다.\n3. 생성된 이벤트 데이터는 콜백 함수 sendEventToServer로 전달됩니다.\n4. sendEventToServer 함수는 이벤트 데이터를 JSON 형식으로 변환하여 서버의 API 엔드포인트(/api/save-event-data)로 POST 요청을 보냅니다.\n5. 서버는 요청을 받아 처리하고, 데이터를 db.json 파일이나 다른 데이터 스토리지에 저장합니다.\n\n이러한 프로세스는 사용자의 상호작용을 실시간으로 추적하고, 데이터를 중앙 서버에 저장하여 분석하는 데 사용될 수 있습니다.\n예를 들어, 웹사이트 사용성 개선, 사용자 경험 분석, 사용자 행동에 대한 인사이트 획득 등에 활용할 수 있습니다.\n\n데이터는 JSON 형식으로 저장되므로, 데이터 분석 도구나 대시보드에 쉽게 통합하여 시각화하고 분석할 수 있습니다.\n예를 들어, Google Analytics, Google BigQuery, AWS QuickSight 등 다양한 플랫폼과의 통합이 가능합니다.\n\n\n#### 종합\n\n이러한 방식으로 사용자 이벤트 데이터를 추적하고 관련 데이터를 수집 및 분석할 수 있습니다.\n해당 라이브러리는 웹사이트나 애플리케이션의 사용성 개선, 사용자 경험 최적화 등에 활용될 수 있습니다.\n */ \n\n\n//# sourceURL=webpack://dataherd-raika/./src/trackUserEvents.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/trackUserEvents.js"](0, __webpack_exports__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});