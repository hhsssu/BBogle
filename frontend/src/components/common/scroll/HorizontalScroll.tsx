import { ReactNode, useCallback, useRef, useState } from 'react';

interface HorizontalScrollProps {
  children: ReactNode;
}

function HorizontalScroll({ children }: HorizontalScrollProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragged, setDragged] = useState(false); // 드래그 여부 상태 추가

  const MIN_DRAG_DISTANCE = 5;

  // 예기치 않은 클릭 이벤트를 막는 함수
  const preventUnexpectedEffects = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 드래그 시작 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (listRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - listRef.current.offsetLeft);
      setScrollLeft(listRef.current.scrollLeft);
      setDragged(false); // 드래그 상태 초기화
    }
  };

  // 드래그 중 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !listRef.current) return;

    e.preventDefault();
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    listRef.current.scrollLeft = scrollLeft - walk;

    // 최소 이동 거리 이상 드래그된 경우 dragged 상태 true로 설정
    if (Math.abs(x - startX) > MIN_DRAG_DISTANCE) {
      setDragged(true);
    }
  };

  // 드래그 종료 핸들러
  const handleMouseUp = () => {
    setIsDragging(false);

    // 드래그를 했으면 클릭 이벤트를 막기 위해 clicked 상태를 true로 설정
    if (dragged) {
      const childNodes = listRef.current?.childNodes || [];
      childNodes.forEach((child) => {
        (child as HTMLElement).addEventListener(
          'click',
          preventUnexpectedEffects,
        );
      });
    }

    // 0.1초 후 preventUnexpectedEffects를 제거하여 정상적인 클릭이 가능하도록 함
    setTimeout(() => {
      const childNodes = listRef.current?.childNodes || [];
      childNodes.forEach((child) => {
        (child as HTMLElement).removeEventListener(
          'click',
          preventUnexpectedEffects,
        );
      });
      setDragged(false); // dragged 상태 초기화
    }, 100);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={listRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        overflowX: 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
        scrollbarWidth: 'none',
        padding: '12px 8px',
        gap: '2.1rem',
      }}
    >
      {children}
    </div>
  );
}

export default HorizontalScroll;
