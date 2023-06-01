import React, { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Draggable, Resizable, isMovingAtom, isCroppingAtom } from '@/components/canvas/store';
import { useRef, useState } from 'react';
import { Center, useMantineTheme } from '@mantine/core';
import { ArrowsMove } from 'tabler-icons-react';

type Props = {
  dimension: Resizable;
  position: Draggable;
  rotation?: number;
  onMove: (p: Draggable) => void;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  withMoveHandle?: boolean;
  withBorders?: boolean;
  hide?: boolean;
};

export function DragHandler({
  dimension,
  rotation = 0,
  position,
  onMove,
  onClick,
  children,
  hide = false,
  withMoveHandle = false,
  withBorders = false
}: Props) {
  const { x, y } = position;
  const { width, height } = dimension;
  const [moving, setMoving] = useState(false);
  const setIsMoving = useSetAtom(isMovingAtom);
  // const isCropping = useAtomValue(isCroppingAtom);
  const theme = useMantineTheme();
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    lastPos.current = { x: e.clientX, y: e.clientY };
    setMoving(true && !hide);
    setIsMoving(true);
  };

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      setMoving(false);
      setIsMoving(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      if (moving) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        onMove({ x: deltaX, y: deltaY });
      }
    };

    document.addEventListener('pointerup', handleMouseUp);
    document.addEventListener('pointermove', handleMouseMove);

    return () => {
      document.removeEventListener('pointerup', handleMouseUp);
      document.removeEventListener('pointermove', handleMouseMove);
    };
  }, [moving, onMove]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick && onClick(e);
  };

  if (width === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        height: height,
        width: width,
        userSelect: 'none',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        outline: 'none',
        cursor: 'move'
      }}
      id="moveable"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {children}
      {withMoveHandle && (
        <Center
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            // if y is less than 30, move the handle to the bottom
            top: y < 30 ? height + 10 : -30,
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: theme.shadows.md,
            borderRadius: '20%',
            border: `1px solid ${theme.colors.gray[5]}`,
            backgroundColor: theme.colors.gray[0],
            padding: 2
          }}
        >
          <ArrowsMove color={theme.colors.gray[6]} size={14} />
        </Center>
      )}
      {withBorders && (
        <div
          style={{
            position: 'absolute',
            border: `2px dashed ${theme.colors.dark[2]}`,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            transform: 'scale(1.02)',
            borderRadius: 3,
            zIndex: 10
          }}
        ></div>
      )}
    </div>
  );
}
