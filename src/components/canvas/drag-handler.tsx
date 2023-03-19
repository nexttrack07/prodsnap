import React from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { Draggable, Resizable, selectedItemsAtom } from '@/components/canvas/store';
import { isCroppingAtom } from '@/components/toolbar/image-toolbar';
import { useCallback, useRef, useState } from 'react';
import { ActionIcon, Center, ThemeIcon, useMantineTheme } from '@mantine/core';
import { useEventListener } from '@/utils';
import { ArrowsMove, BorderRadius } from 'tabler-icons-react';

type Props = {
  dimension: Resizable;
  position: Draggable;
  onMove: (p: Draggable) => void;
  children?: React.ReactNode;
};

export function DragHandler({ dimension, position, onMove, children }: Props) {
  const { x, y } = position;
  const { width, height } = dimension;
  const isCropping = useAtomValue(isCroppingAtom);
  const selected = useAtomValue(selectedItemsAtom);
  const documentRef = useRef<Document>(document);
  const theme = useMantineTheme();
  const [moving, setMoving] = useState(false);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setMoving(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMoving(true);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    if (moving) {
      onMove({ x: e.movementX, y: e.movementY });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEventListener('pointerup', handleMouseUp, documentRef);
  useEventListener('pointermove', handleMouseMove, documentRef, [moving]);

  if (isCropping) return null;

  if (width === 0) return null;

  if (selected.elements.length < 2) return null;

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
      onClick={handleClick}>
      {children}
      <Center
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          top: -50,
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '0 0 4px rbga(0,0,0,0.5)',
          borderRadius: '50%',
          border: `1px solid ${theme.colors.blue[4]}`,
          backgroundColor: theme.colors.blue[0],
          padding: 2
        }}>
        <ArrowsMove color={theme.colors.blue[7]} size={14} />
      </Center>
      <div
        style={{
          position: 'absolute',
          border: `2px dashed ${theme.colors.blue[3]}`,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(1.03)',
          borderRadius: 3
        }}></div>
    </div>
  );
}
