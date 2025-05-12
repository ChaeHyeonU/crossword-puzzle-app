import { useState, useRef } from 'react';
import { MIN_SCALE, MAX_SCALE } from './constants';

interface Position {
  x: number;
  y: number;
}

interface UseGridGesturesProps {
  initialScale?: number;
  initialPosition?: Position;
}

interface UseGridGesturesReturn {
  scale: number;
  position: Position;
  setScale: (scale: number) => void;
  setPosition: (position: Position) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export function useGridGestures({
  initialScale = MIN_SCALE,
  initialPosition = { x: 0, y: 0 }
}: UseGridGesturesProps = {}): UseGridGesturesReturn {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState<Position>(initialPosition);
  const lastDistance = useRef<number | null>(null);
  const lastPosition = useRef<Position | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastDistance.current = distance;
    } else if (e.touches.length === 1) {
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      if (lastDistance.current) {
        const delta = distance - lastDistance.current;
        const newScale = Math.min(Math.max(scale + delta * 0.01, MIN_SCALE), MAX_SCALE);
        setScale(newScale);
      }
      lastDistance.current = distance;
    } else if (e.touches.length === 1 && lastPosition.current && scale > MIN_SCALE) {
      const deltaX = e.touches[0].clientX - lastPosition.current.x;
      const deltaY = e.touches[0].clientY - lastPosition.current.y;
      
      const maxOffset = (scale - 1) * 150;
      const newX = Math.min(Math.max(position.x + deltaX, -maxOffset), maxOffset);
      const newY = Math.min(Math.max(position.y + deltaY, -maxOffset), maxOffset);
      
      setPosition({ x: newX, y: newY });
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    lastDistance.current = null;
    lastPosition.current = null;
  };

  return {
    scale,
    position,
    setScale,
    setPosition,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
} 