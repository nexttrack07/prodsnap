import { Dimension, Position, Rotation } from '@/stores/elements';
import { useMantineTheme } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

type Props = {
  attrs: Dimension & Position & Rotation;
  show: boolean;
  children: React.ReactNode;
  onResize: (attrs: Dimension & Position) => void;
  onRotate: (rotation: number) => void;
  onPositionChange: (position: Position) => void;
};

type DragStatus =
  | 'idle'
  | 'move'
  | 'rotate'
  | 'resizing-br'
  | 'resizing-tl'
  | 'resizing-bl'
  | 'resizing-tr'
  | 'resizing-tm'
  | 'resizing-bm'
  | 'resizing-lm'
  | 'resizing-rm';
export function DragHandler({
  attrs,
  children,
  show,
  onResize,
  onRotate,
  onPositionChange
}: Props) {
  const [dragStatus, setDragStatus] = useState<DragStatus>('idle');
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const center = useRef({ x: 0, y: 0 });
  const theme = useMantineTheme();
  const R2D = 180 / Math.PI;

  const handleMoveMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setDragStatus('move');
  };

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const { x, y } = canvas.getBoundingClientRect();
      setCanvasPosition({ x, y });
    }
  }, []);

  const handleRotateMouseDown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    const { clientX, clientY } = e;

    center.current = {
      x: attrs.x + attrs.width / 2,
      y: attrs.y + attrs.height / 2
    };

    const posX = clientX - canvasPosition.x;
    const posY = clientY - canvasPosition.y;
    const x = posX - center.current.x;
    const y = posY - center.current.y;

    setDragStatus('rotate');
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    type: DragStatus
  ) => {
    e.stopPropagation();
    setDragStatus(type);
    // lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    // handleMouseUp handler resets the dragStatus to idle
    const handleMouseUp = () => {
      setDragStatus('idle');
    };

    // handleMouseMove handler updates the position of the element if the dragStatus is 'move'
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (dragStatus === 'move') {
        onPositionChange({
          x: e.movementX,
          y: e.movementY
        });
      } else if (dragStatus === 'rotate') {
        const posX = e.clientX - canvasPosition.x;
        const posY = e.clientY - canvasPosition.y;
        const x = posX - center.current.x;
        const y = posY - center.current.y;
        const d = R2D * Math.atan2(y, x);
        const currentRotation = d;
        onRotate(currentRotation + 90);
      } else if (dragStatus === 'resizing-br') {
        const delta = e.movementX;
        onResize({ x: 0, y: 0, width: delta, height: delta });
      } else if (dragStatus === 'resizing-tl') {
        const delta = e.movementX;
        onResize({ x: delta, y: delta, width: -delta, height: -delta });
      } else if (dragStatus === 'resizing-bl') {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        onResize({ x: deltaX, y: 0, width: -deltaX, height: deltaY });
      } else if (dragStatus === 'resizing-tr') {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        onResize({ x: 0, y: deltaY, width: deltaX, height: -deltaY });
      } else if (dragStatus === 'resizing-tm') {
        const delta = e.movementY;
        onResize({ x: 0, y: delta, width: 0, height: -delta });
      } else if (dragStatus === 'resizing-bm') {
        const delta = e.movementY;
        onResize({ x: 0, y: 0, width: 0, height: delta });
      } else if (dragStatus === 'resizing-lm') {
        const delta = e.movementX;
        onResize({ x: delta, y: 0, width: -delta, height: 0 });
      } else if (dragStatus === 'resizing-rm') {
        const delta = e.movementX;
        onResize({ x: 0, y: 0, width: delta, height: 0 });
      }
    };

    // attach the event listeners
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    // detach the event listeners
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dragStatus]);

  if (!show) {
    return (
      <div
        style={{
          position: 'absolute',
          top: attrs.y,
          left: attrs.x,
          width: attrs.width,
          height: attrs.height,
          transform: `rotate(${attrs.angle ?? 0}deg)`,
          transformOrigin: 'center center',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        {children}
      </div>
    );
  }

  console.log('dragStatus', dragStatus);

  return (
    <div
      onMouseDown={handleMoveMouseDown}
      style={{
        position: 'absolute',
        top: attrs.y,
        left: attrs.x,
        width: attrs.width,
        height: attrs.height,
        transform: `rotate(${attrs.angle ?? 0}deg)`,
        transformOrigin: 'center center',
        outline: 'none',
        cursor: 'move',
        border: `1px dashed ${theme.colors.gray[4]}`
      }}
      id="drag-handler"
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 15,
          height: 15,
          borderRadius: '100%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: theme.colors.gray[0],
          border: `1px solid ${theme.colors.gray[5]}`,
          cursor: 'grab'
        }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-tl')}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 15,
          height: 15,
          borderRadius: '100%',
          transform: 'translate(50%, -50%)',
          backgroundColor: theme.colors.gray[0],
          border: `1px solid ${theme.colors.gray[5]}`,
          cursor: 'grab'
        }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-tr')}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 15,
          height: 15,
          borderRadius: '100%',
          transform: 'translate(50%, 50%)',
          backgroundColor: theme.colors.gray[0],
          border: `1px solid ${theme.colors.gray[5]}`,
          cursor: 'grab'
        }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-br')}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 15,
          height: 15,
          borderRadius: '100%',
          transform: 'translate(-50%, 50%)',
          backgroundColor: theme.colors.gray[0],
          border: `1px solid ${theme.colors.gray[5]}`,
          cursor: 'grab'
        }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-bl')}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -Math.min(40, Math.max(attrs.width * 0.4, 70)),
          width: 15,
          height: 15,
          borderRadius: '100%',
          transform: 'translateX(-50%)',
          backgroundColor: theme.colors.gray[0],
          border: `1px solid ${theme.colors.gray[5]}`,
          cursor: 'crosshair'
        }}
        onMouseDown={handleRotateMouseDown}
      />
    </div>
  );
}
