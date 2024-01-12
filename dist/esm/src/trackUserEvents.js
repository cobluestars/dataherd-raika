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
        peakTimes: settings.peakTimes,
        peakTimeWeight: settings.peakTimeWeight || 1.6 //default: *1.6
    };
}
//startTime - endTime 시간 범위 내에서 랜덤한 타임스탬프 생성
// 이 함수는 옵션으로 '피크 타임'을 지정할 수 있으며, 피크 타임 동안 타임스탬프가 생성될 확률이 높아짐.
export function getRandomTimestamp() {
    //TimestampSettings 직접 사용
    const { startTime, endTime, peakTimes, peakTimeWeight } = TimestampSettings;
    // 문자열로 된 날짜를 Date 객체로 파싱하는 함수
    const parseDateTime = (dateTimeStr) => new Date(Date.parse(dateTimeStr + 'Z'));
    //UTC 기준으로 Date 객체 생성
    let startDt = parseDateTime(startTime);
    let endDt = parseDateTime(endTime);
    // 시작 시간이 종료 시간보다 미래인 경우, 현재 시간을 사용함.
    if (startDt.getTime() > endDt.getTime()) {
        startDt = new Date();
        endDt = new Date(startDt.getTime() + 1000); //1초 후를 endTime으로 설정
    }
    // 두 Date 객체 사이에서 랜덤하게 시간을 생성
    const getRandomDate = (start, end) => {
        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(randomTime);
    };
    // 피크 타임 배열이 없는 경우를 처리함
    let validPeakTimes = peakTimes || [];
    // 피크 타임을 각각 시작 시간과 종료 시간으로 분리해 인터벌 배열을 생성
    let intervals = validPeakTimes.map(pt => [parseDateTime(pt[0]), parseDateTime(pt[1])]);
    // 전체 시간
    let totalDuration = endDt.getTime() - startDt.getTime();
    // 피크/비피크 시간의 총 길이 계산
    let peakTotalDuration = intervals.reduce((sum, [start, end]) => sum + (end.getTime() - start.getTime()), 0);
    let nonPeakTotalDuration = totalDuration - peakTotalDuration;
    //가중치 없는 경우 디폴트: 1.6배 적용
    const actualPeakTimeWeight = peakTimeWeight || 1.6;
    // 피크 시간의 확률을 계산하고 가중치를 적용
    let peakProbability = peakTotalDuration / totalDuration;
    let nonPeakProbability = nonPeakTotalDuration / totalDuration;
    // 가중치 조정
    peakProbability = peakProbability * actualPeakTimeWeight / (peakProbability * actualPeakTimeWeight + nonPeakProbability);
    nonPeakProbability = 1 - peakProbability;
    // 랜덤 확률에 따라 피크 시간대 또는 비피크 시간대에서 날짜 선택
    if (Math.random() < peakProbability) {
        const chosenPeakInterval = intervals[Math.floor(Math.random() * intervals.length)];
        return getRandomDate(chosenPeakInterval[0], chosenPeakInterval[1]);
    }
    else {
        let nonPeakIntervals = [];
        let lastEnd = startDt;
        // 비피크 시간대 계산
        for (let interval of intervals) {
            if (lastEnd < interval[0]) {
                nonPeakIntervals.push([lastEnd, interval[0]]);
            }
            lastEnd = interval[1];
        }
        // 남은 시간을 비피크 시간대로 추가
        if (lastEnd < endDt) {
            nonPeakIntervals.push([lastEnd, endDt]);
        }
        // 비피크 시간대에서 랜덤한 시간 선택
        const chosenNonPeakInterval = nonPeakIntervals[Math.floor(Math.random() * nonPeakIntervals.length)];
        return getRandomDate(chosenNonPeakInterval[0], chosenNonPeakInterval[1]);
    }
}
/**
 *🐺 Ver 1.1.0: 캐시 데이터 설정 예시 🐺
const userDefinedItem: UserDefinedItem[] = [{
    name: "example",
    type: "object",
    // 사용 예시
    const cacheSettings: CacheDataSettings = {
        enableCacheSimulation: true,
        simulatedCacheSize: 50, // 50MB의 무의미한 텍스트 캐시 데이터
        simulatedDelay: 500 // 500ms 지연
    };
    // 다른 옵션들...
}];
*/
/**🐺 Ver 1.1.0: 캐시 데이터 생성 및 첨가 함수 🐺 */
function simulateCacheData(cacheSettings) {
    if (!cacheSettings.enableCacheSimulation) {
        return { totalDelay: 0, simulatedDelay: 0 };
    }
    const startTime = performance.now(); //'캐시 데이터 생성' 이전 시간 측정
    // 캐시 데이터를 시뮬레이션하기 위한 객체
    let cacheData = {
        size: cacheSettings.simulatedCacheSize,
        delay: cacheSettings.simulatedDelay,
        content: [] // 캐시 데이터 내용 (문자열 배열로 타입을 명시함.)
    };
    // 캐시 데이터 시뮬레이션 로직 (무의미한 텍스트 데이터 반복 생성)
    // 🐺 1MB text: 1,000,000 chars 🐺
    const chars = "QUICKBROWNFOXJUMPSOVERTHELAZYDOGquickbrownfoxjumpsoverthelazydog0123456789";
    let simulatedText = '';
    for (let i = 0; i < cacheSettings.simulatedCacheSize * 1000000; i++) {
        simulatedText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    cacheData.content.push(simulatedText);
    const endTime = performance.now(); //'캐시 데이터 생성' 이후 시간 측정
    let simulatedCacheDelay_ms = endTime - startTime;
    let totalDelay = cacheSettings.simulatedDelay + simulatedCacheDelay_ms;
    // 인위적인 지연 시간 추가
    if (cacheSettings.simulatedDelay > 0) {
        setTimeout(() => {
            // console.log(`Simulated delay of ${cacheSettings.simulatedDelay}ms`);
        }, cacheSettings.simulatedDelay);
    }
    const result = {
        simulatedCacheSize_MB: cacheSettings.simulatedCacheSize, //캐시 데이터 크기(MB)
        simulatedCacheDelay_ms, //캐시 데이터에 의해 지연된 시간 (ms)
        simulatedDelay_ms: cacheSettings.simulatedDelay, //설정된 인위적인 지연 시간 (ms)
        totalDelay_ms: totalDelay //총 지연 시간 (ms)
    };
    return result;
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
/** 🐺 Ver 1.3.0: 컨텍스트(맥락)에 기반한 조건부 옵션 제공 🐺 */
//contextBasedOptions가 존재할 시, contextBasedOptions를 적용하는 함수
function evaluateContextBasedOptions(item, context) {
    if (item.contextBasedOptions) {
        return item.contextBasedOptions && item.contextBasedOptions(context);
    }
    return undefined;
}
/** 🐺 Ver 1.3.0: 컨텍스트(맥락)에 기반한 조건부 옵션 제공 🐺 */
//case: 'number'
function generateNumberValueFromContext(contextValue) {
    //contextValue 객체에서 필요한 정보를 추출
    const min = contextValue.options[0];
    const max = contextValue.options[1];
    const mean = contextValue.mean || (min + max) / 2;
    const standardDeviation = contextValue.standardDeviation || (max - min) / 6;
    const distribution = contextValue.distribution || 'uniform';
    // 숫자 값을 생성하는 로직
    if (distribution === 'uniform') {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    else if (distribution === 'normal') {
        let value = gaussianRandom(mean, standardDeviation);
        return Math.max(min, Math.min(max, value));
    }
}
//case: 'string'
function generateStringValueFromContext(contextValue) {
    if (typeof contextValue.options === 'string') {
        // 단일 문자열인 경우, 이를 디폴트 값으로 설정
        return contextValue.options;
    }
    else if (Array.isArray(contextValue.options)) {
        //문자열 배열인 경우
        if (contextValue.options.every((option) => typeof option === 'string')) {
            if (contextValue.selectionProbability === true) {
                //확률 기반 선택 적용
                const probabilities = settingProbabilities(contextValue.options, contextValue.probabilitySetting || []);
                const selectedOptions = applyProbabilityBasedSelection(contextValue.options, probabilities);
                return selectedOptions.length > 0 ? selectedOptions[0] : null;
            }
            else {
                //무작위 선택
                return contextValue.options[Math.floor(Math.random() * contextValue.options.length)];
            }
        }
        else {
            // 배열이지만 문자열만 포함하지 않는 경우
            console.error(`Invalid format for 'string' type in UserDefinedItem: ${contextValue.name}, options must be an array of strings`);
        }
    }
    else {
        console.error(`Invalid format for 'string' type in UserDefinedItem: ${contextValue.name}`);
    }
}
//case: 'boolean'
function generateBooleanValueFromContext(contextValue) {
    if (typeof contextValue.options === 'boolean')
        return Math.random() < 0.5;
}
//case: 'array'
function generateArrayValueFromContext(contextValue) {
    if (Array.isArray(contextValue.options) && contextValue.options.length > 0) {
        if (contextValue.randomizeArrays) {
            // 랜덤 요소 선택
            if (contextValue.selectionProbability) {
                //확률 기반 선택 적용
                const probabilities = settingProbabilities(contextValue.options, contextValue.probabilitySetting || [], false);
                let selectedOptions = applyProbabilityBasedSelection(contextValue.options, probabilities);
                // 선택된 항목 수가 arraySelectionCount를 초과하지 않도록 조정
                selectedOptions = selectedOptions.slice(0, contextValue.arraySelectionCount);
                // 선택된 항목 처리
                return selectedOptions.map(subItem => {
                    // 배열 내부의 객체 또는 배열을 재귀적으로 처리
                    if (typeof subItem === 'object' && subItem !== null) {
                        const result = createRandomData([subItem], true);
                        return result.randomData;
                    }
                    return subItem;
                });
            }
            else {
                // 완전 랜덤 선택 적용
                let selectedCount = contextValue.arraySelectionCount;
                if (contextValue.randomizeSelectionCount) {
                    selectedCount = Math.floor(Math.random() * selectedCount) + 1;
                }
                const shuffled = [...contextValue.options].sort(() => 0.5 - Math.random());
                return shuffled.slice(0, selectedCount).map(subItem => {
                    // 배열 내부의 객체 또는 배열인 경우, 재귀적으로 createRandomData 호출
                    if (typeof subItem === 'object' && subItem !== null) {
                        const result = createRandomData([subItem], true);
                        return result.randomData;
                    }
                    return subItem;
                });
            }
        }
        else {
            // 전체 요소 포함
            return contextValue.options.map((subItem) => {
                if (typeof subItem === 'object' && subItem !== null) {
                    // 배열 내부의 객체 또는 배열인 경우, 재귀적으로 createRandomData 호출
                    const result = createRandomData([subItem], true);
                    return result.randomData;
                }
                return subItem;
            });
        }
    }
    else {
        console.error(`Invalid format for 'array' type in UserDefinedItem: ${contextValue.name}`);
    }
}
//case: 'object'
function generateObjectValueFromContext(contextValue) {
    if (typeof contextValue.options === 'object' && contextValue.options !== null && !Array.isArray(contextValue.options)) {
        const options = contextValue.options;
        if (contextValue.randomizeObjects) {
            // 객체 속성의 랜덤 선택 처리
            let selectedOptionKeys = [];
            if (contextValue.selectionProbability) {
                // 확률 기반 선택 적용
                const keys = Object.keys(options);
                const probabilities = settingProbabilities(keys, contextValue.probabilitySetting || [], true);
                selectedOptionKeys = applyProbabilityBasedSelection(keys, probabilities);
                // 선택된 속성 수가 objectSelectionCount를 초과하지 않도록 조정
                selectedOptionKeys = selectedOptionKeys.slice(0, contextValue.objectSelectionCount);
                if (contextValue.randomizeSelectionCount) {
                    // 선택 갯수 내에서 무작위 선택 적용
                    selectedOptionKeys = selectedOptionKeys.slice(0, Math.floor(Math.random() * selectedOptionKeys.length) + 1);
                }
            }
            else {
                // 완전 랜덤 선택 적용
                const keys = Object.keys(options);
                let selectedCount = contextValue.objectSelectionCount;
                if (contextValue.randomizeSelectionCount) {
                    selectedCount = Math.floor(Math.random() * selectedCount) + 1;
                }
                selectedOptionKeys = keys.sort(() => 0.5 - Math.random()).slice(0, selectedCount);
            }
            // 최종 선택된 속성들에 대한 처리
            selectedOptionKeys.forEach(key => {
                const subItem = options[key];
                if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {
                    // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출
                    const result = createRandomData([subItem], true);
                    return result.randomData;
                }
                else {
                    // 기본값으로 설정
                    return subItem;
                }
            });
            if (selectedOptionKeys.length === 0) {
                console.error(`Invalid object configuration for randomizeObjects in UserDefinedItem: ${contextValue.name}`);
            }
        }
        else {
            // 전체 속성 포함
            Object.keys(options).forEach(key => {
                const subItem = options[key];
                if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {
                    // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출
                    const result = createRandomData([subItem], true);
                    return result.randomData;
                }
                else {
                    // 기본값으로 설정
                    return subItem;
                }
            });
            if (Object.keys(options).length === 0) {
                console.error(`Invalid object configuration for non-randomized objects in UserDefinedItem: ${contextValue.name}`);
            }
        }
    }
}
//랜덤 데이터 생성 함수
export function createRandomData(items, isRecursive = false) {
    let randomData = {};
    let cacheImpact; //캐시 데이터 추가 테스트 결과를 저장하기 위한 변수
    // 재귀 알고리즘으로 중복 호출되지 않았을 때에만 캐시 시뮬레이션을 적용
    if (!isRecursive) {
        items.forEach(item => {
            if (item.name && item.type === 'object' && item.cacheSettings && item.cacheSettings.enableCacheSimulation === true && !item.options) {
                cacheImpact = simulateCacheData(item.cacheSettings);
                return; // 캐시 데이터 처리 이후 다음 항목으로 넘어감
            }
        });
    }
    items.forEach(item => {
        var _a, _b, _c, _d, _e, _f;
        /** 🐺 Ver 1.3.0: 컨텍스트(맥락)에 기반한 조건부 옵션 제공 🐺 */
        //특정 '맥락'에 영향을 받는 값
        const contextValue = evaluateContextBasedOptions(item, randomData);
        /**contextBasedValue에 의해 'number', 'string', 'boolean', 'array', 'object' 모두 영향을 받을 수 있음.*/
        if (contextValue !== undefined) {
            // contextBasedOptions에서 반환된 값이 객체인 경우
            if (typeof contextValue === 'object' && contextValue !== null) {
                switch (item.type) {
                    case 'number':
                        randomData[item.name] = generateNumberValueFromContext(contextValue);
                        break;
                    case 'string':
                        randomData[item.name] = generateStringValueFromContext(contextValue);
                        break;
                    case 'boolean':
                        randomData[item.name] = generateBooleanValueFromContext(contextValue);
                        break;
                    case 'array':
                        randomData[item.name] = generateArrayValueFromContext(contextValue);
                        break;
                    case 'object':
                        randomData[item.name] = generateObjectValueFromContext(contextValue);
                        break;
                    default:
                        //처리할 수 없는 타입이 반환될 경우
                        console.error(`Unsupported type in contextBasedOptions for ${item.name}`);
                        break;
                }
            }
            else {
                // contextBasedOptions에서 단일 값 반환
                randomData[item.name] = contextValue;
            }
            /** 🐺 Ver 1.3.0: 컨텍스트(맥락)에 기반한 조건부 옵션 제공 🐺 */
        }
        else {
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
                                        const result = createRandomData([subItem], true);
                                        return result.randomData;
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
                                        const result = createRandomData([subItem], true);
                                        return result.randomData;
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
                                    const result = createRandomData([subItem], true);
                                    return result.randomData;
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
                                    const result = createRandomData([subItem], true);
                                    return result.randomData;
                                }
                                else {
                                    // 기본값으로 설정
                                    randomData[item.name] = randomData[item.name] || {};
                                    randomData[item.name][key] = subItem;
                                }
                            });
                            if (selectedOptionKeys.length === 0) {
                                console.error(`Invalid object configuration for randomizeObjects in UserDefinedItem: ${item.name}`);
                            }
                        }
                        else {
                            // 전체 속성 포함
                            Object.keys(options).forEach(key => {
                                const subItem = options[key];
                                if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {
                                    // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출
                                    randomData[item.name] = randomData[item.name] || {};
                                    const result = createRandomData([subItem], true);
                                    return result.randomData;
                                }
                                else {
                                    // 기본값으로 설정
                                    randomData[item.name] = randomData[item.name] || {};
                                    randomData[item.name][key] = subItem;
                                }
                            });
                            if (Object.keys(options).length === 0) {
                                console.error(`Invalid object configuration for non-randomized objects in UserDefinedItem: ${item.name}`);
                            }
                        }
                    }
                    break;
            }
        }
        ;
    });
    return { randomData, cacheImpact };
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
/** 🐺 Ver 1.2.0: Shotgun Mode 🐺
 *  1. 초(seconds) 단위 시간대 설정
 *  2. 설정 시간대 내에서, 이벤트 추적 함수가 설정한 횟수만큼 분산적으로 발동됨.
 *
 *  의의
 *
 *  - 현실적인 시나리오 모사:
 *  실제 사용자 활동은 동시에 일어나기보다는, 특정 시간대에 걸쳐 분산되어 발생합니다.
 *  샷건 모드를 통해 이러한 현실적인 사용자 활동 패턴을 모의할 수 있어,
 *  더 현실적인 테스트 환경을 구성하는 것이 가능합니다.
 *
 *  - 성능 테스트 강화:
 *  분산된 이벤트 발생은 서버와 클라이언트 측 성능에 대한 보다 정확한 테스트를 가능하게 합니다.
 *  이는 피크 시간 동안의 서버 부하 및 클라이언트 측 처리 능력을 평가하는 데 유용할 수 있습니다.
  */
