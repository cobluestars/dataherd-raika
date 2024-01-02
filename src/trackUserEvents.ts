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

//커스텀 데이터 항목 타입 Custom data type
export type UserDefinedItem = {
    name: string;
    type: 'number' | 'string' | 'boolean' | 'array' | 'object';
    distribution?: 'uniform' | 'normal'; //확률 분포 타입: uniform: 완전 랜덤, normal: 정규 분포(가우스 분포)
    mean?: number;  //평균값 설정 (디폴트: 중간값)
    standardDeviation?: number; //표준편차 설정 (디폴트: 6시그마)
    options?: number | string | number[] | string[] | UserDefinedItem[] | object;//options의 타입을 명시적으로 정의
    randomizeArrays?: boolean; //배열 항목의 랜덤 선택 여부 (디폴트: false)
    randomizeObjects?: boolean; //객체 항목의 랜덤 선택 여부 (디폴트: false)
    selectionProbability?: boolean; //'문자열 그룹', '배열', '객체' 항목의 랜덤 선택 시, 특정 항목(들)이 선택될 확률 임의 조정 여부 (디폴트: false)
    probabilitySetting?: ProbabilitySetting[]; // 확률 설정
    arraySelectionCount?: number; //배열에서 선택할 항목 수 (디폴트: 1)
    objectSelectionCount?: number; //객체에서 선택할 항목 수 (디폴트: 1)
    randomizeSelectionCount?: boolean; //선택한 항목 수 내에서 무작위 선택 여부
};

//확률 설정을 위한 타입
export type ProbabilitySetting = {
    identifier: number | string;    //배열/객체의 인덱스 혹은 항목명으로 확률 부여할 대상을 정함.
    probability: number;    //확률 부여 (0~100)
}

