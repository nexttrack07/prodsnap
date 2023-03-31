import React, { useEffect } from 'react';
import { useAtomValue, useAtom } from 'jotai';
import { Draggable, Resizable, isMovingAtom } from '@/components/canvas/store';
import { isCroppingAtom } from '@/components/toolbar/image-toolbar';
import { useRef, useState } from 'react';
import { Center, useMantineTheme } from '@mantine/core';
import { ArrowsMove } from 'tabler-icons-react';

type Props = {
  dimension: Resizable;
  position: Draggable;
  onMove: (p: Draggable) => void;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  withMoveHandle?: boolean;
  withBorders?: boolean;
  hide?: boolean;
};

export function DragHandler({
  dimension,
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
  const isCropping = useAtomValue(isCroppingAtom);
  const theme = useMantineTheme();
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    lastPos.current = { x: e.clientX, y: e.clientY };
    setMoving(true && !hide);
  };

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      setMoving(false);
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

  if (isCropping) return null;

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
            top: -30,
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
            borderRadius: 3
          }}
        ></div>
      )}
    </div>
  );
}
