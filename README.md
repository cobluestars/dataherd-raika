# dataherd-raika

"Dataherd-Raika is a cutting-edge library designed to simulate large-scale user behavior datasets. It takes a single user event (like a click or keyword input) and, by applying simple probability distributions and custom variables, expands it into a vast dataset."


## 사용법 및 예상 결과

### 1. 시작 및 종료 시간 설정

```javascript
setTimestampRange(new Date('2024-01-01T00:00:00'), new Date('2024-01-01T08:00:00'));
```

이 함수는 이벤트 타임스탬프를 생성할 때 사용되는 시간 범위를 설정합니다.
2024-01-01 자정 ~ 오전 8시 사이의 랜덤한 타임스탬프를 생성하고 싶다면, 위 코드처럼 설정하면 됩니다.


### 2. 특정 키워드 생성 & 검색 횟수 조정

```javascript
setUserClickCount(3);
setUserKeywordCount(3);
```

이 함수들은 사용자가 클릭하거나 키워드를 생성/검색할 때마다 적용되는 카운트, 만들어지는 데이터 수를 설정합니다.


### 3. 전역 커스텀 데이터 설정

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

### 예상 결과:

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


### 4. 로컬 커스텀 데이터 그룹 설정

```javascript
setLocalCustomDataGroup('clickEventCategoryA', [
    { name: 'categoryA-specific', type: 'string', options: ['Option1', 'Option2'] }
]);
setLocalCustomDataGroup('clickEventCategoryB', [
    { name: 'categoryB-specific', type: 'number', options: [1, 10] }
]);
```


### 5. 클릭 이벤트 리스너 설정/ 클릭 이벤트 추적 함수 사용

```javascript
document.getElementById('elementA').addEventListener('click', (event) => {
    trackClickEvent(event, 'clickEventCategoryA', true, false);
});
document.getElementById('elementB').addEventListener('click', (event) => {
    trackClickEvent(event, 'clickEventCategoryB', false, true);
});
```

### 예상 결과:

- elementA 클릭 시

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

- elementB 클릭 시

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


### 6. 키워드 이벤트 추적 함수 사용

키워드 이벤트 추적 함수

```javascript
function simulateKeywordEvent() {
    const keyword = "exampleKeyword";
    trackKeywordEvent(keyword, 'search', true, 1, true);
}

simulateKeywordEvent(); // 함수 호출로 키워드 이벤트 시뮬레이션
```

### 예상 결과:

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


### 7. 서버 데이터 저장

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

### 예상 결과
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


### 종합

이러한 방식으로 사용자 이벤트 데이터를 추적하고 관련 데이터를 수집 및 분석할 수 있습니다.
해당 라이브러리는 웹사이트나 애플리케이션의 사용성 개선, 사용자 경험 최적화 등에 활용될 수 있습니다.