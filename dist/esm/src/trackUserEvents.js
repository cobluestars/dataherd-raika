// ./src/trackUserEvents.ts
export let userDefinedClickCount = 1;
export let userDefinedKeywordCount = 1;
export let startTime = new Date(); // initialize start time
export let endTime = new Date(); // initialize end time
//전역 변수로 사용될 시간 설정 객체 TimestampSettings
let TimestampSettings;
//시간 설정 초기화 함수
export function initializeTimestampSettings(settings) {
    //시작/종료 시간값이 제공되지 않았거나 유효하지 않을 시, 현재 시간 사용
    const now = new Date().toISOString();
    TimestampSettings = {
        startTime: settings.startTime || now,
        endTime: settings.endTime || now,
        peakTimes: settings.peakTimes
    };
}
//startTime - endTime 시간 범위 내에서 랜덤한 타임스탬프 생성
// 이 함수는 옵션으로 '피크 타임'을 지정할 수 있으며, 피크 타임 동안 타임스탬프가 생성될 확률이 높아짐.
export function getRandomTimestamp() {
    //TimestampSettings 직접 사용
    const { startTime, endTime, peakTimes } = TimestampSettings;
    // 문자열로 된 날짜를 Date 객체로 파싱하는 함수
    const parseDateTime = (dateTimeStr) => {
        //UTC 기준으로 Date 객체 생성
        return new Date(Date.parse(dateTimeStr + 'Z'));
    };
    let startDt = parseDateTime(startTime);
    let endDt = parseDateTime(endTime);
    // 시작 시간이 종료 시간보다 미래인 경우, 현재 시간을 사용함.
    const now = new Date();
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
    const validatePeakTimes = (peakTimes, start, end) => {
        if (!peakTimes)
            return true;
        if (!Array.isArray(peakTimes) || !peakTimes.every(pt => Array.isArray(pt) && pt.length === 2))
            return false;
        return peakTimes.every(([startPt, endPt]) => {
            const peakStart = parseDateTime(startPt);
            const peakEnd = parseDateTime(endPt);
            return peakStart >= start && peakEnd <= end;
        });
    };
    let validPeakTimes = peakTimes;
    // 피크 타임이 유효하지 않은 시 콘솔 에러 출력, 피크 타임 없이 함수를 실행
    if (validPeakTimes && !validatePeakTimes(validPeakTimes, startDt, endDt)) {
        console.error("Invalid peak times format or out of range. Defaulting to random timestamp between start and end.");
        validPeakTimes = undefined;
    }
    // 주어진 두 시간 사이에서 랜덤한 타임스탬프 생성
    const getRandomDate = (start, end) => {
        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(randomTime);
    };
    // 피크 타임이 없으면, 두 시간 사이에서 랜덤한 타임스탬프를 반환
    if (!peakTimes) {
        return getRandomDate(startDt, endDt);
    }
    // 피크 타임과 비피크 타임에 대한 간격과 가중치를 계산
    let intervals = peakTimes.map(pt => [parseDateTime(pt[0]), parseDateTime(pt[1])]);
    let totalDuration = endDt.getTime() - startDt.getTime();
    let peakWeights = intervals.map(([start, end]) => ((end.getTime() - start.getTime()) / totalDuration) * 10);
    let nonPeakWeight = Math.max(1, 10 - peakWeights.reduce((a, b) => a + b, 0));
    intervals.push([startDt, endDt]);
    peakWeights.push(nonPeakWeight);
    // 가중치를 고려하여 랜덤하게 간격을 선택하고, 해당 간격 내에서 타임스탬프를 생성
    let chosenInterval = intervals[Math.floor(Math.random() * intervals.length)];
    return getRandomDate(chosenInterval[0], chosenInterval[1]);
}
// 전역 커스텀 데이터들을 관리하기 위한 UserDefinedItem 배열
export let GlobalUserDefinedItems = [];
// 다양한 로컬 커스텀 데이터 그룹들을 관리하기 위한 '객체' 
const localCustomDataGroups = {};
// 전역 커스텀 데이터 설정 함수
export function setGlobalUserDefinedItems(items) {
    GlobalUserDefinedItems = items;
}
// 로컬 커스텀 데이터 그룹 설정 함수
export function setLocalCustomDataGroup(eventType, items) {
    localCustomDataGroups[eventType] = items;
}
//로컬 커스텀 데이터 그룹 반환 함수
export function getLocalCustomDataGroup(eventType) {
    return localCustomDataGroups[eventType] || [];
}
//정규 분포(가우스 분포) 랜덤 숫자 생성 함수
export function gaussianRandom(mean, standardDeviation) {
    let u = 0, v = 0;
    while (u === 0)
        u = Math.random();
    while (v === 0)
        v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num * standardDeviation + mean; //평균 및 표준편차 조정
    return num;
}
//랜덤 데이터 생성 함수
export function createRandomData(items) {
    let randomData = {};
    items.forEach(item => {
        var _a, _b, _c, _d, _e, _f;
        //배열 & 객체의 항목들에 대한 랜덤 처리 여부
        const randomizeArrays = (_a = item.randomizeArrays) !== null && _a !== void 0 ? _a : false; // 기본값: false
        const randomizeObjects = (_b = item.randomizeObjects) !== null && _b !== void 0 ? _b : false; // 기본값: false
        //배열 & 객체의 항목들을 랜덤 선택 처리할 시, 선택 갯수 정의 
        const arraySelectionCount = (_c = item.arraySelectionCount) !== null && _c !== void 0 ? _c : 1; // 기본값을 1로 설정
        const objectSelectionCount = (_d = item.objectSelectionCount) !== null && _d !== void 0 ? _d : 1; // 기본값을 1로 설정
        //'문자열 그룹', '배열', '객체' 항목의 랜덤 선택 시, 특정 항목(들)이 선택될 확률 임의 조정 여부 (디폴트: false)
        const selectionProbability = (_e = item.selectionProbability) !== null && _e !== void 0 ? _e : false; // 기본값: false
        //선택 갯수 내에서 무작위 선택 여부 (ex: 3개 선택 시 2개만 선택될 수 있음.)
        const randomizeSelectionCount = (_f = item.randomizeSelectionCount) !== null && _f !== void 0 ? _f : false; // 기본값: false
        switch (item.type) {
            case 'number':
                //숫자 처리
                //단일 숫자일 경우, 이를 디폴트 값으로 설정
                if (typeof item.options === 'number') {
                    randomData[item.name] = item.options;
                }
                //숫자 범위가 [ n, m ] 배열 형태로 주어질 경우, 그 확률이 '무작위' 혹은 '정규 분포'를 따르도록 설정
                else if (Array.isArray(item.options) && item.options.length === 2) {
                    const [min, max] = item.options;
                    // 확률분포 디폴트 설정: 'uniform' (완전 랜덤)
                    const distribution = item.distribution != null ? item.distribution : 'uniform';
                    // 평균값의 디폴트 설정: 중간값
                    const mean = item.mean != null ? item.mean : (min + max) / 2;
                    // 표준편차의 디폴트 설정: 6시그마
                    const standardDeviation = item.standardDeviation != null ? item.standardDeviation : (max - min) / 6;
                    if (distribution === 'uniform') { //완전 랜덤
                        randomData[item.name] = Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                    else if (distribution === 'normal') { //정규 분포(가우스 분포)
                        let normalValue = gaussianRandom(mean, standardDeviation);
                        //결과값을 범위 내로 조정
                        normalValue = Math.max(min, Math.min(max, normalValue));
                        randomData[item.name] = Math.floor(normalValue);
                    }
                }
                else {
                    console.error(`Invalid format for 'number' type in UserDefinedItem: ${item.name}`);
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
                    if (item.options.every(option => typeof option === 'string')) {
                        //랜덤하게 선택 
                        if (selectionProbability === true) {
                            //확률 기반 선택 적용
                            const probabilities = settingProbabilities(item.options, item.probabilitySetting || []);
                            const selectedOptions = applyProbabilityBasedSelection(item.options, probabilities);
                            randomData[item.name] = selectedOptions.length > 0 ? selectedOptions[0] : null;
                        }
                        else {
                            //무작위 선택
                            randomData[item.name] = item.options[Math.floor(Math.random() * item.options.length)];
                        }
                    }
                    else {
                        // 배열이지만 문자열만 포함하지 않는 경우
                        console.error(`Invalid format for 'string' type in UserDefinedItem: ${item.name}, options must be an array of strings`);
                    }
                }
                else {
                    console.error(`Invalid format for 'string' type in UserDefinedItem: ${item.name}`);
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
                            const probabilities = settingProbabilities(item.options, item.probabilitySetting || [], false);
                            let selectedOptions = applyProbabilityBasedSelection(item.options, probabilities);
                            // 선택된 항목 수가 arraySelectionCount를 초과하지 않도록 조정
                            selectedOptions = selectedOptions.slice(0, arraySelectionCount);
                            // 선택된 항목 처리
                            randomData[item.name] = selectedOptions.map(subItem => {
                                // 배열 내부의 객체 또는 배열을 재귀적으로 처리
                                if (typeof subItem === 'object' && subItem !== null) {
                                    return createRandomData([subItem]);
                                }
                                return subItem;
                            });
                        }
                        else {
                            // 완전 랜덤 선택 적용
                            let selectedCount = arraySelectionCount;
                            if (randomizeSelectionCount) {
                                selectedCount = Math.floor(Math.random() * selectedCount) + 1;
                            }
                            const shuffled = [...item.options].sort(() => 0.5 - Math.random());
                            randomData[item.name] = shuffled.slice(0, selectedCount).map(subItem => {
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
                        randomData[item.name] = item.options.map(subItem => {
                            if (typeof subItem === 'object' && subItem !== null) {
                                // 배열 내부의 객체 또는 배열인 경우, 재귀적으로 createRandomData 호출
                                return createRandomData([subItem]);
                            }
                            return subItem;
                        });
                    }
                }
                else {
                    console.error(`Invalid format for 'array' type in UserDefinedItem: ${item.name}`);
                }
                break;
            case 'object':
                // 객체 처리
                // 타입 단언 사용, item.options가 Record<string, any>(객체 속성 string, 프로퍼티 any)인지 확인
                if (typeof item.options === 'object' && item.options !== null && !Array.isArray(item.options)) {
                    const options = item.options;
                    if (randomizeObjects) {
                        // 객체 속성의 랜덤 선택 처리
                        let selectedOptionKeys = [];
                        if (selectionProbability) {
                            // 확률 기반 선택 적용
                            const keys = Object.keys(options);
                            const probabilities = settingProbabilities(keys, item.probabilitySetting || [], true);
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
                            const keys = Object.keys(options);
                            let selectedCount = objectSelectionCount;
                            if (randomizeSelectionCount) {
                                selectedCount = Math.floor(Math.random() * selectedCount) + 1;
                            }
                            selectedOptionKeys = keys.sort(() => 0.5 - Math.random()).slice(0, selectedCount);
                        }
                        // 최종 선택된 속성들에 대한 처리
                        selectedOptionKeys.forEach(key => {
                            const subItem = options[key];
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
                        Object.keys(options).forEach(key => {
                            const subItem = options[key];
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
                    console.error(`Invalid format for 'object' type in UserDefinedItem: ${item.name}`);
                }
                break;
        }
    });
    return randomData;
}
/** 확률 설정 함수: 배열, 객체의 각 항목에 확률을 설정 / 확률 설정하지 않은 나머지 항목들 중 최소 하나가 선택될 확률을 100%로 설정 */
function settingProbabilities(options, settings, isObject = false //객체일 경우 true    
) {
    let probabilities = new Array(options.length).fill(0);
    let totalAssignedProbability = 0;
    // 객체 키 배열
    let keys = [];
    if (isObject) {
        keys = Object.keys(options);
    }
    // 지정된 확률 설정
    settings.forEach(setting => {
        let index = -1;
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
    // 확률 설정이 적용되지 않은 나머지 항목들에 대해, 최소 하나가 선택될 확률을 100%로 설정
    if (totalAssignedProbability < 100) {
        const unassignedProbabilities = probabilities.filter(p => p === 0);
        const remainingProbabilityPerItem = (100 - totalAssignedProbability) / unassignedProbabilities.length;
        probabilities = probabilities.map(p => p === 0 ? remainingProbabilityPerItem : p);
    }
    return probabilities;
}
/** 세팅된 확률로 항목(들)을 선택하게 하는 함수 */
function applyProbabilityBasedSelection(options, probabilities) {
    let selectedOptions = [];
    // 먼저 확률에 따라 항목들을 선택
    options.forEach((option, index) => {
        if (Math.random() * 100 < probabilities[index]) {
            selectedOptions.push(option);
        }
    });
    // 선택된 항목이 없다면, 확률 설정되지 않은 항목들 중 하나를 무작위로 선택
    if (selectedOptions.length === 0) {
        const unselectedOptions = options.filter((_, index) => probabilities[index] === 0);
        if (unselectedOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * unselectedOptions.length);
            selectedOptions.push(unselectedOptions[randomIndex]);
        }
        else {
            // 확률 설정된 항목이 없을 경우, 전체 항목 중에서 무작위로 하나 선택
            const randomIndex = Math.floor(Math.random() * options.length);
            selectedOptions.push(options[randomIndex]);
        }
    }
    return selectedOptions;
}
//사용자 클릭 이벤트 리스너 추적 함수 Click Event Listener
export function trackClickEvent(event, eventType, includeLocalCustomData = false, includeGlobalCustomData = false, callback) {
    // eventData객체를 저장하기 위한 객체
    let allEventData = {};
    for (let i = 0; i < userDefinedClickCount; i++) { //설정한 클릭 횟수만큼 이벤트 데이터 객체 생성
        const localCustomDataList = getLocalCustomDataGroup(eventType);
        const eventData = {
            eventType: event.type,
            timestamp: getRandomTimestamp(),
            clickCount: i + 1, //각 이벤트에 대한 고유한 클릭 카운트 부여
        };
        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)
        if (includeLocalCustomData && localCustomDataList.length > 0) {
            const localCustomData = createRandomData(localCustomDataList);
            Object.assign(eventData, localCustomData);
        }
        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)
        if (includeGlobalCustomData) {
            //customData 생성
            const globalCustomData = createRandomData(GlobalUserDefinedItems);
            Object.assign(eventData, globalCustomData);
        }
        const eventId = `${event.type}_${i + 1}`; // 고유 식별자 생성
        allEventData[eventId] = eventData; // 객체에 생성된 eventData 저장
    }
    // 콜백 함수 호출
    if (callback) {
        callback(allEventData);
    }
    console.log('Click Event Data:', allEventData);
}
//사용자 입력 키워드 이벤트 추적 함수 Keyword Event
export function trackKeywordEvent(keyword, eventType, includeLocalCustomData = false, includeGlobalCustomData = false, repeatCount = 1, callback) {
    // eventData객체를 저장하기 위한 객체
    let allEventData = {};
    for (let i = 0; i < userDefinedKeywordCount; i++) { //설정한 키워드 입력 횟수만큼 이벤트 데이터 객체 생성
        const localCustomDataList = getLocalCustomDataGroup(eventType);
        const eventData = {
            keyword: keyword,
            eventType: eventType,
            timestamp: getRandomTimestamp(),
            keywordCount: i + 1, //각 이벤트에 대한 고유한 키워드 카운트 부여
            repeatCount: repeatCount,
        };
        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)
        if (includeLocalCustomData && localCustomDataList.length > 0) {
            const localCustomData = createRandomData(localCustomDataList);
            Object.assign(eventData, localCustomData);
        }
        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)
        if (includeGlobalCustomData) {
            //customData 생성
            const globalCustomData = createRandomData(GlobalUserDefinedItems);
            Object.assign(eventData, globalCustomData);
        }
        const eventId = `${eventType}_${i + 1}`; // 고유 식별자 생성
        allEventData[eventId] = eventData; // 객체에 eventData 저장
    }
    // 콜백 함수 호출
    if (callback) {
        callback(allEventData);
    }
    console.log('Keyword Event Data:', allEventData);
}
/**클릭 횟수를 사용자가 직접 조정할 수 있는 함수:
 * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)
 * setUserClickCount(100): 클릭 횟수 100회로 설정*/
export function setUserClickCount(ClickEventCount) {
    if (ClickEventCount >= 1 && ClickEventCount <= Number.MAX_SAFE_INTEGER) {
        userDefinedClickCount = ClickEventCount;
    }
    else {
        console.error(`Invalid Click Count. Please enter a number between 1 and ${Number.MAX_SAFE_INTEGER}. Default value 1 will be set.`);
        userDefinedClickCount = 1; // Set a default value 1
    }
}
/**특정 키워드 생성 & 검색 횟수를 사용자가 직접 조정할 수 있는 함수:
 * * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)
 * setUserKeywordCount(100): 키워드 생성 & 검색 횟수 100회로 설정*/
export function setUserKeywordCount(KeywordEventCount) {
    if (KeywordEventCount >= 1 && KeywordEventCount <= Number.MAX_SAFE_INTEGER) {
        userDefinedKeywordCount = KeywordEventCount;
    }
    else {
        console.error(`Invalid Keyword Count. Please enter a number between 1 and ${Number.MAX_SAFE_INTEGER}. Default value 1 will be set.`);
        userDefinedKeywordCount = 1; // Set a default value 1
    }
}
