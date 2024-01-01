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
    }

    //확률 설정을 위한 타입
    export type ProbabilitySetting = {
        identifier: number | string;
        probability: number;
    }

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
    
    /** 확률 세팅 함수: 배열, 객체의 요소마다 설정한 확률을 세팅함. */
    function settingProbabilities(
        options: (number | string | object)[],
        settings: ProbabilitySetting[]
    ): number[]

    /** 세팅된 확률로 항목(들)을 선택하게 하는 함수 */
    function applyProbabilityBasedSelection(
        options: ( string | number | object )[],
        probabilities: number[]
    ): (  string | number | object )[]


    /** 클릭 이벤트 추적 */

    // 시용자 클릭 이벤트 데이터 콜백 함수 타입 정의
    export type ClickEventDataCallback = (eventData: { [key: string]: ClickEventData }) => void;    

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
    export type KeywordEventDataCallback = (eventData: { [key: string]: KeywordEventData }) => void;

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