const trackUserEvents = require('../trackUserEvents');

describe('trackUserEvents', () => {
    // `getRandomTimestamp` 함수 테스트
    test('getRandomTimestamp should return a date between start and end dates', () => {
        const start = new Date('2024-01-01T00:00:00');
        const end = new Date('2024-01-01T08:00:00');
        const randomDate = trackUserEvents.getRandomTimestamp(start, end);

        // 밀리초 단위로 비교하기 위해 getTime() 메소드를 사용
        expect(randomDate.getTime()).toBeGreaterThanOrEqual(start.getTime());
        expect(randomDate.getTime()).toBeLessThanOrEqual(end.getTime());
    });

    // `createRandomData` 함수 테스트
    test('createRandomData should create data according to UserDefinedItem specifications', () => {
        const items = [
            { name: 'testNumber', type: 'number', options: [1, 10] },
            { name: 'testString', type: 'string', options: ['option1', 'option2'] }
        ];
        const randomData = trackUserEvents.createRandomData(items);
        expect(randomData.testNumber).toBeGreaterThanOrEqual(1);
        expect(randomData.testNumber).toBeLessThanOrEqual(10);
        expect(['option1', 'option2']).toContain(randomData.testString);
    });

    // `trackClickEvent` 함수 테스트
    test('trackClickEvent should track click events correctly', () => {
        const mockCallback = jest.fn();
        const mockEvent = new Event('click');
        trackUserEvents.trackClickEvent(mockEvent, 'click', false, false, mockCallback);
        expect(mockCallback).toHaveBeenCalled();
        expect(mockCallback.mock.calls[0][0]).toHaveProperty('click_1');
    });

    // `trackKeywordEvent` 함수 테스트
    test('trackKeywordEvent should track keyword events correctly', () => {
        const mockCallback = jest.fn();
        trackUserEvents.trackKeywordEvent('testKeyword', 'keyword', false, false, 1, mockCallback);
        expect(mockCallback).toHaveBeenCalled();
        expect(mockCallback.mock.calls[0][0]).toHaveProperty('keyword_1');
    });

    // 전역 및 로컬 커스텀 데이터 설정 테스트
    test('setGlobalUserDefinedItems and setLocalCustomDataGroup should set data correctly', () => {
        const globalItems = [{ name: 'globalTest', type: 'string', options: 'global' }];
        const localItems = [{ name: 'localTest', type: 'string', options: 'local' }];
        
        trackUserEvents.setGlobalUserDefinedItems(globalItems);
        trackUserEvents.setLocalCustomDataGroup('click', localItems);

        expect(trackUserEvents.GlobalUserDefinedItems).toEqual(globalItems);
        expect(trackUserEvents.getLocalCustomDataGroup('click')).toEqual(localItems);
    });
});
