'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

interface PuzzlePiece {
  id: number;
  currentX: number;
  currentY: number;
  correctX: number;
  correctY: number;
  sprite: PIXI.Sprite;
  isDragging: boolean;
  isPlaced: boolean;
}

interface PuzzleGameProps {
  width?: number;
  height?: number;
  gridSize?: number;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  width = 800,
  height = 600,
  gridSize = 3,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [gameState, setGameState] = useState<
    'loading' | 'playing' | 'completed'
  >('loading');
  const [moveCount, setMoveCount] = useState(0);
  const [completedPieces, setCompletedPieces] = useState(0);

  // 퍼즐 조각들을 저장할 ref
  const puzzlePiecesRef = useRef<PuzzlePiece[]>([]);
  const dragTargetRef = useRef<PuzzlePiece | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new PIXI.Application();
    appRef.current = app;

    // 퍼즐 초기화
    const initializePuzzle = async () => {
      await app.init({
        width,
        height,
        backgroundColor: 0x2c3e50,
        antialias: true,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      // 퍼즐 이미지 생성 (간단한 그라디언트 패턴)
      const canvas = document.createElement('canvas');
      const pieceSize = 120;
      canvas.width = gridSize * pieceSize;
      canvas.height = gridSize * pieceSize;

      const ctx = canvas.getContext('2d')!;

      // 그라디언트 배경 생성
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, '#3498db');
      gradient.addColorStop(0.3, '#9b59b6');
      gradient.addColorStop(0.7, '#e74c3c');
      gradient.addColorStop(1, '#f39c12');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 패턴 추가
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let i = 0; i <= gridSize; i++) {
        // 세로선
        ctx.beginPath();
        ctx.moveTo(i * pieceSize, 0);
        ctx.lineTo(i * pieceSize, canvas.height);
        ctx.stroke();

        // 가로선
        ctx.beginPath();
        ctx.moveTo(0, i * pieceSize);
        ctx.lineTo(canvas.width, i * pieceSize);
        ctx.stroke();
      }

      // 숫자 추가
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const num = row * gridSize + col + 1;
          ctx.fillText(
            num.toString(),
            col * pieceSize + pieceSize / 2,
            row * pieceSize + pieceSize / 2
          );
        }
      }

      const baseTexture = PIXI.Texture.from(canvas);

      // 퍼즐 조각들 생성
      const pieces: PuzzlePiece[] = [];
      const totalPieces = gridSize * gridSize;

      for (let i = 0; i < totalPieces; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        // 각 조각의 텍스처 생성
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceSize;
        pieceCanvas.height = pieceSize;
        const pieceCtx = pieceCanvas.getContext('2d')!;

        // 원본 이미지에서 해당 부분 복사
        pieceCtx.drawImage(
          canvas,
          col * pieceSize,
          row * pieceSize,
          pieceSize,
          pieceSize,
          0,
          0,
          pieceSize,
          pieceSize
        );

        // 테두리 추가
        pieceCtx.strokeStyle = '#34495e';
        pieceCtx.lineWidth = 3;
        pieceCtx.strokeRect(0, 0, pieceSize, pieceSize);

        const pieceTexture = PIXI.Texture.from(pieceCanvas);
        const sprite = new PIXI.Sprite(pieceTexture);

        // 정답 위치 계산 (화면 오른쪽)
        const correctX =
          width - gridSize * (pieceSize + 10) + col * (pieceSize + 10) + 20;
        const correctY = 50 + row * (pieceSize + 10);

        // 초기 위치 (화면 왼쪽에 랜덤하게 배치)
        const initialX =
          Math.random() * (width - gridSize * (pieceSize + 10) - 200) + 50;
        const initialY = Math.random() * (height - pieceSize - 100) + 50;

        sprite.x = initialX;
        sprite.y = initialY;
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';

        const piece: PuzzlePiece = {
          id: i,
          currentX: initialX,
          currentY: initialY,
          correctX,
          correctY,
          sprite,
          isDragging: false,
          isPlaced: false,
        };

        // 드래그 이벤트 추가
        sprite.on('pointerdown', event => onDragStart(event, piece));

        pieces.push(piece);
        app.stage.addChild(sprite);
      }

      // 조각들을 섞기
      shufflePieces(pieces);
      puzzlePiecesRef.current = pieces;

      // 전역 이벤트 리스너
      app.stage.eventMode = 'static';
      app.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);
      app.stage.on('pointermove', onDragMove);
      app.stage.on('pointerup', onDragEnd);
      app.stage.on('pointerupoutside', onDragEnd);

      // 정답 영역 표시
      drawAnswerArea();

      setGameState('playing');
    };

    // 정답 영역 그리기
    const drawAnswerArea = () => {
      const answerArea = new PIXI.Graphics();
      const pieceSize = 120;
      const startX = width - gridSize * (pieceSize + 10) + 10;
      const startY = 40;

      answerArea.rect(
        startX,
        startY,
        gridSize * (pieceSize + 10),
        gridSize * (pieceSize + 10)
      );
      answerArea.stroke({ color: 0xffffff, width: 3, alpha: 0.5 });

      // 각 칸 표시
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          answerArea.rect(
            startX + 10 + col * (pieceSize + 10),
            startY + 10 + row * (pieceSize + 10),
            pieceSize,
            pieceSize
          );
          answerArea.stroke({ color: 0xffffff, width: 1, alpha: 0.3 });
        }
      }

      app.stage.addChild(answerArea);
    };

    // 조각들 섞기
    const shufflePieces = (pieces: PuzzlePiece[]) => {
      for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tempX = pieces[i].currentX;
        const tempY = pieces[i].currentY;

        pieces[i].currentX = pieces[j].currentX;
        pieces[i].currentY = pieces[j].currentY;
        pieces[i].sprite.x = pieces[i].currentX;
        pieces[i].sprite.y = pieces[i].currentY;

        pieces[j].currentX = tempX;
        pieces[j].currentY = tempY;
        pieces[j].sprite.x = pieces[j].currentX;
        pieces[j].sprite.y = pieces[j].currentY;
      }
    };

    // 드래그 시작
    const onDragStart = (
      event: PIXI.FederatedPointerEvent,
      piece: PuzzlePiece
    ) => {
      if (piece.isPlaced) return;

      dragTargetRef.current = piece;
      piece.isDragging = true;

      // 드래그 오프셋 계산
      const globalPos = event.global;
      dragOffsetRef.current = {
        x: globalPos.x - piece.sprite.x,
        y: globalPos.y - piece.sprite.y,
      };

      // 조각을 맨 앞으로 가져오기
      app.stage.removeChild(piece.sprite);
      app.stage.addChild(piece.sprite);

      // 스케일 효과
      piece.sprite.scale.set(1.1);
    };

    // 드래그 중
    const onDragMove = (event: PIXI.FederatedPointerEvent) => {
      const dragTarget = dragTargetRef.current;
      if (!dragTarget || !dragTarget.isDragging) return;

      const globalPos = event.global;
      dragTarget.sprite.x = globalPos.x - dragOffsetRef.current.x;
      dragTarget.sprite.y = globalPos.y - dragOffsetRef.current.y;

      dragTarget.currentX = dragTarget.sprite.x;
      dragTarget.currentY = dragTarget.sprite.y;
    };

    // 드래그 종료
    const onDragEnd = () => {
      const dragTarget = dragTargetRef.current;
      if (!dragTarget || !dragTarget.isDragging) return;

      dragTarget.isDragging = false;
      dragTarget.sprite.scale.set(1);

      // 정답 위치에 가까운지 확인
      const distance = Math.sqrt(
        Math.pow(dragTarget.currentX - dragTarget.correctX, 2) +
          Math.pow(dragTarget.currentY - dragTarget.correctY, 2)
      );

      const snapDistance = 50;

      if (distance < snapDistance && !dragTarget.isPlaced) {
        // 정답 위치에 스냅
        dragTarget.sprite.x = dragTarget.correctX;
        dragTarget.sprite.y = dragTarget.correctY;
        dragTarget.currentX = dragTarget.correctX;
        dragTarget.currentY = dragTarget.correctY;
        dragTarget.isPlaced = true;
        dragTarget.sprite.tint = 0x90ee90; // 연두색 tint

        setMoveCount(prev => prev + 1);
        setCompletedPieces(prev => {
          const newCount = prev + 1;
          if (newCount === gridSize * gridSize) {
            setGameState('completed');
          }
          return newCount;
        });
      } else {
        setMoveCount(prev => prev + 1);
      }

      dragTargetRef.current = null;
    };

    initializePuzzle();

    // 정리 함수
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, [width, height, gridSize]);

  const resetGame = () => {
    setGameState('loading');
    setMoveCount(0);
    setCompletedPieces(0);

    // 모든 조각 초기화
    puzzlePiecesRef.current.forEach(piece => {
      piece.isPlaced = false;
      piece.isDragging = false;
      piece.sprite.tint = 0xffffff;

      // 랜덤 위치로 이동
      const initialX = Math.random() * (width - 400) + 50;
      const initialY = Math.random() * (height - 150) + 50;

      piece.sprite.x = initialX;
      piece.sprite.y = initialY;
      piece.currentX = initialX;
      piece.currentY = initialY;
    });

    setGameState('playing');
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      {/* 게임 상태 및 컨트롤 */}
      <div className='flex items-center gap-6 p-4 bg-white rounded-lg shadow-md'>
        <div className='text-sm'>
          <span className='font-semibold'>이동 횟수:</span>
          <span className='ml-2 text-blue-600 font-bold'>{moveCount}</span>
        </div>

        <div className='text-sm'>
          <span className='font-semibold'>완성된 조각:</span>
          <span className='ml-2 text-green-600 font-bold'>
            {completedPieces} / {gridSize * gridSize}
          </span>
        </div>

        <div className='text-sm'>
          <span className='font-semibold'>상태:</span>
          <span
            className={`ml-2 font-bold ${
              gameState === 'completed'
                ? 'text-green-600'
                : gameState === 'playing'
                  ? 'text-blue-600'
                  : 'text-gray-600'
            }`}
          >
            {gameState === 'completed'
              ? '완료!'
              : gameState === 'playing'
                ? '플레이 중'
                : '로딩 중...'}
          </span>
        </div>

        <button
          onClick={resetGame}
          className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors'
        >
          새 게임
        </button>
      </div>

      {/* 게임 캔버스 */}
      <div
        ref={canvasRef}
        className='border-2 border-gray-300 rounded-lg shadow-lg bg-gray-100'
      />

      {/* 게임 완료 메시지 */}
      {gameState === 'completed' && (
        <div className='p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
          <p className='font-bold'>🎉 퍼즐 완성!</p>
          <p className='text-sm'>
            총 {moveCount}번의 이동으로 퍼즐을 완성했습니다!
          </p>
        </div>
      )}

      {/* 게임 설명 */}
      <div className='max-w-2xl text-center text-sm text-gray-600 space-y-2'>
        <p>
          <strong>조작법:</strong> 퍼즐 조각을 클릭하고 드래그하여 오른쪽 정답
          영역에 배치하세요.
        </p>
        <p>
          조각이 정답 위치에 가까워지면 자동으로 스냅되며 연두색으로 변합니다.
        </p>
      </div>
    </div>
  );
};

export default PuzzleGame;