//샷건 모드의 전역변수 설정
let shotgunMode = false;
let shotgunInterval = 1000; //default: 1 seconds
// 샷건 모드 및 설정 시간대 함수
export function setShotgunMode(enable, interval) {
    shotgunMode = enable;
    shotgunInterval = interval;
}
//샷건 모드 실행 함수
function executeEventsWithDelay(allEventData, callback) {
    const eventIds = Object.keys(allEventData);
    let index = 0;
    function nextEvent() {
        if (index < eventIds.length) {
            //설정한 시간 내에서, 설정한 이벤트 추적 횟수만큼, eventData를 담은 콜백함수 실행
            const eventId = eventIds[index];
            //'샷건 발포' 시, 시간 범위 내 랜덤하게 찍힌 타임스탬프들 측정: 콜백 함수 호출 시 현재 시간을 로깅
            //console.log('Executing event ${evemtId} at ${new Date().toISOString()}');
            callback({ [eventId]: allEventData[eventId] });
            index++;
            setTimeout(nextEvent, shotgunInterval);
            // } else {
            //     console.log('All events executed in shotgun mode');
        }
    }
    nextEvent();
}
//사용자 클릭 이벤트 리스너 추적 함수 Click Event Listener
export function trackClickEvent(event, eventType, includeLocalCustomData = false, includeGlobalCustomData = false, callback) {
    // eventData객체를 저장하기 위한 객체
    let allEventData = {};
    for (let i = 0; i < userDefinedClickCount; i++) { //설정한 클릭 횟수만큼 이벤트 데이터 객체 생성
        let eventData = {
            eventType: event.type,
            timestamp: getRandomTimestamp(),
            clickCount: i + 1, //각 이벤트에 대한 고유한 클릭 카운트 부여
        };
        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)
        if (includeLocalCustomData) {
            const localCustomDataList = getLocalCustomDataGroup(eventType);
            const { randomData, cacheImpact } = createRandomData(localCustomDataList);
            Object.assign(eventData, randomData);
            if (cacheImpact)
                eventData.cacheImpact = cacheImpact;
        }
        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)
        if (includeGlobalCustomData) {
            const { randomData, cacheImpact } = createRandomData(GlobalUserDefinedItems);
            Object.assign(eventData, randomData);
            if (cacheImpact)
                eventData.cacheImpact = cacheImpact;
        }
        const eventId = `${event.type}_${i + 1}`; // 고유 식별자 생성
        allEventData[eventId] = eventData; // 객체에 생성된 eventData 저장
    }
    // 샷건 모드 활성화 시,
    if (shotgunMode && callback) {
        executeEventsWithDelay(allEventData, callback);
    }
    else {
        // 샷건 모드 비활성화 시, 그냥 콜백 함수 호출
        if (callback) {
            callback(allEventData);
        }
    }
    console.log('Click Event Data:', allEventData);
}
//사용자 입력 키워드 이벤트 추적 함수 Keyword Event
export function trackKeywordEvent(keyword, eventType, includeLocalCustomData = false, includeGlobalCustomData = false, repeatCount = 1, callback) {
    // eventData객체를 저장하기 위한 객체
    let allEventData = {};
    for (let i = 0; i < userDefinedKeywordCount; i++) { //설정한 키워드 입력 횟수만큼 이벤트 데이터 객체 생성
        let eventData = {
            keyword: keyword,
            eventType: eventType,
            timestamp: getRandomTimestamp(),
            keywordCount: i + 1, //각 이벤트에 대한 고유한 키워드 카운트 부여
            repeatCount: repeatCount,
        };
        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)
        if (includeLocalCustomData) {
            const localCustomDataList = getLocalCustomDataGroup(eventType);
            const { randomData, cacheImpact } = createRandomData(localCustomDataList);
            if (cacheImpact)
                eventData.cacheImpact = cacheImpact;
            Object.assign(eventData, randomData);
        }
        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)
        if (includeGlobalCustomData) {
            const { randomData, cacheImpact } = createRandomData(GlobalUserDefinedItems);
            Object.assign(eventData, randomData);
            if (cacheImpact)
                eventData.cacheImpact = cacheImpact;
        }
        const eventId = `${eventType}_${i + 1}`; // 고유 식별자 생성
        allEventData[eventId] = eventData; // 객체에 eventData 저장
    }
    // 샷건 모드 활성화 시,
    if (shotgunMode && callback) {
        executeEventsWithDelay(allEventData, callback);
    }
    else {
        // 샷건 모드 비활성화 시, 그냥 콜백 함수 호출
        if (callback) {
            callback(allEventData);
        }
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
/**
 * 배열, 객체에서의 재귀 알고리즘 활용 방안
 * (주의: name, type, options 정의 및 설계를 정확히 하십시오.)

예시: 복합적인 유저 데이터

    const GlobalUserDefinedItems: UserDefinedItem[] = [
        {
            name: 'job',
            type: 'array',
            options:[
                        {
                            name: 'student',
                            type: 'array',
                            options: [
                                {
                                    name: 'age',
                                    type: 'number',
                                    options: [10, 30]
                                },
                                {
                                    name: 'salary',
                                    type: 'number',
                                    options: [8000, 20000]
                                    contextBasedOptions: (context) => {
                                        const rareCaseProbability = 0.01
                                        if (Math.random() < rareCaseProbability) {
                                            return [20000, 100000]; //Salary with 1% probability: 20000 to 100000
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name: 'developer',
                            type: 'array',
                            options: [
                                {
                                    name: 'age',
                                    type: 'number',
                                    distribution: 'normal',
                                    mean: 40,
                                    options: [20, 60]
                                },
                                {
                                    name: 'salary',
                                    type: 'number',
                                    contextBasedOptions: (context) => {
                                        // 나이에 따른 급여 범위 및 평균값 조정
                                        if (context.age < 30) {
                                            return {
                                                options: [20000, 40000],
                                                distribution: 'normal',
                                                mean: 27000
                                            };
                                        } else {
                                            return {
                                                options: [30000, 100000],
                                                distribution: 'normal',
                                                mean: 40000
                                            };
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name: 'accountant',
                            type: 'array',
                            options: [
                                {
                                    name: 'age',
                                    type: 'number',
                                    distribution: 'normal',
                                    mean: 40,
                                    options: [20, 60]
                                },
                                {
                                    name: 'salary',
                                    type: 'number',
                                    contextBasedOptions: (context) => {
                                        // 나이에 따른 급여 범위 및 평균값 조정
                                        if (context.age < 30) {
                                            return {
                                                options: [25000, 40000],
                                                distribution: 'normal',
                                                mean: 30000
                                            };
                                        } else {
                                            return {
                                                options: [30000, 100000],
                                                distribution: 'normal',
                                                mean: 40000
                                            };
                                        }
                                    }
                                }
                            ]
                        }
                    ],
            randomizeArrays: true,
            selectionProbability: true,
            probabilitySettings: [
                { identifier: 1, probability: 45 }, //(45% 확률로 developer 선택)
                { identifier: 2, probability: 45 }, //(45% 확률로 accountant 선택)
            ],
        },
        {
            name: 'favorite drinks',
            type: 'array',
            options: ['Americano', 'Latte', 'Cappuccino', 'Green Tea Latte'],
            randomizeArrays: true
        },
        {
            name: 'hobbies',
            type: 'object',
            options: { hobby1: 'reading', hobby2: 'gaming', hobby3: 'coding', hobby4: 'hiking' },
            randomizeObjects: true,
            objectSelectionCount: 3,
            randomizeSelectionCount: true
        },
        {
            name: 'cache-data',
            type: 'object',
            cacheSettings: {
                enableCacheSimulation: true,
                simulatedCacheSize: 1, // 1MB의 무의미한 텍스트 캐시 데이터
                simulatedDelay: 500 // 500ms 지연
            }
        }
    ];
*/
