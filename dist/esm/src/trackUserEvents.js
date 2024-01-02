// ./src/trackUserEvents.ts
export let userDefinedClickCount = 1;
export let userDefinedKeywordCount = 1;
export let startTime = new Date(); // initialize start time
export let endTime = new Date(); // initialize end time
//startTime - endTime 시간 범위 내에서 랜덤한 타임스탬프 생성
export function getRandomTimestamp(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
/** 확률 설정 함수: 배열, 객체의 각 항목에 확률을 설정 / 확률 설정하지 않은 나머지 항목들은 나머지 확률이 나뉘어서 균등하게 분배 */
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
    // 남은 확률 계산 및 할당 (지정되지 않은 항목(들)에 확률을 고르게 분배하여 할당)
    const remainingProbability = 100 - totalAssignedProbability;
    const numberOfUnassignedItems = probabilities.filter(p => p === 0).length;
    const probabilityForEachUnassignedItem = numberOfUnassignedItems > 0 ? remainingProbability / numberOfUnassignedItems : 0;
    probabilities = probabilities.map(p => p === 0 ? probabilityForEachUnassignedItem : p);
    return probabilities;
}
/** 세팅된 확률로 항목(들)을 선택하게 하는 함수 */
function applyProbabilityBasedSelection(options, probabilities) {
    let selectedOptions = [];
    let unselectedRandomOptions = [];
    options.forEach((option, index) => {
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
        const randomIndex = Math.floor(Math.random() * unselectedRandomOptions.length);
        selectedOptions.push(unselectedRandomOptions[randomIndex]);
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
            timestamp: getRandomTimestamp(startTime, endTime),
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
            timestamp: getRandomTimestamp(startTime, endTime),
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
/**시작 및 종료 시간 설정 함수:
 * 얘사: 2024-01-01 자정 ~ 오전 8시 사이의 랜덤한 타임스탬프를 생성하고 싶다면,
 * setTimestampRange(new Date('2024-01-01T00:00:00'), newDate('2024-01-01T08:00:00'));*/
export function setTimestampRange(start, end) {
    // start가 end보다 미래일 경우 에러 출력
    if (start.getTime() > end.getTime()) {
        console.error("Error: start date cannot be later than end date.");
        return;
    }
    startTime = start;
    endTime = end;
}
/**
 *
### 사용법 및 예상 결과

#### 1. 시작 및 종료 시간 설정

```javascript
setTimestampRange(new Date('2024-01-01T00:00:00'), new Date('2024-01-01T08:00:00'));
```

이 함수는 이벤트 타임스탬프를 생성할 때 사용되는 시간 범위를 설정합니다.
2024-01-01 자정 ~ 오전 8시 사이의 랜덤한 타임스탬프를 생성하고 싶다면, 위 코드처럼 설정하면 됩니다.


#### 2. 특정 키워드 생성 & 검색 횟수 조정

```javascript
setUserClickCount(3);
setUserKeywordCount(3);
```

이 함수들은 사용자가 클릭하거나 키워드를 생성/검색할 때마다 적용되는 카운트, 만들어지는 데이터 수를 설정합니다.


#### 3. 전역 커스텀 데이터 설정

```javascript
setGlobalUserDefinedItems([
    // 전역 커스텀 데이터 항목들
    { name: 'age', type: 'number', options: [10, 50], distribution: 'uniform'},
    { name: 'job', type: 'string', options: ['student', 'web developer', 'accountant'] },
    { name: 'salary', type: 'number', options: [25000, 100000], distribution: 'normal', mean: 36000, standardDeviation: (100000 - 25000) / 6 },
    { name: 'drinks', type: 'array', options: ['Americano', 'Latte', 'Cappuccino', 'Green Tea Latte'], randomizeArrays: true },
    { name: 'hobbies', type: 'object', options: { hobby1: 'reading', hobby2: 'gaming', hobby3: 'coding', hobby4: 'hiking' }, randomizeObjects: true }
]);
```

```javascript
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
                                options: [20, 60]
                            },
                            {
                                name: 'salary',
                                type: 'number',
                                distribution: 'normal',
                                mean: 50000,
                                options: [40000, 100000]
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
                                options: [20, 60]
                            },
                            {
                                name: 'salary',
                                type: 'number',
                                distribution: 'normal',
                                mean: 50000,
                                options: [40000, 100000]
                            }
                        ]
                    }
                ],
        randomizeArrays: true
        selectionProbability: true,
        probabilitySettings: [
                { identifier: 1, probability: 45 }, //(45% 확률로 developer 선택)
                { identifier: 2, probability: 45 }, //(45% 확률로 accountant 선택)
        ]
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
    }
];
```

#### 예상 결과:

전역 커스텀 데이터가 이벤트 데이터에 포함됩니다.
예를 들어, 사용자의 나이, 직업, 연봉, 선호 음료, 취미 등이 데이터에 포함될 수 있습니다.

```json
{
    "eventType": "click",
    "timestamp": "2024-01-01T19:40:47.615Z",
    "clickCount": 3,
    "job": [
        {
            "developer": [
                {
                    "age": 30
                },
                {
                    "salary": 55220
                }
            ]
        }
    ],
    "favorite drinks": [
        "Americano"
    ],
    "hobbies": {
        "hobby1": "reading",
        "hobby3": "coding"
    }
}
```


#### 4. 로컬 커스텀 데이터 그룹 설정

```javascript
setLocalCustomDataGroup('clickEventCategoryA', [
    { name: 'categoryA-specific', type: 'string', options: ['Option1', 'Option2'] }
]);
setLocalCustomDataGroup('clickEventCategoryB', [
    { name: 'categoryB-specific', type: 'number', options: [1, 10] }
]);
```


#### 5. 클릭 이벤트 리스너 설정/ 클릭 이벤트 추적 함수 사용

```javascript
document.getElementById('elementA').addEventListener('click', (event) => {
    trackClickEvent(event, 'clickEventCategoryA', true, false);
});
document.getElementById('elementB').addEventListener('click', (event) => {
    trackClickEvent(event, 'clickEventCategoryB', false, true);
});
```

#### 예상 결과:

elementA 클릭 시

로컬 커스텀 데이터(clickEventCategoryA 그룹에 정의된 데이터)가 클릭 이벤트 데이터에 포함되어 전송됩니다.
이 데이터는 trackClickEvent 함수의 세 번째 매개변수로 true를 지정하여 로컬 커스텀 데이터를 포함하도록 설정합니다.

```json
{
    "eventType": "click",
    "elementId": "elementA",
    "timestamp": "2024-01-01T02:30:00.000Z",
    "clickCount": 1,
    "localCustomData": {
        "categoryA-specific": "Option1"
    }
}
```

elementB 클릭 시

전역 커스텀 데이터(GlobalUserDefinedItems에 정의된 데이터)가 클릭 이벤트 데이터에 포함되어 전송됩니다.
이 데이터는 trackClickEvent 함수의 네 번째 매개변수로 true를 지정하여 전역 커스텀 데이터를 포함하도록 설정합니다.

```json
{
    "eventType": "click",
    "elementId": "elementB",
    "timestamp": "2024-01-01T03:45:00.000Z",
    "clickCount": 1,
    "globalCustomData": {
        "age": 30,
        "job": "accountant",
        "salary": 55000,
        "drinks": ["Cappuccino"],
        "hobbies": {"hobby1": "coding", "hobby2": "hiking"}
    }
}
```


#### 6. 키워드 이벤트 추적 함수 사용

키워드 이벤트 추적 함수

```javascript
function simulateKeywordEvent() {
    const keyword = "exampleKeyword";
    trackKeywordEvent(keyword, 'search', true, 1, true);
}

simulateKeywordEvent(); // 함수 호출로 키워드 이벤트 시뮬레이션
```

#### 예상 결과:

키워드 이벤트가 추적되며, 해당 이벤트에 관련된 데이터가 포함됩니다.

```json
{
    "keyword": "exampleKeyword",
    "eventType": "search",
    "timestamp": "2024-01-01T04:00:00.000Z",
    "keywordCount": 1,
    "repeatCount": 1,
    "age": 32,
    "job": "developer",
    "salary": 30000,
    "drinks": ["Green Tea Latte"],
    "hobbies": {"hobby1": "gaming"}
}
```


#### 7. 서버 데이터 저장

이벤트 추적 함수(trackClickEvent 또는 trackKeywordEvent)에 콜백 함수를 전달하여, 이벤트 데이터를 서버로 전송할 수 있습니다.
이 콜백 함수는 이벤트 데이터를 받아 서버 API 엔드포인트로 전송하는 로직을 포함합니다.

```javascript
// 예시: 클릭 이벤트 데이터를 서버로 전송하는 콜백 함수
const sendEventToServer = async (eventData) => {
    try {
        const response = await fetch('/api/save-event-data', {
            method: 'POST',
            body: JSON.stringify(eventData),
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error sending event data:', error);
    }
};

// 클릭 이벤트 추적 함수 호출 시 콜백 함수 전달
trackClickEvent(event, 'eventType', true, true, sendEventToServer);
```

예상 결과
위의 콜백 함수를 사용하여 이벤트 추적 시, 다음과 같은 흐름으로 데이터가 처리됩니다:

1. 사용자의 클릭 또는 키워드 입력 이벤트가 발생합니다.
2. trackClickEvent 또는 trackKeywordEvent 함수가 호출되며, 이벤트 데이터가 생성됩니다.
3. 생성된 이벤트 데이터는 콜백 함수 sendEventToServer로 전달됩니다.
4. sendEventToServer 함수는 이벤트 데이터를 JSON 형식으로 변환하여 서버의 API 엔드포인트(/api/save-event-data)로 POST 요청을 보냅니다.
5. 서버는 요청을 받아 처리하고, 데이터를 db.json 파일이나 다른 데이터 스토리지에 저장합니다.

이러한 프로세스는 사용자의 상호작용을 실시간으로 추적하고, 데이터를 중앙 서버에 저장하여 분석하는 데 사용될 수 있습니다.
예를 들어, 웹사이트 사용성 개선, 사용자 경험 분석, 사용자 행동에 대한 인사이트 획득 등에 활용할 수 있습니다.

데이터는 JSON 형식으로 저장되므로, 데이터 분석 도구나 대시보드에 쉽게 통합하여 시각화하고 분석할 수 있습니다.
예를 들어, Google Analytics, Google BigQuery, AWS QuickSight 등 다양한 플랫폼과의 통합이 가능합니다.


#### 종합

이러한 방식으로 사용자 이벤트 데이터를 추적하고 관련 데이터를 수집 및 분석할 수 있습니다.
해당 라이브러리는 웹사이트나 애플리케이션의 사용성 개선, 사용자 경험 최적화 등에 활용될 수 있습니다.
 */ 