// 전역 커스텀 데이터들을 관리하기 위한 UserDefinedItem 배열
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

        //배열 & 객체의 항목들을 랜덤 선택 처리할 시, 선택 갯수 정의 
        const arraySelectionCount = item.arraySelectionCount ?? 1; // 기본값을 1로 설정
        const objectSelectionCount = item.objectSelectionCount ?? 1; // 기본값을 1로 설정

        //'문자열 그룹', '배열', '객체' 항목의 랜덤 선택 시, 특정 항목(들)이 선택될 확률 임의 조정 여부 (디폴트: false)
        const selectionProbability =  item.selectionProbability ?? false;  // 기본값: false

        //선택 갯수 내에서 무작위 선택 여부 (ex: 3개 선택 시 2개만 선택될 수 있음.)
        const randomizeSelectionCount = item.randomizeSelectionCount ?? false; // 기본값: false

        switch (item.type) {
            case 'number':
            //숫자 처리
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
            //문자열 처리
                if (typeof item.options === 'string') {
                    // 단일 문자열인 경우, 이를 디폴트 값으로 설정
                    randomData[item.name] = item.options;

                } else if(Array.isArray(item.options)) {
                    //문자열 배열인 경우
                    if(item.options.every(option => typeof option === 'string')) {
                        //랜덤하게 선택 
                        if(selectionProbability === true) {
                            //확률 기반 선택 적용
                            const probabilities = settingProbabilities(item.options, item.probabilitySetting || []);
                            const selectedOptions = applyProbabilityBasedSelection(item.options, probabilities);
                            randomData[item.name] = selectedOptions.length > 0 ? selectedOptions[0] : null;
                        } else {
                            //무작위 선택
                            randomData[item.name] = item.options[Math.floor(Math.random() * item.options.length)];
                        }
                    } else {
                        // 배열이지만 문자열만 포함하지 않는 경우
                        console.error(`Invalid format for 'string' type in UserDefinedItem: ${item.name}, options must be an array of strings`);
                    }
                } else {
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
                                    return createRandomData([subItem as UserDefinedItem]);
                                }
                                return subItem;
                            });
                        } else {
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
                    } else {
                        // 전체 요소 포함
                        randomData[item.name] = item.options.map(subItem => {
                            if (typeof subItem === 'object' && subItem !== null) {
                                // 배열 내부의 객체 또는 배열인 경우, 재귀적으로 createRandomData 호출
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
                        // 객체 속성의 랜덤 선택 처리
                        let selectedOptionKeys: string[] = [];
            
                        if (selectionProbability) {
                            // 확률 기반 선택 적용
                            const keys = Object.keys(options);
                            const probabilities = settingProbabilities(keys, item.probabilitySetting || [], true);
                            selectedOptionKeys = applyProbabilityBasedSelection(keys, probabilities) as string[];
  
                            // 선택된 속성 수가 objectSelectionCount를 초과하지 않도록 조정
                            selectedOptionKeys = selectedOptionKeys.slice(0, objectSelectionCount);
            
                            if (randomizeSelectionCount) {
                                // 선택 갯수 내에서 무작위 선택 적용
                                selectedOptionKeys = selectedOptionKeys.slice(0, Math.floor(Math.random() * selectedOptionKeys.length) + 1);
                            }
                        } else {
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
                            } else {
                                // 기본값으로 설정
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
        }
    });
    return randomData;
}

/** 확률 설정 함수: 배열, 객체의 각 항목에 확률을 설정 / 확률 설정하지 않은 나머지 항목들은 나머지 확률이 나뉘어서 균등하게 분배 */
function settingProbabilities(
    options: (number | string | object)[],
    settings: ProbabilitySetting[],
    isObject: boolean = false //객체일 경우 true    
): number[] {
    let probabilities: number[] = new Array(options.length).fill(0);
    let totalAssignedProbability = 0;

    // 객체 키 배열
    let keys: string[] = [];
    if (isObject) {
        keys = Object.keys(options as Record<string, any>);
    }

    // 지정된 확률 설정
    settings.forEach(setting => {
        let index = -1;
        if (isObject && typeof setting.identifier === 'number') {
            // 객체이고, identifier가 숫자일 경우 인덱스로 인식하여 처리
            if (setting.identifier < keys.length) {
                index = setting.identifier;
            }
        } else if (isObject && typeof setting.identifier === 'string') {
            // 객체이고, identifier가 문자열일 경우 키로 인식하여 처리
            index = keys.indexOf(setting.identifier);
        } else if (!isObject) {
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
function applyProbabilityBasedSelection(
    options: ( string | number | object )[],
    probabilities: number[]
): ( string | number | object )[] {
    let selectedOptions: ( string | number | object )[] = [];
    let unselectedRandomOptions: ( string | number | object )[] = [];

    options.forEach((option, index) => {
        if (Math.random() * 100 < probabilities[index]) {
            selectedOptions.push(option);
        } else if (probabilities[index] === 0) {
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
        }
    ];
*/


//클릭 이벤트 관련 콜백 함수의 타입 정의
export type ClickEventDataCallback = (eventData: { [key: string]: ClickEventData }) => void;

//사용자 클릭 이벤트 리스너 추적 함수 Click Event Listener
export function trackClickEvent(
    event: Event,
    eventType: string,
    includeLocalCustomData: boolean = false, 
    includeGlobalCustomData: boolean = false, 
    callback?: ClickEventDataCallback
    ): void {
    
    // eventData객체를 저장하기 위한 객체
    let allEventData: {[key: string]: ClickEventData} = {};
    
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

        const eventId = `${event.type}_${i + 1}`;  // 고유 식별자 생성
        allEventData[eventId] = eventData;  // 객체에 생성된 eventData 저장
    }
    
    // 콜백 함수 호출
    if (callback) {
        callback(allEventData);
    }

    console.log('Click Event Data:', allEventData);
}

//키워드 이벤트 관련 콜백 함수의 타입 정의
export type KeywordEventDataCallback = (eventData: { [key: string]: KeywordEventData }) => void;

//사용자 입력 키워드 이벤트 추적 함수 Keyword Event
export function trackKeywordEvent(
    keyword: string, 
    eventType: string, 
    includeLocalCustomData: boolean = false,  
    includeGlobalCustomData: boolean = false,
    repeatCount: number = 1, 
    callback?: KeywordEventDataCallback
    ): void {
    
    // eventData객체를 저장하기 위한 객체
    let allEventData: {[key: string]: KeywordEventData} = {};
    
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

        const eventId = `${eventType}_${i + 1}`;  // 고유 식별자 생성
        allEventData[eventId] = eventData;  // 객체에 eventData 저장
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