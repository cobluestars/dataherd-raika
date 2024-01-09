# 🐺dataherd-raika🐺

![dataherd-raika](https://raw.githubusercontent.com/cobluestars/dataherd-raika/main/assets/dataherd-raika.png)


"Dataherd-raika는 대규모 사용자 행동 데이터셋을 시뮬레이션하기 위해 설계된 라이브러리입니다. 하나의 사용자 이벤트(예: 클릭 또는 키워드 입력)를 취하여 간단한 확률 분포와 사용자 정의 변수를 적용, 광범위한 데이터셋으로 확장합니다."

<br/>

"Dataherd-Raika is a cutting-edge library designed to simulate large-scale user behavior datasets. It takes a single user event (like a click or keyword input) and, by applying simple probability distributions and custom variables, expands it into a vast dataset."

<br/>
<br/>

### 🐺 Ver 1.2.0: Shotgun Mode 🐺

<br/>

```javascript

import { setShotgunMode } from 'dataherd-raika';

setShotgunMode(true, 3000);
// 3초의 시간대에 걸쳐서, 이벤트 추적 함수가 설정한 횟수만큼 분산적으로 발동됨.
// Event tracking functions are triggered in a distributed manner over a period of 3 seconds.

```

<br/>

    1. 초(seconds) 단위 시간대 설정
    2. 설정 시간대 내에서, 이벤트 추적 함수가 설정한 횟수만큼 분산적으로 발동됨.

<br/>

    1. Timeframe set in seconds
    2. Within the set timeframe, event tracking functions are triggered in a distributed manner as many times as set.

<br/>
<br/>

    ＊ 현실적인 시나리오 모사:

    - 실제 사용자 활동은 동시에 일어나기보다는, 특정 시간대에 걸쳐 분산되어 발생합니다.
    - 샷건 모드를 통해 이러한 현실적인 사용자 활동 패턴을 모의할 수 있어,
    더 현실적인 테스트 환경을 구성하는 것이 가능합니다.
 
<br/>

    * 성능 테스트 강화:

    - 분산된 이벤트 발생은 서버와 클라이언트 측 성능에 대한 보다 정확한 테스트를 가능하게 합니다.
    - 이는 피크 시간 동안의 서버 부하 및 클라이언트 측 처리 능력을 평가하는 데 유용할 수 있습니다.

<br/>

    * Realistic Scenario Simulation:

    - Real user activities occur distributed over a certain period of time rather than simultaneously.
    - Shotgun mode allows for the simulation of these realistic user activity patterns, enabling the creation of a more realistic testing environment.

<br/>

    * Enhanced Performance Testing:

    - The distributed occurrence of events allows for more accurate testing of server and client-side performance.
    - This can be useful for evaluating server load and client-side processing capabilities during peak times.

<br/>
<br/>

#### ❗❗❗ 주의 ❗❗❗

    - 샷건 모드로 인해 실제 이벤트 처리에 지연이 생겨, 사용자 이벤트 데이터가 제대로 저장되지 않을 수도 있습니다.
    - 샷건 모드를 사용할 시, 이 점 유념하여 신중하게 사용하시길 바랍니다.
    - 샷건 모드에서는 이벤트 처리가 비동기적으로 이루어지기 때문에, 이벤트가 예상대로 순차적으로 처리되지 않거나, 다른 비동기 프로세스와의 타이밍 문제로 인해 데이터가 올바르게 저장되지 않을 수 있습니다.

<br/>

#### ❗❗❗ Caution ❗❗❗

    - The use of shotgun mode may cause delays in actual event processing, leading to user event data not being properly saved.
    - Please use caution when using shotgun mode, keeping this in mind.
    - In shotgun mode, event processing occurs asynchronously, meaning events may not be processed sequentially as expected or data may not be saved correctly due to timing issues with other asynchronous processes.

<br/>
<br/>

## 🐺사용법 & 예상 결과: How to Use & Expected Results🐺

<br/>

### 1. 시작 및 종료 시간, 피크 타임 설정: Setting Start and End Time, Peak Times

<br/>

### 사용법: How To Use

<br/>

#### TimestampSettings 객체 정의: Defining the TimestampSettings Object

<br/>

```typescript

type TimestampSettings = {
    startTime: string;
    endTime: string;
    peakTimes?: string[][];
    peakTimeWeight: number;    //Peak Time Weight: (Default: * 1.6)
};

// TimestampSettings 객체 초기화
const timestampSettings: TimestampSettings = {
    startTime: '2024-01-01T00:00:00',
    endTime: '2024-01-01T08:00:00',
    peakTimes: [
        ['2024-01-01T02:00:00', '2024-01-01T03:00:00'],
        ['2024-01-01T05:00:00', '2024-01-01T06:00:00']
    ],
    peakTimeWeight: 2   //Peak Time Weight
};

```
<br/>

- startTime과 endTime은 이벤트 타임스탬프 생성에 사용되는 시작 및 종료 시간을 정의합니다.

- peakTimes는 특정 시간대에 타임스탬프 생성 확률을 높이기 위한 설정입니다. 각 피크 타임은 시작 및 종료 시간의 문자열 배열로 정의됩니다.

- 위 예시에서는 2024년 1월 1일 자정부터 오전 8시 사이에 타임스탬프를 생성하도록 설정하며, 오전 2시부터 3시, 그리고 5시부터 6시 사이에 타임스탬프 생성 확률이 2배 높아지도록 피크 타임을 설정합니다.

- 🐺 Ver 1.2.5: 피크타임 가중치 조정 🐺: 웬만하면 위 예시처럼 피크타임을 startTime ~ endTime 사이에서 균등하게 분배해 주세요. 특정 시간대에 몰아서 피크 타임을 설정할 시, 가중치가 비정상적으로 높아집니다. 추후 해당 문제를 해결해보도록 하겠습니다.

<br/>

- startTime and endTime define the start and end times for generating event timestamps.

- peakTimes is an optional setting to increase the probability of generating timestamps during specific time intervals. Each peak time interval is defined by an array of start and end time strings.

- In the example above, the timestamp will be generated between midnight and 8 AM on January 1, 2024, with increased probability (twice) of generating timestamps between 4 AM to 6 AM and 7 AM to 8 AM.

- 🐺 Version 1.2.5: Adjusted Peak Time Weight 🐺: Whenever possible, please distribute peak times evenly between the start time and end time. Setting peak times concentrated in specific time periods can result in abnormally high weightings. I will look into resolving this issue in the future.

<br/>

#### 시간 설정 초기화 함수: Initialize Timestamp Settings

<br/>

```javascript

import { initializeTimestampSettings } from 'dataherd-raika';

// 시간 설정 초기화 함수 호출
initializeTimestampSettings(timestampSettings);

```
<br/>

- 이 함수는 TimestampSettings 객체를 사용하여 타임스탬프 생성에 필요한 시간 설정을 초기화합니다.

<br/>

- This function initializes the timestamp creation settings using the TimestampSettings object.

<br/>

#### 랜덤 타임스탬프 생성 함수: Generating a Random Timestamp

```javascript

import { getRandomTimestamp } from 'dataherd-raika';

const timestamp = getRandomTimestamp();

```

<br/>

- 이 함수는 설정된 시간 범위 내에서 랜덤 타임스탬프를 생성합니다.

- 설정된 피크 타임이 있다면, 해당 시간대에 타임스탬프가 생성될 확률이 더 높습니다.

- 이벤트 추적 함수 trackClickEvent, trackKeywordEvent를 사용할 경우, 두 함수들에 getRandomTimestamp 함수의 호출이 내장되어 있으므로, 특별한 경우가 아니라면 해당 함수는 호출하지 않아도 됩니다.

<br/>

- This function generates a random timestamp within the configured time range.

- If peak times are set, there is a higher probability of generating a timestamp during those intervals.

- When using event tracking functions such as 'trackClickEvent' and 'trackKeywordEvent', calls to 'getRandomTimestamp' are built into these functions, so there is usually no need to call it separately.

<br/>

### 예상 결과: Expected Results

<br/>

- getRandomTimestamp 함수는 initializeTimestampSettings 함수를 통해 설정된 시간 범위 및 피크 타임에 따라 랜덤 타임스탬프를 생성합니다.

- 설정된 피크 타임이 있을 경우, 해당 시간대에 타임스탬프가 생성될 확률이 높아집니다.

- 피크 타임이 없거나 유효하지 않은 경우, 설정된 시간 범위 내에서 균등하게 랜덤 타임스탬프가 생성됩니다.

<br/>

- The getRandomTimestamp function generates random timestamps according to the time range and peak times set by the initializeTimestampSettings function.

- If peak times are set, there is a higher probability of generating timestamps during those specific intervals.

- If there are no peak times set or if they are not valid, timestamps are generated uniformly within the configured time range.

<br/>
<br/>

### 2. 클릭 이벤트 & 특정 키워드 이벤트 횟수 조정: Adjusting Click Event & Specific Keyword Event Counts

```javascript

import { setUserClickCount,setUserKeywordCount } from 'dataherd-raika';

setUserClickCount(25);
setUserKeywordCount(25);

```

<br/>

- 이 함수들은 사용자가 클릭하거나, 키워드를 생성/검색할 때마다, 적용되는 카운트, 만들어지는 데이터 수를 설정합니다.

<br/>

- These functions set the count of data generated each time a user clicks or creates/searches a keyword.

<br/>
<br/>

### 3. 커스텀 데이터 설정: Setting Custom Data

```typescript

//커스텀 데이터 항목 타입, Custom data type
type UserDefinedItem = {
    
    name: string; // 항목명: 데이터 항목 이름을 정합니다.
                  // Item Name: Set the name of the data item.

    type: 'number' | 'string' | 'boolean' | 'array' | 'object'; // 타입: 숫자 / 문자 / boolean / 배열 / 객체
                                                                // Type: Number / String / Boolean / Array / Object

    ❗ type: 'number';   // 1 ~ 10 사이에서 랜덤한 값이 선택됩니다. distribution, mean, standardDeviation 옵션을 사용할 수 있습니다.
    ❗ options: [1, 10]; // Random value is selected between 1 and 10. The distribution, mean, and standard deviation options are available.

    distribution?: 'uniform' | 'normal'; //확률 분포 타입: uniform: 완전 랜덤, normal: 정규 분포(가우스 분포)
                                        // Distribution Type: Uniform: Completely random, Normal: Gaussian distribution

    mean?: number;  //평균값 설정 (디폴트: 중간값),
                    // Mean: Set the average value (default: median)
    
    standardDeviation?: number; //표준편차 설정 (디폴트: 6시그마),
                                // Standard Deviation: Set the standard deviation (default: 6 sigma)
    
    options?: number | string | number[] | string[] | UserDefinedItem[] | object; //options의 타입을 명시적으로 정의 
                                                                                  //Explicitly define the type of options

    randomizeArrays?: boolean; //배열 항목의 랜덤 선택 여부 (디폴트: false)
                               //Whether to randomly select array items (default: false)
                               
    randomizeObjects?: boolean; //객체 항목의 랜덤 선택 여부 (디폴트: false)
                                //Whether to randomly select object items (default: false)

    selectionProbability?: boolean; //'문자열 그룹', '배열', '객체' 항목의 랜덤 선택 시, 특정 항목(들)이 선택될 확률 조정 여부 (디폴트: false)
                                    //Adjust the probability of selecting certain items during random selection of 'string group', 'array', 'object' items (default: false)
    
    probabilitySetting?: ProbabilitySetting[]; // selectionProbability: true일 시, 특정 항목(들)의 확률 설정 
                                               // When selectionProbability is true, set the probability of specific items

    arraySelectionCount?: number; //배열에서 선택할 항목 수 (디폴트: 1) 
                                  //Number of items to select from an array (default: 1)

    objectSelectionCount?: number; //객체에서 선택할 항목 수 (디폴트: 1) 
                                   //Number of items to select from an object (default: 1)

    randomizeSelectionCount?: boolean; //선택한 항목 수 내에서 무작위 선택 여부 (ex: 선택 항목: 3일 시, 1개 ~ 3개의 항목이 선택될 수 있음.) (디폴트: 1)
                                       // Whether to randomly select within the chosen number of items 
                                       // (e.g., If selection items: 3, then 1 to 3 items can be selected.) (default: 1)

    /** 🐺 Ver 1.1.0: 캐시 데이터 설정을 위한 타입
     *                Type for Cache Data Settings 🐺 */

    cacheSettings?: CacheDataSettings; // 캐시 데이터 설정
                                       // Cache Data Settings
                                   
};

// 확률 설정을 위한 타입
// Type for Probability Setting
type ProbabilitySetting = {
    identifier: number | string;    //배열/객체의 인덱스 혹은 항목명으로 확률 부여할 대상을 정함.
                                    // Identifies the target for probability assignment by array/object index or item name.
    probability: number;    //확률 부여 (0~100)
                            // Probability assignment (0~100)
}

/**🐺 Ver 1.1.0: 캐시 데이터 시뮬레이션 설정을 위한 타입
 *               Type for Cache Data Simulation Settings 🐺*/

type CacheDataSettings = {
    enableCacheSimulation: boolean; // 캐시 데이터 시뮬레이션 활성화 여부
                                    // Whether to enable cache data simulation
    simulatedCacheSize: number;     // 시뮬레이션 캐시 데이터의 크기 (예: MB 단위)
                                    // Size of simulated cache data (e.g., in MB)
    simulatedDelay: number;         // 데이터 처리 시 인위적인 지연 시간 (예: 밀리초 단위)
                                    // Artificial delay time in data processing (e.g., in milliseconds)
};
```

<br/>

### 사용법: How To Use

❗주의: name, type, options, 확률 정의 및 설계를 정확히 하십시오.❗

<br/>

❗Caution: Ensure the definition and design of name, type, options, and probability are accurate.❗

<br/>

```typescript

import { UserDefinedItem } from 'dataherd-raika';

const UserDefinedItems: UserDefinedItem[] = [
    // 전역 커스텀 데이터 항목들
    { name: 'age', type: 'number', options: [10, 50], distribution: 'uniform'},
    { name: 'job', type: 'string', options: ['student', 'web developer', 'accountant'] },
    { name: 'salary', type: 'number', options: [25000, 100000], distribution: 'normal', mean: 36000, standardDeviation: (100000 - 25000) / 6 },
    { name: 'drinks', type: 'array', options: ['Americano', 'Latte', 'Cappuccino', 'Green Tea Latte'], randomizeArrays: true },
    { name: 'hobbies', type: 'object', options: { hobby1: 'reading', hobby2: 'gaming', hobby3: 'coding', hobby4: 'hiking' }, randomizeObjects: true }
]);
```

```typescript

import { UserDefinedItem } from 'dataherd-raika';

const UserDefinedItems: UserDefinedItem[] = [
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
            { identifier: 0, probability: 10 }, //(10%: student)
            { identifier: 1, probability: 45 }, //(45%: developer)
            { identifier: 2, probability: 45 }, //(45%: accountant)
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

    /** 🐺 Ver 1.1.0 🐺: 캐시 데이터 & 시간 지연 로직 추가
                          Added Cache Data & Time Delay Logic */
    {
        name: 'cache-data',
        type: 'object',
        cacheSettings: {
            enableCacheSimulation: true,
            simulatedCacheSize: 1, // 1MB의 무의미한 텍스트 캐시 데이터
                                   // 1MB of nonsensical text cache data
            simulatedDelay: 500    // 500ms 지연
                                   // 500ms delay
        }
    }
];
```
<br/>

### 예상 결과: Expected Results

- 커스텀 데이터가 이벤트 데이터에 포함됩니다. 예를 들어, 사용자의 나이, 직업, 연봉, 선호 음료, 취미, 캐시 데이터 등이 데이터에 포함될 수 있습니다.

<br/>

- Custom data is included in the event data. For example, user information such as age, job, salary, preferred drinks, hobbies, and cache-data can be included in the data.

```json
{
    "eventType": "click",
    "timestamp": "2024-01-01T19:40:47.615Z",
    "cacheImpact": {
        "simulatedCacheDelay_ms": 91.29999995231628, // 캐시 데이터에 의해 지연된 시간 (ms)
                                                    // Time delayed due to cache data (ms)
        "simulatedCacheSize_MB": 1,                  // 캐시 데이터 크기 (MB)
                                                    // Cache data size (MB)
        "simulatedDelay_ms": 500,                    // 설정된 인위적인 지연 시간 (ms)
                                                    // Configured artificial delay time (ms)
        "totalDelay_ms": 591.2999999523163           // 총 지연 시간 (ms)
                                                    // Total delay time (ms)
    }, 
    "clickCount": 1,
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

<br/>
<br/>

### 4. 전역 & 로컬 커스텀 데이터 그룹 설정: Setting Global & Local Custom Data Groups

<br/>

- 전역 커스텀 데이터는 모든 이벤트 유형에 공통적으로 적용되는 데이터를 정의합니다.
- 로컬 커스텀 데이터는 특정 이벤트 유형에만 적용되는 데이터를 정의합니다.
- 이를 통해 사용자의 상호작용을 더 세밀하게 추적하고 분석할 수 있습니다.

<br/>

- Global custom data defines data that is common to all event types.
- Local custom data defines data that applies only to specific event types.
- This allows for more detailed tracking and analysis of user interactions.

<br/>
<br/>

### 사용법: How To Use

<br/>

#### 전역 커스텀 데이터: Global Custom Data

```javascript

import { setGlobalUserDefinedItems } from 'dataherd-raika';


// 설정한 UserDefinedItems를 사용
setGlobalUserDefinedItems(UserDefinedItems);

```

<br/>

- 전역 커스텀 데이터는 애플리케이션의 모든 이벤트에서 공통적으로 사용됩니다. setGlobalUserDefinedItems 함수를 사용하여 전역 데이터 항목을 설정할 수 있습니다. 예를 들어, 사용자의 직업, 연령대 등과 같은 일반적인 정보를 전역 데이터로 설정할 수 있습니다.

<br/>

- Global custom data is used across all events in the application. The setGlobalUserDefinedItems function allows you to set global data items. For example, general information such as a user's job or age group can be set as global data.

<br/>

#### 로컬 커스텀 데이터: Local Custom Data

```javascript

import { setLocalCustomDataGroup } from 'dataherd-raika';


setLocalCustomDataGroup('clickEventCategoryA', [
    { name: 'categoryA-specific', type: 'string', options: ['Option1', 'Option2'] }
]);

setLocalCustomDataGroup('clickEventCategoryB', [
    { name: 'categoryB-specific', type: 'number', options: [1, 10] }
]);

```

<br/>

- 로컬 커스텀 데이터는 특정 이벤트에만 적용됩니다. 예를 들어, 특정 클릭 이벤트에만 적용되는 데이터를 정의할 때 사용합니다. setLocalCustomDataGroup 함수를 통해 각 이벤트 카테고리별로 다른 데이터를 설정할 수 있습니다.

<br/>

- Local custom data applies only to specific events. For example, it's used to define data that applies only to certain click events. The setLocalCustomDataGroup function allows you to set different data for each event category.

<br/>
<br/>

### 5. 클릭 이벤트 리스너 설정/ 클릭 이벤트 추적 함수 사용: Setting Click Event Listeners / Using Click Event Tracking Function

<br/>

trackClickEvent 함수와 trackKeywordEvent 함수는 웹페이지나 애플리케이션에서 사용자의 클릭과 키워드 이벤트를 추적하는 데 사용되는 함수들입니다.
이들은 이러한 상호작용과 관련된 데이터를 수집하고 관리하여, 분석, 사용자 경험 개선 또는 다양한 목적으로 사용할 수 있습니다.
각 함수의 구성과 사용법을 자세히 살펴봅시다.

<br/>

The trackClickEvent and trackKeywordEvent functions are used to track user click and keyword events on web pages or applications. They collect and manage data related to these interactions for analysis, user experience improvement, or various other purposes. Let's take a closer look at the configuration and usage of each function.

<br/>

#### trackClickEvent Function

<br/>

```javascript

    trackClickEvent(event, 'clickEventCategoryA', true, false, sendKeywordEventToServer);

```

- 매개변수:

1. event: 사용자 상호작용에서 발생하는 자바스크립트 Event 객체 (예: 마우스 클릭).
2. eventType: 이벤트를 분류하는 문자열 (예: 'button_click', 'nav_click').
3. includeLocalCustomData: 이 이벤트 유형에 특정한 로컬 커스텀 데이터를 포함할지 결정하는 여부. (true/false)
4. includeGlobalCustomData: 전역적으로 정의된 커스텀 데이터를 포함할지 결정하는 여부. (true/false)
5. callback: 이벤트 데이터를 수집한 후 호출될 함수. 옵션으로 선택 가능.

<br/>

- Parameters:

1. event: JavaScript Event object occurring from user interaction (e.g., mouse click).
2. eventType: String categorizing the event (e.g., 'button_click', 'nav_click').
3. includeLocalCustomData: Whether to include local custom data specific to this event type. (true/false)
4. includeGlobalCustomData: Whether to include globally defined custom data. (true/false)
5. callback: An optional function to be called after collecting event data.

<br/>
<br/>

- 작동 방식:

1. 함수는 정의된 횟수(userDefinedClickCount)만큼 클릭 이벤트 데이터를 생성합니다.
2. 이벤트 유형, 지정된 범위 내의 랜덤 타임스탬프, 클릭 횟수를 캡처합니다.

3. includeLocalCustomData 또는 includeGlobalCustomData가 참이면, 이 이벤트 유형에 지역적으로 혹은 전역적으로 정의된 커스텀 데이터도 포함됩니다.

4. 옵션으로, 이벤트 데이터는 제공된 callback 함수에 전달됩니다.

<br/>

- How It Works:

1. The function generates click event data for the defined number of times (userDefinedClickCount).
2. It captures the event type, random timestamps within a specified range, and click count.

3. If includeLocalCustomData or includeGlobalCustomData is true, the respective custom data is also included.

4. Optionally, the event data is passed to the provided callback function.

<br/>
<br/>

- 목적:

1. 사용자 클릭 이벤트를 추적하고 관련 데이터를 수집합니다.
2. 표준 및 커스텀 데이터를 캡처하는 유연성을 제공합니다.
3. 콜백을 통해 이 데이터의 사후 처리 또는 처리를 가능하게 합니다.

<br/>

- Purpose:

1. Tracks user click events and collects related data.
2. Provides flexibility in capturing standard and custom data.
3. Enables post-processing or handling of this data through a callback.

<br/>

### 사용법: How To Use

```javascript

import { trackClickEvent } from 'dataherd-raika';


document.getElementById('elementA').addEventListener('click', (event) => {
    trackClickEvent(event, 'clickEventCategoryA', true, false);
});

document.getElementById('elementB').addEventListener('click', (event) => {
    trackClickEvent(event, 'clickEventCategoryB', false, true);
});

```

<br/>
<br/>

### 예상 결과: Expected Results

<br/>

- elementA 클릭 시

1. 로컬 커스텀 데이터(clickEventCategoryA 그룹에 정의된 데이터)가 클릭 이벤트 데이터에 포함되어 전송됩니다.
2. 이 데이터는 trackClickEvent 함수의 세 번째 매개변수로 true를 지정하여 로컬 커스텀 데이터를 포함하도록 (전역 커스텀 데이터 포함 여부: false) 설정합니다.

<br/>

- On Clicking elementA

1. Local custom data (defined in the clickEventCategoryA group) is included and sent with the click event data.
2. This data is set to be included (with global custom data set to false) by specifying true as the third parameter in the trackClickEvent function.

<br/>

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

<br/>

- elementB 클릭 시

1. 전역 커스텀 데이터(GlobalUserDefinedItems에 정의된 데이터)가 클릭 이벤트 데이터에 포함되어 전송됩니다.
2. 이 데이터는 trackClickEvent 함수의 네 번째 매개변수로 true를 지정하여 전역 커스텀 데이터를 포함하도록 (지역 커스텀 데이터 포함 여부: false) 설정합니다.

<br/>

- On Clicking elementB

1. Global custom data (defined in GlobalUserDefinedItems) is included and sent with the click event data.
2. This data is set to be included (with local custom data set to false) by specifying true as the fourth parameter in the trackClickEvent function.

<br/>

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

<br/>
<br/>

### 6. 키워드 이벤트 추적 함수 사용: Using Keyword Event Tracking Function

<br/>

```javascript

trackKeywordEvent(keyword, 'search', true, true, 1, sendKeywordEventToServer);

```

<br/>

- 매개변수:

1. keyword: 이벤트와 관련된 키워드.
2. eventType: 이벤트를 분류하는 문자열 (예: 'search_keyword').
3. includeLocalCustomData: 이 이벤트 유형에 특정한 로컬 커스텀 데이터를 포함할지 결정하는 여부. (true/false)
4. includeGlobalCustomData: 전역적으로 정의된 커스텀 데이터를 포함할지 결정하는 여부. (true/false)
5. repeatCount: 키워드 이벤트가 발생하는 진짜 횟수. (해당 값과 키워드 이벤트 카운트 값을 비교 분석하여, 도배글 작성과 같이 특정 키워드가 비정상적으로 반복되는 사항을 필터링할 수 있습니다.)
6. callback: 이벤트 데이터를 수집한 후 호출될 함수. 옵션으로 선택 가능.

<br/>

- Parameters:

1. keyword: The keyword associated with the event.
2. eventType: String categorizing the event (e.g., 'search_keyword').
3. includeLocalCustomData: Whether to include local custom data specific to this event type. (true/false)
4. includeGlobalCustomData: Whether to include globally defined custom data. (true/false)
5. repeatCount: The actual number of times the keyword event occurs. (This can be used to filter out abnormal repetitions of specific keywords, like spamming.)
6. callback: An optional function to be called after collecting event data.

<br/>
<br/>

- 작동 방식:

1. 함수는 지정된 횟수(userDefinedKeywordCount)만큼 키워드 이벤트 데이터를 생성합니다.
2. 키워드, 이벤트 유형, 랜덤 타임스탬프, 키워드 발생 횟수를 캡처합니다.
includeLocalCustomData 또는 includeGlobalCustomData가 선택되면 추가 커스텀 데이터가 포함됩니다.
3. 수집된 데이터는 제공된 callback 함수에 전달됩니다.

<br/>

- How It Works:

1. The function generates keyword event data for the specified number of times (userDefinedKeywordCount).
2. It captures the keyword, event type, random timestamp, and the occurrence count of the keyword. If includeLocalCustomData or includeGlobalCustomData is selected, additional custom data is included.
3. The collected data is passed to the provided callback function.

<br/>
<br/>

- 목적:

1. 사용자가 입력한 키워드와 관련된 이벤트를 추적합니다.
2. 이러한 이벤트에 대한 자세한 데이터를 수집합니다.
3. 콜백을 통해 이벤트 사후 처리 또는 작업을 가능하게 합니다.

<br/>

- Purpose:

1. Tracks events related to keywords entered by users.
2. Collects detailed data on these events.
3. Enables post-event processing or tasks through a callback.

<br/>
<br/>

### 사용법: How To Use

```javascript

import { trackKeywordEvent } from 'dataherd-raika';

function simulateKeywordEvent() {
    const keyword = "exampleKeyword";
    trackKeywordEvent(keyword, 'search', true, true, 1);
}

simulateKeywordEvent();

```

<br/>
<br/>

### 예상 결과: Expected Results

- 키워드 이벤트가 추적되며, 해당 이벤트에 관련된 데이터가 포함됩니다.

<br/>

- The keyword event is tracked, and data related to the event is included.

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

<br/>
<br/>

### 7. 서버 데이터 저장: Saving Data to Server

<br/>

이벤트 추적 함수(trackClickEvent 또는 trackKeywordEvent)에 콜백 함수를 전달하여, 이벤트 데이터를 서버로 전송할 수 있습니다. 
이 콜백 함수는 이벤트 데이터를 받아 서버 API 엔드포인트로 전송하는 로직을 포함합니다.

<br/>

Event tracking functions (trackClickEvent or trackKeywordEvent) can send event data to the server by passing a callback function. This callback function includes logic for sending event data to a server API endpoint.

<br/>

### 사용법: How To Use

```typescript
    //키워드 이벤트를 서버로 보내기 위한 콜백 함수 정의
    // Define a callback function to send keyword events to the server
    const sendKeywordEventToServer = async (eventData: { [key: string]: KeywordEventData }) => {
        try {
            await fetch('/api/save-event-data', {
                method: 'POST',
                body: JSON.stringify(eventData),
                headers: {'Content-Type': 'application/json'}
            });
        } catch (error) {
            console.error('Error sending eventdata', error);
        }       
    }

    //클릭 이벤트를 서버로 보내기 위한 콜백 함수 정의
    // Define a callback function to send click events to the server
    const sendClickEventToServer = async (eventData: { [key: string]: ClickEventData }) => {
        try {
            await fetch('/api/save-event-data', {
                method: 'POST',
                body: JSON.stringify(eventData),
                headers: {'Content-Type': 'application/json'}
            });
        } catch (error) {
            console.error('Error sending eventdata', error);
        }       
    }

```
<br/>
<br/>

### 예상 결과: Expected Results

- 위의 콜백 함수를 사용하여 이벤트 추적 시, 다음과 같은 흐름으로 데이터가 처리됩니다:

1. 사용자의 클릭 또는 키워드 입력 이벤트가 발생합니다.
2. trackClickEvent 또는 trackKeywordEvent 함수가 호출되며, 이벤트 데이터가 생성됩니다.
3. 생성된 이벤트 데이터는 콜백 함수 sendEventToServer로 전달됩니다.
4. sendEventToServer 함수는 이벤트 데이터를 JSON 형식으로 변환하여 서버의 API 엔드포인트(/api/save-event-data)로 POST 요청을 보냅니다.
5. 서버는 요청을 받아 처리하고, 데이터를 db.json 파일이나 다른 데이터 스토리지에 저장합니다.

<br/>

이러한 프로세스는 사용자의 상호작용을 실시간으로 추적하고, 데이터를 중앙 서버에 저장하여 분석하는 데 사용될 수 있습니다.
예를 들어, 웹사이트 사용성 개선, 사용자 경험 분석, 사용자 행동에 대한 인사이트 획득 등에 활용할 수 있습니다.

데이터는 JSON 형식으로 저장되므로, 데이터 분석 도구나 대시보드에 쉽게 통합하여 시각화하고 분석할 수 있습니다. 
예를 들어, Google Analytics, Google BigQuery, AWS QuickSight 등 다양한 플랫폼과의 통합이 가능합니다.

<br/>
<br/>

- Using the above callback functions for event tracking, the data is processed as follows:

1. A user click or keyword input event occurs.
2. The trackClickEvent or trackKeywordEvent function is called, generating event data.
3. The generated event data is passed to the callback function sendEventToServer.
4. The sendEventToServer function converts the event data into JSON format and sends a POST request to the server's API endpoint (/api/save-event-data).
5. The server receives and processes the request, storing the data in a db.json file or other data storage.

<br/>

This process can be used to track user interactions in real-time, store data in a central server for analysis, and can be utilized for various purposes such as improving website usability, analyzing user experience, and gaining insights into user behavior.

Since the data is stored in JSON format, it can be easily integrated, visualized, and analyzed with data analysis tools or dashboards. For example, it can be integrated with various platforms such as Google Analytics, Google BigQuery, AWS QuickSight, etc.

<br/>
<br/>

### 종합: Summary

<br/>

이러한 방식으로 사용자 이벤트 데이터를 추적하고 관련 데이터를 수집 및 분석할 수 있습니다.
해당 라이브러리는 웹사이트나 애플리케이션의 사용성 개선, 사용자 경험 최적화 등에 활용될 수 있습니다.

<br/>

This approach allows for the tracking and analysis of user event data. The library can be used to improve usability and optimize user experience in websites and applications.