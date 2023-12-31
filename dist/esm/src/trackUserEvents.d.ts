export declare let userDefinedClickCount: number;
export declare let userDefinedKeywordCount: number;
export declare let startTime: Date;
export declare let endTime: Date;
export declare function getRandomTimestamp(start: Date, end: Date): Date;
export interface ClickEventData {
    eventType: string;
    elementId: string | undefined;
    elementClass: string | undefined;
    timestamp: Date;
    clickCount: number;
}
export interface KeywordEventData {
    keyword: string;
    eventType: string;
    timestamp: Date;
    keywordCount: number;
    repeatCount: number;
}
export type UserDefinedItem = {
    name: string;
    type: 'number' | 'string' | 'boolean' | 'array' | 'object';
    distribution?: 'uniform' | 'normal';
    mean?: null | number;
    standardDeviation?: null | number;
    options?: null | number | string | number[] | string[] | boolean[] | Record<string, any>;
};
export declare let GlobalUserDefinedItems: UserDefinedItem[];
export declare function setGlobalUserDefinedItems(items: UserDefinedItem[]): void;
export declare function setLocalCustomDataGroup(eventType: string, items: UserDefinedItem[]): void;
export declare function getLocalCustomDataGroup(eventType: string): UserDefinedItem[];
export declare function gaussianRandom(mean: number, standardDeviation: number): number;
export declare function createRandomData(items: UserDefinedItem[], randomizeArrays?: boolean, randomizeObjects?: boolean): any;
export declare function trackClickEvent(event: Event, eventType: string, includeLocalCustomData?: boolean, includeGlobalCustomData?: boolean): void;
export declare function trackKeywordEvent(keyword: string, eventType: string, includeLocalCustomData?: boolean, repeatCount?: number, includeGlobalCustomData?: boolean): void;
/**클릭 횟수를 사용자가 직접 조정할 수 있는 함수:
 * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)
 * setUserClickCount(100): 클릭 횟수 100회로 설정*/
export declare function setUserClickCount(ClickEventCount: number): void;
/**특정 키워드 생성 & 검색 횟수를 사용자가 직접 조정할 수 있는 함수:
 * * (1 ~ (2^53 - 1)사이의 숫자 입력 가능)
 * setUserKeywordCount(100): 키워드 생성 & 검색 횟수 100회로 설정*/
export declare function setUserKeywordCount(KeywordEventCount: number): void;
/**시작 및 종료 시간 설정 함수:
 * 얘사: 2024-01-01 자정 ~ 오전 8시 사이의 랜덤한 타임스탬프를 생성하고 싶다면,
 * setTimestampRange(new Date('2024-01-01T00:00:00'), newDate('2024-01-01T08:00:00'));*/
export declare function setTimestampRange(start: Date, end: Date): void;
/**
 *

### 사용법 및 예상 결과

#### 0. 시작 및 종료 시간 설정

```javascript
setTimestampRange(new Date('2024-01-01T00:00:00'), new Date('2024-01-01T08:00:00'));
```

이 함수는 이벤트 타임스탬프를 생성할 때 사용되는 시간 범위를 설정함.

#### 1. 전역 커스텀 데이터 설정

```javascript
setGlobalUserDefinedItems([
    // 전역 커스텀 데이터 항목들
    { name: 'age', type: 'number', options: [10, 50], distribution: 'uniform'},
    { name: 'job', type: 'string', options: ['student', 'web developer', 'accountant'] },
    { name: 'salary', type: 'number', options: [25000, 100000], distribution: 'normal', mean: 36000, standardDeviation: (100000 - 25000) / 6 },
    { name: 'drinks', type: 'array', options: ['Americano', 'Latte', 'Cappuccino', 'Green Tea Latte'], randomizeArrays: false },
    { name: 'hobbies', type: 'object', options: { hobby1: 'reading', hobby2: 'gaming', hobby3: 'coding', hobby4: 'hiking' }, randomizeObjects: false }
]);
```

#### 예상 결과:

전역 커스텀 데이터가 이벤트 데이터에 포함됨.

```json
{
    "age": 35,
    "job": "web developer",
    "salary": 40000,
    "drinks": ["Americano", "Latte", "Cappuccino", "Green Tea Latte"],
    "hobbies": {"hobby1": "reading", "hobby2": "gaming", "hobby3": "coding", "hobby4": "hiking"}
}
```

#### 2. 로컬 커스텀 데이터 그룹 설정

```javascript
setLocalCustomDataGroup('clickEventCategoryA', [
    { name: 'categoryA-specific', type: 'string', options: ['Option1', 'Option2'] }
]);
setLocalCustomDataGroup('clickEventCategoryB', [
    { name: 'categoryB-specific', type: 'number', options: [1, 10] }
]);
```

#### 3. 클릭 이벤트 리스너 설정

```javascript
document.getElementById('elementA').addEventListener('click', (event) => {
    trackClickEvent(event, 'clickEventCategoryA', true, true);
});
document.getElementById('elementB').addEventListener('click', (event) => {
    trackClickEvent(event, 'clickEventCategoryB', true, true);
});
```

#### 예상 결과:

- `elementA` 클릭 시:

  ```json
  {
      "eventType": "click",
      "elementId": "elementA",
      "elementClass": "someClass",
      "timestamp": "2024-01-01T02:34:56.789Z",
      "clickCount": 1,
      "categoryA-specific": "Option1",
      // 전역 커스텀 데이터 추가
  }
  ```

  - `elementB` 클릭 시:

  ```json
  {
      "eventType": "click",
      "elementId": "elementB",
      "elementClass": "anotherClass",
      "timestamp": "2024-01-01T03:35:10.123Z",
      "clickCount": 1,
      "categoryB-specific": 7,
      // 전역 커스텀 데이터 추가
  }
  ```

#### 4. 클릭/키워드 이벤트 추적 함수 사용

```javascript
function simulateKeywordEvent() {
    const keyword = "exampleKeyword";
    trackKeywordEvent(keyword, 'search', true, 1, true);
}

simulateKeywordEvent(); // 함수 호출로 키워드 이벤트 시뮬레이션
```

#### 예상 결과:

키워드 이벤트가 추적됨.

```json
{
    "keyword": "exampleKeyword",
    "eventType": "search",
    "timestamp": "2024-01-01T04:36:00.456Z",
    "keywordCount": 1,
    "repeatCount": 1,
    // 여기에 추가적인 전역 및 로컬 사용자 정의 데이터가 포함될 수 있음
}
```

#### 5. 특정 키워드 생성 & 검색 횟수 조정

```javascript
setUserClickCount(100);
setUserKeywordCount(100);
```

이 함수들은 사용자가 클릭하거나 키워드를 생성/검색할 때마다 적용되는 카운트를 설정.

이러한 방식으로 사용자 이벤트 데이터를 추적하고,
관련 데이터를 수집 및 분석할 수 있음.
해당 라이브러리는 웹사이트나 애플리케이션의 사용성 개선, 사용자 경험 최적화 등에 활용될 수 있음.
 */ 
