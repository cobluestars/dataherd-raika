// ./src/trackUserEvents.ts
export let userDefinedClickCount = 1;
export let userDefinedKeywordCount = 1;
export let startTime: Date = new Date(); // initialize start time
export let endTime: Date = new Date(); // initialize end time

//startTime - endTime 시간 범위 내에서 랜덤한 타임스탬프 생성
export function getRandomTimestamp(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

//사용자 클릭 이벤트 데이터 인터페이스 User Click Event Data interface
export interface ClickEventData {
    eventType: string;
    timestamp: Date;
    clickCount: number; // 사용자 정의 가능한 클릭 횟수
}

//사용자 입력 키워드 이벤트 데이터 인터페이스 User Keyword Event Data interface
export interface KeywordEventData {
    keyword: string;
    eventType: string;
    timestamp: Date;
    keywordCount: number; // 사용자 정의 가능한 키워드 생성 & 검색 횟수
    repeatCount: number; // 같은 키워드의 반복 횟수 (디폴트: 1)
}

//사용자 정의 데이터 항목 타입 Custom data type
export type UserDefinedItem = {
    name: string;
    type: 'number' | 'string' | 'boolean' | 'array' | 'object';
    distribution?: 'uniform' | 'normal'; //확률 분포 타입: uniform: 완전 랜덤, normal: 정규 분포(가우스 분포)
    mean?: number;  //평균값 설정 (디폴트: 중간값)
    standardDeviation?: number; //표준편차 설정 (디폴트: 6시그마)
    options?: number | string | number[] | string[] | boolean[] | UserDefinedItem[] | Record<string, any>;//options의 타입을 명시적으로 정의
    randomizeArrays?: boolean; //배열 항목의 랜덤 선택 여부 (디폴트: false)
    randomizeObjects?: boolean; //객체 항목의 랜덤 선택 여부 (디폴트: false)
    arraySelectionCount?: number; //배열에서 선택할 항목 수 (디폴트: 1)
    objectSelectionCount?: number; //객체에서 선택할 항목 수 (디폴트: 1)
    randomizeSelectionCount?: boolean; //선택한 항목 수 내에서 무작위 선택 여부
};

// 전역 커스텀 데이터를 위한 UserDefinedItem 배열 (전역으로 데이터 설정)
export let GlobalUserDefinedItems: UserDefinedItem[] = [];

// 로컬 커스텀 데이터 그룹 (다양한 '로컬 커스텀 데이터'들의 그룹) 타입
type LocalCustomDataGroup = Record<string, UserDefinedItem[]>;

// 다양한 로컬 커스텀 데이터 그룹들을 관리하기 위한 '객체' 
const localCustomDataGroups: LocalCustomDataGroup = {};

// 전역 커스텀 데이터 설정 함수
export function setGlobalUserDefinedItems(items: UserDefinedItem[]): void {
    GlobalUserDefinedItems = items;
}

// 로컬 커스텀 데이터 그룹 설정 함수
export function setLocalCustomDataGroup(eventType: string, items: UserDefinedItem[]): void {
   localCustomDataGroups[eventType] = items; 
}

//로컬 커스텀 데이터 그룹 반환 함수
export function getLocalCustomDataGroup(eventType: string): UserDefinedItem[] {
    return localCustomDataGroups[eventType] || [];
}

//정규 분포(가우스 분포) 랜덤 숫자 생성 함수
export function gaussianRandom(mean: number, standardDeviation: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num * standardDeviation + mean;   //평균 및 표준편차 조정
    return num;
}

//랜덤 데이터 생성 함수
export function createRandomData(items: UserDefinedItem[]): Record<string, any> {
    let randomData: Record<string, any> = {};

    items.forEach(item => {
        //배열 & 객체의 항목들에 대한 랜덤 처리 여부
        const randomizeArrays = item.randomizeArrays?? false; // 기본값: false
        const randomizeObjects = item.randomizeObjects?? false; // 기본값: false

        //배열 & 객체의 항목들을 랜덤 처리할 시, 선택 갯수 정의 
        const arraySelectionCount = item.arraySelectionCount ?? 1; // 기본값을 1로 설정
        const objectSelectionCount = item.objectSelectionCount ?? 1; // 기본값을 1로 설정

        //선택 갯수 내에서 무작위 선택 여부 (ex: 3개 선택 시 2개만 선택될 수 있음.)
        const randomizeSelectionCount = item.randomizeSelectionCount ?? false; // 기본값: false

        switch (item.type) {
            case 'number':
                //단일 숫자일 경우, 이를 디폴트 값으로 설정
                if (typeof item.options === 'number') {
                    randomData[item.name] = item.options;
                }
                //숫자 범위가 [ n, m ] 배열 형태로 주어질 경우, 그 확률이 '무작위' 혹은 '정규 분포'를 따르도록 설정
                else if(Array.isArray(item.options) && item.options.length === 2) {
                    const [min, max] = item.options;
                    // 확률분포 디폴트 설정: 'uniform' (완전 랜덤)
                    const distribution = item.distribution != null ? item.distribution : 'uniform';
                    // 평균값의 디폴트 설정: 중간값
                    const mean = item.mean != null ? item.mean : (min + max) / 2;
                    // 표준편차의 디폴트 설정: 6시그마
                    const standardDeviation = item.standardDeviation != null ? item.standardDeviation : (max - min) / 6;

                    if (distribution === 'uniform') {   //완전 랜덤
                        randomData[item.name] = Math.floor(Math.random() * (max - min + 1)) + min;
                    } else if (distribution === 'normal') {     //정규 분포(가우스 분포)
                        let normalValue = gaussianRandom(mean, standardDeviation);
                        //결과값을 범위 내로 조정
                        normalValue = Math.max(min, Math.min(max, normalValue));
                        randomData[item.name] = Math.floor(normalValue);
                    }
                } else {
                    console.error(`Invalid format for 'number' type in UserDefinedItem: ${item.name}`);
                }
                break;
            case 'string':
                if (typeof item.options === 'string') {
                    // 단일 문자열인 경우, 이를 디폴트 값으로 설정
                    randomData[item.name] = item.options;
                } else if(Array.isArray(item.options)) {
                    //문자열 배열이 주어진 경우 랜덤하게 선택
                    randomData[item.name] = item.options[Math.floor(Math.random() * item.options.length)];
                } else {
                    console.error(`Invalid format for 'string' type in UserDefinedItem: ${item.name}`);
                }
                break;
            case 'boolean':
                randomData[item.name] = Math.random() < 0.5;
                break;
            case 'array':
                // 배열 처리
                if (Array.isArray(item.options) && item.options.length > 0) {
                    if (randomizeArrays) {
                        // 랜덤 요소 선택
                        let selectedCount = arraySelectionCount;
                        // 선택 갯수 내에서 갯수 무작위 선택
                        if (randomizeSelectionCount) {
                            selectedCount = Math.floor(Math.random() * selectedCount) + 1;
                        }
                        const shuffled = [...item.options].sort(() => 0.5 - Math.random()); //배열을 무작위로 섞음
                        randomData[item.name] = shuffled.slice(0, selectedCount).map(subItem => { //선택된 요소들만 포함됨
                            // 배열의 각 요소가 또 다른 배열이나 객체일 경우, 재귀적으로 처리
                            if (Array.isArray(subItem) || (typeof subItem === 'object' && subItem !== null)) {
                                return createRandomData([subItem]);
                            }
                            return subItem;
                        });
                    } else {
                        // 전체 요소 포함
                        randomData[item.name] = item.options.map(subItem => {
                            // 배열의 각 요소가 또 다른 배열이나 객체인 경우, 재귀적으로 처리
                            if (Array.isArray(subItem) || (typeof subItem === 'object' && subItem !== null)) {
                                return createRandomData([subItem]);
                            }
                            return subItem;
                        });
                    }
                } else {
                    console.error(`Invalid format for 'array' type in UserDefinedItem: ${item.name}`);
                }
                break;
            case 'object':
            // 객체 처리
                // 타입 단언 사용, item.options가 Record<string, any>(객체 속성 string, 프로퍼티 any)인지 확인
                if (typeof item.options === 'object' && item.options !== null && !Array.isArray(item.options)) {
                    const options = item.options as Record<string, any>;

                    if (randomizeObjects) {
                        // 랜덤 속성 선택
                        // 랜덤하게 선택할 키의 수를 결정
                        let selectedCount = objectSelectionCount;
                        // 선택 갯수 내에서 갯수 무작위 선택
                        if (randomizeSelectionCount) {
                            selectedCount = Math.floor(Math.random() * selectedCount) + 1;
                        }
                        // 객체의 키를 배열로 변환하고, 무작위로 섞음
                        const keys = Object.keys(options);
                        const shuffledKeys = keys.sort(() => 0.5 - Math.random());
                        // 선택된 키에 해당하는 속성만 포함하는 새 객체 생성
                        const selectedOptions: Record<string, any> = shuffledKeys.slice(0, selectedCount).reduce((acc, key) => {
                            acc[key] = options[key];
                            return acc;
                        }, {} as Record<string, any>); //selectedOptions에도 타입 단언을 추가 사용                        

                        // 선택된 속성들에 대해 처리
                        Object.keys(selectedOptions).forEach(key => {
                            const subItem = selectedOptions[key];
                            if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {
                                // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출
                                randomData[item.name] = randomData[item.name] || {};
                                randomData[item.name][key] = createRandomData([subItem]);
                            } else {
                                randomData[item.name] = randomData[item.name] || {};
                                randomData[item.name][key] = subItem;
                            }
                        });
                    } else {
                        // 전체 속성 포함
                        Object.keys(options).forEach(key => {
                            const subItem = options[key];  
                            if (subItem && typeof subItem === 'object' && 'name' in subItem && 'type' in subItem) {
                                // subItem이 UserDefinedItem 타입인 경우, 재귀적으로 createRandomData 호출
                                randomData[item.name] = randomData[item.name] || {};
                                randomData[item.name][key] = createRandomData([subItem]);
                            } else {
                                // 기본값으로 설정
                                randomData[item.name] = randomData[item.name] || {};
                                randomData[item.name][key] = subItem;
                            }
                        });
                    }
                } else {
                    console.error(`Invalid format for 'object' type in UserDefinedItem: ${item.name}`);
                }
                break;

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
                 */
        }
    });

    return randomData;
}

//클릭 이벤트 관련 콜백 함수의 타입 정의
export type ClickEventDataCallback = (eventData:ClickEventData[]) => void;

//사용자 클릭 이벤트 리스너 추적 함수 Click Event Listener
export function trackClickEvent(
    event: Event,
    eventType: string,
    includeLocalCustomData: boolean = false, 
    includeGlobalCustomData: boolean = false, 
    callback?: ClickEventDataCallback
    ): void {
    
    // eventData객체를 저장하기 위한 배열
    let allEventData: ClickEventData[] = [];    //타입 명시
    
    for (let i = 0; i < userDefinedClickCount; i++) {   //설정한 클릭 횟수만큼 이벤트 데이터 객체 생성
        const localCustomDataList = getLocalCustomDataGroup(eventType);

        const eventData: ClickEventData = {
            eventType: event.type,
            timestamp: getRandomTimestamp(startTime, endTime),
            clickCount: i + 1,  //각 이벤트에 대한 고유한 클릭 카운트 부여
        };

        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)
        if (includeLocalCustomData && localCustomDataList.length > 0) {
            const localCustomData = createRandomData(localCustomDataList)
            Object.assign(eventData, localCustomData);
        }

        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)
        if (includeGlobalCustomData) {
            //customData 생성
            const globalCustomData = createRandomData(GlobalUserDefinedItems);
            Object.assign(eventData, globalCustomData);
        }

        //생성된 eventData를 배열에 추가
        allEventData.push(eventData);
    }
    
    // 콜백 함수 호출
    if (callback) {
        callback(allEventData);
    }

    console.log('Click Event Data:', allEventData);
}

