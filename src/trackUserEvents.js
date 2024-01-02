"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserKeywordCount = exports.setUserClickCount = exports.trackKeywordEvent = exports.trackClickEvent = exports.createRandomData = exports.gaussianRandom = exports.getLocalCustomDataGroup = exports.setLocalCustomDataGroup = exports.setGlobalUserDefinedItems = exports.GlobalUserDefinedItems = exports.getRandomTimestamp = exports.initializeTimestampSettings = exports.endTime = exports.startTime = exports.userDefinedKeywordCount = exports.userDefinedClickCount = void 0;
// ./src/trackUserEvents.ts
exports.userDefinedClickCount = 1;
exports.userDefinedKeywordCount = 1;
exports.startTime = new Date(); // initialize start time
exports.endTime = new Date(); // initialize end time
//전역 변수로 사용될 시간 설정 객체 TimestampSettings
var TimestampSettings;
//시간 설정 초기화 함수
function initializeTimestampSettings(settings) {
    //시작/종료 시간값이 제공되지 않았거나 유효하지 않을 시, 현재 시간 사용
    var now = new Date().toISOString();
    TimestampSettings = {
        startTime: settings.startTime || now,
        endTime: settings.endTime || now,
        peakTimes: settings.peakTimes
    };
}
exports.initializeTimestampSettings = initializeTimestampSettings;
//startTime - endTime 시간 범위 내에서 랜덤한 타임스탬프 생성
// 이 함수는 옵션으로 '피크 타임'을 지정할 수 있으며, 피크 타임 동안 타임스탬프가 생성될 확률이 높아짐.
function getRandomTimestamp() {
    //TimestampSettings 직접 사용
    var startTime = TimestampSettings.startTime, endTime = TimestampSettings.endTime, peakTimes = TimestampSettings.peakTimes;
    // 문자열로 된 날짜를 Date 객체로 파싱하는 함수
    var parseDateTime = function (dateTimeStr) {
        //UTC 기준으로 Date 객체 생성
        return new Date(Date.parse(dateTimeStr + 'Z'));
    };
    var startDt = parseDateTime(startTime);
    var endDt = parseDateTime(endTime);
    // 시작 시간이 종료 시간보다 미래인 경우, 현재 시간을 사용함.
    var now = new Date();
    if (startDt.getTime() > endDt.getTime()) {
        startDt = now;
        endDt = new Date(now.getTime() + 1000);
    }
    // 피크 타임의 유효성 검사하는 함수
    // 피크 타임은 시작 시간과 종료 시간 사이에 있어야 하며, 올바른 형식이어야 함.
    /** ex)
     *  start: '2023.01.02T00:00:00',
     *  end: '2023.01.02T08:00:00',
     *  picktime: [['2023.01.02T04:00:00', '2023.01.02T06:00:00'], ['2023.01.02T07:00:00', '2023.01.02T08:00:00']) */
    var validatePeakTimes = function (peakTimes, start, end) {
        if (!peakTimes)
            return true;
        if (!Array.isArray(peakTimes) || !peakTimes.every(function (pt) { return Array.isArray(pt) && pt.length === 2; }))
            return false;
        return peakTimes.every(function (_a) {
            var startPt = _a[0], endPt = _a[1];
            var peakStart = parseDateTime(startPt);
            var peakEnd = parseDateTime(endPt);
            return peakStart >= start && peakEnd <= end;
        });
    };
    var validPeakTimes = peakTimes;
    // 피크 타임이 유효하지 않은 시 콘솔 에러 출력, 피크 타임 없이 함수를 실행
    if (validPeakTimes && !validatePeakTimes(validPeakTimes, startDt, endDt)) {
        console.error("Invalid peak times format or out of range. Defaulting to random timestamp between start and end.");
        validPeakTimes = undefined;
    }
    // 주어진 두 시간 사이에서 랜덤한 타임스탬프 생성
    var getRandomDate = function (start, end) {
        var randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(randomTime);
    };
    // 피크 타임이 없으면, 두 시간 사이에서 랜덤한 타임스탬프를 반환
    if (!peakTimes) {
        return getRandomDate(startDt, endDt);
    }
    // 피크 타임과 비피크 타임에 대한 간격과 가중치를 계산
    var intervals = peakTimes.map(function (pt) { return [parseDateTime(pt[0]), parseDateTime(pt[1])]; });
    var totalDuration = endDt.getTime() - startDt.getTime();
    var peakWeights = intervals.map(function (_a) {
        var start = _a[0], end = _a[1];
        return ((end.getTime() - start.getTime()) / totalDuration) * 10;
    });
    var nonPeakWeight = Math.max(1, 10 - peakWeights.reduce(function (a, b) { return a + b; }, 0));
    intervals.push([startDt, endDt]);
    peakWeights.push(nonPeakWeight);
    // 가중치를 고려하여 랜덤하게 간격을 선택하고, 해당 간격 내에서 타임스탬프를 생성
    var chosenInterval = intervals[Math.floor(Math.random() * intervals.length)];
    return getRandomDate(chosenInterval[0], chosenInterval[1]);
}
exports.getRandomTimestamp = getRandomTimestamp;
// 전역 커스텀 데이터들을 관리하기 위한 UserDefinedItem 배열
exports.GlobalUserDefinedItems = [];
// 다양한 로컬 커스텀 데이터 그룹들을 관리하기 위한 '객체' 
var localCustomDataGroups = {};
// 전역 커스텀 데이터 설정 함수
function setGlobalUserDefinedItems(items) {
    exports.GlobalUserDefinedItems = items;
}
exports.setGlobalUserDefinedItems = setGlobalUserDefinedItems;
// 로컬 커스텀 데이터 그룹 설정 함수
function setLocalCustomDataGroup(eventType, items) {
    localCustomDataGroups[eventType] = items;
}
exports.setLocalCustomDataGroup = setLocalCustomDataGroup;
//로컬 커스텀 데이터 그룹 반환 함수
function getLocalCustomDataGroup(eventType) {
    return localCustomDataGroups[eventType] || [];
}
exports.getLocalCustomDataGroup = getLocalCustomDataGroup;
//정규 분포(가우스 분포) 랜덤 숫자 생성 함수
function gaussianRandom(mean, standardDeviation) {
    var u = 0, v = 0;
    while (u === 0)
        u = Math.random();
    while (v === 0)
        v = Math.random();
    var num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num * standardDeviation + mean; //평균 및 표준편차 조정
    return num;
}
exports.gaussianRandom = gaussianRandom;
//랜덤 데이터 생성 함수
function createRandomData(items) {
    var randomData = {};
    items.forEach(function (item) {
        var _a, _b, _c, _d, _e, _f;
        //배열 & 객체의 항목들에 대한 랜덤 처리 여부
        var randomizeArrays = (_a = item.randomizeArrays) !== null && _a !== void 0 ? _a : false; // 기본값: false
        var randomizeObjects = (_b = item.randomizeObjects) !== null && _b !== void 0 ? _b : false; // 기본값: false
        //배열 & 객체의 항목들을 랜덤 선택 처리할 시, 선택 갯수 정의 
        var arraySelectionCount = (_c = item.arraySelectionCount) !== null && _c !== void 0 ? _c : 1; // 기본값을 1로 설정
        var objectSelectionCount = (_d = item.objectSelectionCount) !== null && _d !== void 0 ? _d : 1; // 기본값을 1로 설정
        //'문자열 그룹', '배열', '객체' 항목의 랜덤 선택 시, 특정 항목(들)이 선택될 확률 임의 조정 여부 (디폴트: false)
        var selectionProbability = (_e = item.selectionProbability) !== null && _e !== void 0 ? _e : false; // 기본값: false
        //선택 갯수 내에서 무작위 선택 여부 (ex: 3개 선택 시 2개만 선택될 수 있음.)
        var randomizeSelectionCount = (_f = item.randomizeSelectionCount) !== null && _f !== void 0 ? _f : false; // 기본값: false
        switch (item.type) {
            case 'number':
                //숫자 처리
                //단일 숫자일 경우, 이를 디폴트 값으로 설정
                if (typeof item.options === 'number') {
                    randomData[item.name] = item.options;
                }
                //숫자 범위가 [ n, m ] 배열 형태로 주어질 경우, 그 확률이 '무작위' 혹은 '정규 분포'를 따르도록 설정
                else if (Array.isArray(item.options) && item.options.length === 2) {
                    var _g = item.options, min = _g[0], max = _g[1];
                    // 확률분포 디폴트 설정: 'uniform' (완전 랜덤)
                    var distribution = item.distribution != null ? item.distribution : 'uniform';
                    // 평균값의 디폴트 설정: 중간값
                    var mean = item.mean != null ? item.mean : (min + max) / 2;
                    // 표준편차의 디폴트 설정: 6시그마
                    var standardDeviation = item.standardDeviation != null ? item.standardDeviation : (max - min) / 6;
                    if (distribution === 'uniform') { //완전 랜덤
                        randomData[item.name] = Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                    else if (distribution === 'normal') { //정규 분포(가우스 분포)
                        var normalValue = gaussianRandom(mean, standardDeviation);
                        //결과값을 범위 내로 조정
                        normalValue = Math.max(min, Math.min(max, normalValue));
                        randomData[item.name] = Math.floor(normalValue);
                    }
                }
                else {
                    console.error("Invalid format for 'number' type in UserDefinedItem: ".concat(item.name));
                }
                break;
            case 'string':
                //문자열 처리
                if (typeof item.options === 'string') {
                    // 단일 문자열인 경우, 이를 디폴트 값으로 설정
                    randomData[item.name] = item.options;
                }
                else if (Array.isArray(item.options)) {
                    //문자열 배열인 경우
                    if (item.options.every(function (option) { return typeof option === 'string'; })) {
                        //랜덤하게 선택 
                        if (selectionProbability === true) {
                            //확률 기반 선택 적용
                            var probabilities = settingProbabilities(item.options, item.probabilitySetting || []);
                            var selectedOptions = applyProbabilityBasedSelection(item.options, probabilities);
                            randomData[item.name] = selectedOptions.length > 0 ? selectedOptions[0] : null;
                        }
                        else {
                            //무작위 선택
                            randomData[item.name] = item.options[Math.floor(Math.random() * item.options.length)];
                        }
                    }
                    else {
                        // 배열이지만 문자열만 포함하지 않는 경우
                        console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(item.name, ", options must be an array of strings"));
                    }
                }
                else {
                    console.error("Invalid format for 'string' type in UserDefinedItem: ".concat(item.name));
                }
                break;
            case 'boolean':
                //boolean 처리
                randomData[item.name] = Math.random() < 0.5;
                break;
            case 'array':
                // 배열 처리
                if (Array.isArray(item.options) && item.options.length > 0) {
                    if (randomizeArrays) {
                        // 랜덤 요소 선택
                        if (selectionProbability) {
                            //확률 기반 선택 적용
                            var probabilities = settingProbabilities(item.options, item.probabilitySetting || [], false);
                            var selectedOptions = applyProbabilityBasedSelection(item.options, probabilities);
                            // 선택된 항목 수가 arraySelectionCount를 초과하지 않도록 조정
                            selectedOptions = selectedOptions.slice(0, arraySelectionCount);
                            // 선택된 항목 처리
                            randomData[item.name] = selectedOptions.map(function (subItem) {
                                // 배열 내부의 객체 또는 배열을 재귀적으로 처리
                                if (typeof subItem === 'object' && subItem !== null) {
                                    return createRandomData([subItem]);
                                }
                                return subItem;
                            });
                        }
                        else {
                            // 완전 랜덤 선택 적용
                            var selectedCount = arraySelectionCount;
                            if (randomizeSelectionCount) {
                                selectedCount = Math.floor(Math.random() * selectedCount) + 1;
                            }
                            var shuffled = __spreadArray([], item.options, true).sort(function () { return 0.5 - Math.random(); });
                            randomData[item.name] = shuffled.slice(0, selectedCount).map(function (subItem) {
                                // 배열 내부의 객체 또는 배열인 경우, 재귀적으로 createRandomData 호출
                                if (typeof subItem === 'object' && subItem !== null) {
                                    return createRandomData([subItem]);
                                }
                                return subItem;
                            });
                        }
                    }
                    else {
                        // 전체 요소 포함
                        randomData[item.name] = item.options.map(function (subItem) {
                            if (typeof subItem === 'object' && subItem !== null) {
                                // 배열 내부의 객체 또는 배열인 경우, 재귀적으로 createRandomData 호출
                                return createRandomData([subItem]);
                            }
                            return subItem;
                        });
                    }
                }
                else {
                    console.error("Invalid format for 'array' type in UserDefinedItem: ".concat(item.name));
                }
                break;
            case 'object':
                // 객체 처리
                // 타입 단언 사용, item.options가 Record<string, any>(객체 속성 string, 프로퍼티 any)인지 확인
                if (typeof item.options === 'object' && item.options !== null && !Array.isArray(item.options)) {
                    var options_1 = item.options;
                    if (randomizeObjects) {
                        // 객체 속성의 랜덤 선택 처리
                        var selectedOptionKeys = [];
                        if (selectionProbability) {
                            // 확률 기반 선택 적용
                            var keys = Object.keys(options_1);
                            var probabilities = settingProbabilities(keys, item.probabilitySetting || [], true);
                            selectedOptionKeys = applyProbabilityBasedSelection(keys, probabilities);
                            // 선택된 속성 수가 objectSelectionCount를 초과하지 않도록 조정
                            selectedOptionKeys = selectedOptionKeys.slice(0, objectSelectionCount);
                            if (randomizeSelectionCount) {
                                // 선택 갯수 내에서 무작위 선택 적용
                                selectedOptionKeys = selectedOptionKeys.slice(0, Math.floor(Math.random() * selectedOptionKeys.length) + 1);
                            }
                        }
                        else {
                            // 완전 랜덤 선택 적용
                            var keys = Object.keys(options_1);
                            var selectedCount = objectSelectionCount;
                            if (randomizeSelectionCount) {
                                selectedCount = Math.floor(Math.random() * selectedCount) + 1;
                            }
                            selectedOptionKeys = keys.sort(function () { return 0.5 - Math.random(); }).slice(0, selectedCount);
                        }
                        // 최종 선택된 속성들에 대한 처리
                        selectedOptionKeys.forEach(function (key) {
                            var subItem = options_1[key];
                            if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {
                                // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출
                                randomData[item.name] = randomData[item.name] || {};
                                randomData[item.name][key] = createRandomData([subItem]);
                            }
                            else {
                                // 기본값으로 설정
                                randomData[item.name] = randomData[item.name] || {};
                                randomData[item.name][key] = subItem;
                            }
                        });
                    }
                    else {
                        // 전체 속성 포함
                        Object.keys(options_1).forEach(function (key) {
                            var subItem = options_1[key];
                            if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {
                                // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출
                                randomData[item.name] = randomData[item.name] || {};
                                randomData[item.name][key] = createRandomData([subItem]);
                            }
                            else {
                                // 기본값으로 설정
                                randomData[item.name] = randomData[item.name] || {};
                                randomData[item.name][key] = subItem;
                            }
                        });
                    }
                }
                else {
                    console.error("Invalid format for 'object' type in UserDefinedItem: ".concat(item.name));
                }
                break;
        }
    });
    return randomData;
}
exports.createRandomData = createRandomData;
/** 확률 설정 함수: 배열, 객체의 각 항목에 확률을 설정 / 확률 설정하지 않은 나머지 항목들은 나머지 확률이 나뉘어서 균등하게 분배 */
function settingProbabilities(options, settings, isObject //객체일 경우 true    
) {
    if (isObject === void 0) { isObject = false; }
    var probabilities = new Array(options.length).fill(0);
    var totalAssignedProbability = 0;
    // 객체 키 배열
    var keys = [];
    if (isObject) {
        keys = Object.keys(options);
    }
    // 지정된 확률 설정
    settings.forEach(function (setting) {
        var index = -1;
        if (isObject && typeof setting.identifier === 'number') {
            // 객체이고, identifier가 숫자일 경우 인덱스로 인식하여 처리
            if (setting.identifier < keys.length) {
                index = setting.identifier;
            }
        }
        else if (isObject && typeof setting.identifier === 'string') {
            // 객체이고, identifier가 문자열일 경우 키로 인식하여 처리
            index = keys.indexOf(setting.identifier);
        }
        else if (!isObject) {
            // 배열일 경우, 직접 인덱스로 또는 값으로 해당 항목 찾기
            index = typeof setting.identifier === 'number' ? setting.identifier : options.indexOf(setting.identifier);
        }
        if (index >= 0 && index < options.length) {
            probabilities[index] = setting.probability;
            totalAssignedProbability += setting.probability;
        }
    });
    // 남은 확률 계산 및 할당 (지정되지 않은 항목(들)에 확률을 고르게 분배하여 할당)
    var remainingProbability = 100 - totalAssignedProbability;
    var numberOfUnassignedItems = probabilities.filter(function (p) { return p === 0; }).length;
    var probabilityForEachUnassignedItem = numberOfUnassignedItems > 0 ? remainingProbability / numberOfUnassignedItems : 0;
    probabilities = probabilities.map(function (p) { return p === 0 ? probabilityForEachUnassignedItem : p; });
    return probabilities;
}
/** 세팅된 확률로 항목(들)을 선택하게 하는 함수 */
function applyProbabilityBasedSelection(options, probabilities) {
    var selectedOptions = [];
    var unselectedRandomOptions = [];
    options.forEach(function (option, index) {
        if (Math.random() * 100 < probabilities[index]) {
            selectedOptions.push(option);
        }
        else if (probabilities[index] === 0) {
            // 확률 설정이 지정되지 않은 항목들
            unselectedRandomOptions.push(option);
        }
    });
    // 아무 항목도 선택되지 않았고, 확률 설정이 지정되지 않은 항목이 있다면 그 중 하나를 무작위로 선택
    if (selectedOptions.length === 0 && unselectedRandomOptions.length > 0) {
        var randomIndex = Math.floor(Math.random() * unselectedRandomOptions.length);
        selectedOptions.push(unselectedRandomOptions[randomIndex]);
    }
    return selectedOptions;
}
//사용자 클릭 이벤트 리스너 추적 함수 Click Event Listener
function trackClickEvent(event, eventType, includeLocalCustomData, includeGlobalCustomData, callback) {
    if (includeLocalCustomData === void 0) { includeLocalCustomData = false; }
    if (includeGlobalCustomData === void 0) { includeGlobalCustomData = false; }
    // eventData객체를 저장하기 위한 객체
    var allEventData = {};
    for (var i = 0; i < exports.userDefinedClickCount; i++) { //설정한 클릭 횟수만큼 이벤트 데이터 객체 생성
        var localCustomDataList = getLocalCustomDataGroup(eventType);
        var eventData = {
            eventType: event.type,
            timestamp: getRandomTimestamp(),
            clickCount: i + 1, //각 이벤트에 대한 고유한 클릭 카운트 부여
        };
        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)
        if (includeLocalCustomData && localCustomDataList.length > 0) {
            var localCustomData = createRandomData(localCustomDataList);
            Object.assign(eventData, localCustomData);
        }
        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)
        if (includeGlobalCustomData) {
            //customData 생성
            var globalCustomData = createRandomData(exports.GlobalUserDefinedItems);
            Object.assign(eventData, globalCustomData);
        }
        var eventId = "".concat(event.type, "_").concat(i + 1); // 고유 식별자 생성
        allEventData[eventId] = eventData; // 객체에 생성된 eventData 저장
    }
    // 콜백 함수 호출
    if (callback) {
        callback(allEventData);
    }
    console.log('Click Event Data:', allEventData);
}
exports.trackClickEvent = trackClickEvent;
//사용자 입력 키워드 이벤트 추적 함수 Keyword Event
function trackKeywordEvent(keyword, eventType, includeLocalCustomData, includeGlobalCustomData, repeatCount, callback) {
    if (includeLocalCustomData === void 0) { includeLocalCustomData = false; }
    if (includeGlobalCustomData === void 0) { includeGlobalCustomData = false; }
    if (repeatCount === void 0) { repeatCount = 1; }
    // eventData객체를 저장하기 위한 객체
    var allEventData = {};
    for (var i = 0; i < exports.userDefinedKeywordCount; i++) { //설정한 키워드 입력 횟수만큼 이벤트 데이터 객체 생성
        var localCustomDataList = getLocalCustomDataGroup(eventType);
        var eventData = {
            keyword: keyword,
            eventType: eventType,
            timestamp: getRandomTimestamp(),
            keywordCount: i + 1, //각 이벤트에 대한 고유한 키워드 카운트 부여
            repeatCount: repeatCount,
        };
        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)
        if (includeLocalCustomData && localCustomDataList.length > 0) {
            var localCustomData = createRandomData(localCustomDataList);
            Object.assign(eventData, localCustomData);
        }
        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)
        if (includeGlobalCustomData) {
            //customData 생성
            var globalCustomData = createRandomData(exports.GlobalUserDefinedItems);
            Object.assign(eventData, globalCustomData);
        }
        var eventId = "".concat(eventType, "_").concat(i + 1); // 고유 식별자 생성
        allEventData[eventId] = eventData; // 객체에 eventData 저장
    }
    // 콜백 함수 호출
    if (callback) {
        callback(allEventData);
    }
    console.log('Keyword Event Data:', allEventData);
}
exports.trackKeywordEvent = trackKeywordEvent;
/**클릭 횟수를 사용자가 직접 조정할 수 있는 함수:
 * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)
 * setUserClickCount(100): 클릭 횟수 100회로 설정*/
