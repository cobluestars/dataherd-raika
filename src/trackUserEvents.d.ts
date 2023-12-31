// /src/trackUserEvents.d.ts: 타입 선언 파일

declare module "dataherd-raika" {
    // 커스텀 클릭 및 키워드 이벤트 카운트
    export let userDefinedClickCount: number;
    export let userDefinedKeywordCount: number;

    // 시작 및 종료 시간 전역 변수
    export let startTime: Date;
    export let endTime: Date;

    // 주어진 시작 및 종료 시간 사이의 랜덤 타임스탬프를 반환하는 함수
    export function getRandomTimestamp(start: Date, end: Date): Date;

    // 사용자 클릭 이벤트 데이터 인터페이스
    export interface ClickEventData {
        eventType: string;
        timestamp: Date;
        clickCount: number;
    }

    // 사용자 입력 키워드 이벤트 데이터 인터페이스
    export interface KeywordEventData {
        keyword: string;
        eventType: string;
        timestamp: Date;
        keywordCount: number;
        repeatCount: number;
    }

    // 커스텀 데이터 항목 타입 정의
    export type UserDefinedItem = {
        name: string;
        type: 'number' | 'string' | 'boolean' | 'array' | 'object';
        distribution?: 'uniform' | 'normal';
        mean?: number;
        standardDeviation?: number;
        options?: number | string | number[] | string[] | boolean[] | UserDefinedItem[] | Record<string, any>;
        randomizeArrays?: boolean;
        randomizeObjects?: boolean;
        arraySelectionCount?: number;
        objectSelectionCount?: number;
        randomizeSelectionCount?: boolean;
    };

    /** 전역/로컬 커스텀 데이터 항목 정의 및 설정 */

    // 전역 사용자 정의 데이터 항목
    export let GlobalUserDefinedItems: UserDefinedItem[];

    // 로컬 커스텀 데이터 그룹 타입 정의
    type LocalCustomDataGroup = Record<string, UserDefinedItem[]>;

    // 전역 사용자 정의 데이터 설정 함수
    export function setGlobalUserDefinedItems(items: UserDefinedItem[]): void;

    // 로컬 커스텀 데이터 그룹 설정 함수
    export function setLocalCustomDataGroup(eventType: string, items: UserDefinedItem[]): void;

    // 로컬 커스텀 데이터 그룹 반환 함수
    export function getLocalCustomDataGroup(eventType: string): UserDefinedItem[];


    /** 랜덤 데이터 생성 함수  */

    export function createRandomData(items: UserDefinedItem[]): Record<string, any>;

    // 정규 분포에 따른 랜덤 숫자 생성 함수
    export function gaussianRandom(mean: number, standardDeviation: number): number;
    

    /** 클릭 이벤트 추적 */

    // 시용자 클릭 이벤트 데이터 콜백 함수 타입 정의
    export type ClickEventDataCallback = (eventData: ClickEventData[]) => void;

    // 사용자 클릭 이벤트 추적 함수
    export function trackClickEvent(
        event: Event,
        eventType: string,
        includeLocalCustomData?: boolean,
        includeGlobalCustomData?: boolean,
        callback?: ClickEventDataCallback
    ): void;


    /** 키워드 이벤트 추적 */

    // 키워드 이벤트 데이터 콜백 함수 타입 정의
    export type KeywordEventDataCallback = (eventData: KeywordEventData[]) => void;

    // 사용자 입력 키워드 이벤트 추적 함수
    export function trackKeywordEvent(
        keyword: string,
        eventType: string,
        includeLocalCustomData?: boolean,
        includeGlobalCustomData?: boolean,
        repeatCount?: number,
        callback?: KeywordEventDataCallback
    ): void;


    // 커스텀 클릭 횟수 설정 함수
    export function setUserClickCount(ClickEventCount: number): void;
    // 커스텀 키워드 횟수 설정 함수
    export function setUserKeywordCount(KeywordEventCount: number): void;

    // 시작 및 종료 시간 설정 함수
    export function setTimestampRange(start: Date, end: Date): void;
}