//키워드 이벤트 관련 콜백 함수의 타입 정의
export type KeywordEventDataCallback = (eventData:KeywordEventData[]) => void;

//사용자 입력 키워드 이벤트 추적 함수 Keyword Event
export function trackKeywordEvent(
    keyword: string, 
    eventType: string, 
    includeLocalCustomData: boolean = false,  
    includeGlobalCustomData: boolean = false,
    repeatCount: number = 1, 
    callback?: KeywordEventDataCallback
    ): void {
    
    // eventData객체를 저장하기 위한 배열
    let allEventData: KeywordEventData[] = [];  //타입 명시
    
    for (let i = 0; i < userDefinedKeywordCount; i++) {   //설정한 키워드 입력 횟수만큼 이벤트 데이터 객체 생성
        const localCustomDataList = getLocalCustomDataGroup(eventType);

        const eventData: KeywordEventData = {
            keyword: keyword,
            eventType: eventType,
            timestamp: getRandomTimestamp(startTime, endTime),
            keywordCount: i + 1,  //각 이벤트에 대한 고유한 키워드 카운트 부여
            repeatCount: repeatCount,
        };

        // localCustomData를 조건부로 추가 (특정 요소에서 추출하고자 하는 커스텀 클릭 이벤트 데이터 그룹)
        if (includeLocalCustomData && localCustomDataList.length > 0) {
            const localCustomData = createRandomData(localCustomDataList)
            Object.assign(eventData, localCustomData);
        }

        // includeGlobalCustomData를 조건부로 추가 (프로젝트 전역에서 추출하고자 하는 커스텀 클릭 이벤트 데이터)
        if (includeGlobalCustomData) {
            //customData 생성
            const globalCustomData = createRandomData(GlobalUserDefinedItems);
            Object.assign(eventData, globalCustomData);
        }
        //생성된 eventData를 배열에 추가
        allEventData.push(eventData);
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
export function setUserClickCount(ClickEventCount: number): void {
    if(ClickEventCount >= 1 && ClickEventCount <= Number.MAX_SAFE_INTEGER) {
        userDefinedClickCount = ClickEventCount;
    } else {
        console.error(`Invalid Click Count. Please enter a number between 1 and ${Number.MAX_SAFE_INTEGER}. Default value 1 will be set.`);
        userDefinedClickCount = 1; // Set a default value 1
    }
}

/**특정 키워드 생성 & 검색 횟수를 사용자가 직접 조정할 수 있는 함수:
 * * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)
 * setUserKeywordCount(100): 키워드 생성 & 검색 횟수 100회로 설정*/
export function setUserKeywordCount(KeywordEventCount: number): void {
    if(KeywordEventCount >= 1 && KeywordEventCount <= Number.MAX_SAFE_INTEGER) {
        userDefinedKeywordCount = KeywordEventCount;
    } else {
        console.error(`Invalid Keyword Count. Please enter a number between 1 and ${Number.MAX_SAFE_INTEGER}. Default value 1 will be set.`);
        userDefinedKeywordCount = 1; // Set a default value 1
    }
}

/**시작 및 종료 시간 설정 함수: 
 * 얘사: 2024-01-01 자정 ~ 오전 8시 사이의 랜덤한 타임스탬프를 생성하고 싶다면,
 * setTimestampRange(new Date('2024-01-01T00:00:00'), newDate('2024-01-01T08:00:00'));*/
export function setTimestampRange(start: Date, end: Date): void {
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