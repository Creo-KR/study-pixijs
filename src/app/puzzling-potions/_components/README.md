# PixiJS Game React 변환

이 프로젝트는 기존의 PixiJS 게임을 React 컴포넌트로 변환한 것입니다.

## 변경 사항

### 1. 메인 파일 변환

- `main.ts` → `PuzzlingPotionsGame.tsx` (React 컴포넌트)
- 기존의 직접적인 DOM 조작을 React의 ref와 useEffect로 변환
- 앱 생명주기를 React의 컴포넌트 생명주기에 맞게 조정

### 2. 상태 관리

- React의 `useState`를 사용하여 게임 상태 관리
- 로딩, 초기화, 현재 화면, 에러 상태 등을 React 방식으로 관리

### 3. 이벤트 처리

- `useCallback`을 사용하여 resize, visibilityChange 등의 이벤트 최적화
- React의 생명주기에 맞는 이벤트 리스너 등록/해제

### 4. 개발자 도구

- `showControls` 프롭을 통해 개발용 컨트롤 패널 제공
- 다양한 게임 화면으로의 네비게이션 기능
- 게임 일시정지/재개 기능
- 현재 상태 표시

### 5. 앱 인스턴스 관리

- 전역 앱 인스턴스를 안전하게 관리하는 `appInstance.ts` 유틸리티 추가
- 다른 컴포넌트에서도 앱에 접근할 수 있도록 구성

## 사용 방법

```tsx
import PuzzlingPotionsGame from './_components/PuzzlingPotionsGame';

// 기본 사용
<PuzzlingPotionsGame />

// 개발자 컨트롤과 함께 사용
<PuzzlingPotionsGame showControls={true} />

// 커스텀 클래스와 함께 사용
<PuzzlingPotionsGame className="custom-game-wrapper" showControls={true} />
```

## 주요 특징

1. **React 생명주기 통합**: React의 useEffect와 cleanup을 통한 적절한 리소스 관리
2. **타입 안전성**: TypeScript를 활용한 타입 안전한 구현
3. **개발자 친화적**: 개발 중 쉽게 테스트할 수 있는 컨트롤 패널 제공
4. **에러 처리**: 게임 초기화 및 네비게이션 중 발생할 수 있는 에러 처리
5. **반응형**: 윈도우 크기 변경에 대한 적절한 대응

## 파일 구조

```
_components/
├── PuzzlingPotionsGame.tsx    # 메인 React 컴포넌트
├── utils/
│   └── appInstance.ts         # 전역 앱 인스턴스 관리
└── main.ts                    # 기존 파일 (호환성을 위해 유지)
```

## 개발 팁

- `showControls={true}` 프롭을 사용하여 개발 중 다양한 화면을 쉽게 테스트할 수 있습니다.
- 게임 에러는 화면 좌상단에 빨간색 박스로 표시됩니다.
- 컴포넌트가 언마운트될 때 자동으로 PixiJS 앱과 모든 리소스가 정리됩니다.
