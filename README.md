# PixiJS + Next.js Study Project

WebGL 기반 2D 렌더링 라이브러리 **PixiJS**를 학습하기 위한 Next.js 프로젝트입니다.

## 🚀 기술 스택

- **Next.js 15.4.5** - React 프레임워크 (App Router)
- **PixiJS 8.11.0** - WebGL 기반 2D 렌더링 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS v4** - 유틸리티 기반 CSS 프레임워크
- **Prettier + ESLint** - 코드 포맷팅 및 린팅

## 📦 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 시작
yarn dev

# 프로덕션 빌드
yarn build

# 린팅
yarn lint

# 포맷팅
yarn format

# 타입 검사
yarn type-check
```

## 🎯 학습 예제

### 1. 기본 그래픽 예제

- Graphics API를 사용한 기본 도형 그리기
- 원, 사각형, 삼각형 렌더링
- 회전 애니메이션 구현

### 2. 인터랙티브 파티클 시스템

- 실시간 마우스/터치 인터랙션
- 물리 시뮬레이션 (충돌, 반사)
- 파티클 생성 및 생명 주기 관리
- 동적 파라미터 조정

## 📁 프로젝트 구조

```
src/
├── app/                  # Next.js App Router
│   ├── globals.css      # 글로벌 스타일
│   ├── layout.tsx       # 루트 레이아웃
│   └── page.tsx         # 홈 페이지
├── components/          # React 컴포넌트
│   ├── PixiCanvas.tsx   # 기본 PixiJS 캔버스
│   └── InteractivePixi.tsx # 인터랙티브 파티클 시스템
└── utils/
    └── pixiUtils.ts     # PixiJS 유틸리티 함수
```

## 🛠️ 주요 기능

### PixiJS 통합

- Next.js SSR과 호환되는 클라이언트 사이드 렌더링
- TypeScript 타입 정의 완벽 지원
- 반응형 캔버스 크기 조정

### 유틸리티 함수

- **TextureUtils**: 텍스처 생성 도구
- **AnimationUtils**: 애니메이션 및 이징 함수
- **MathUtils**: 수학 계산 도구

### 개발 도구

- 자동 포맷팅 (Prettier)
- 코드 린팅 (ESLint)
- 타입 검사 (TypeScript)
- 핫 리로드 개발 서버

## 🎨 사용된 PixiJS 기능

- **Graphics API**: 벡터 그래픽 렌더링
- **Animation Ticker**: 60fps 애니메이션 루프
- **Event System**: 마우스/터치 이벤트 처리
- **Particle System**: 동적 오브젝트 관리
- **Collision Detection**: 경계 충돌 감지

## 📚 학습 리소스

- [PixiJS 공식 문서](https://pixijs.com/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)

## 🤝 기여

이 프로젝트는 학습 목적으로 만들어졌습니다. 개선 사항이나 새로운 예제에 대한 제안은 언제든 환영합니다!

## 📄 라이선스

MIT License