function setUserClickCount(ClickEventCount) {
    if (ClickEventCount >= 1 && ClickEventCount <= Number.MAX_SAFE_INTEGER) {
        exports.userDefinedClickCount = ClickEventCount;
    }
    else {
        console.error("Invalid Click Count. Please enter a number between 1 and ".concat(Number.MAX_SAFE_INTEGER, ". Default value 1 will be set."));
        exports.userDefinedClickCount = 1; // Set a default value 1
    }
}
exports.setUserClickCount = setUserClickCount;
/**특정 키워드 생성 & 검색 횟수를 사용자가 직접 조정할 수 있는 함수:
 * * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)
 * setUserKeywordCount(100): 키워드 생성 & 검색 횟수 100회로 설정*/
function setUserKeywordCount(KeywordEventCount) {
    if (KeywordEventCount >= 1 && KeywordEventCount <= Number.MAX_SAFE_INTEGER) {
        exports.userDefinedKeywordCount = KeywordEventCount;
    }
    else {
        console.error("Invalid Keyword Count. Please enter a number between 1 and ".concat(Number.MAX_SAFE_INTEGER, ". Default value 1 will be set."));
        exports.userDefinedKeywordCount = 1; // Set a default value 1
    }
}
exports.setUserKeywordCount = setUserKeywordCount;
