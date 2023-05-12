import { Dimension, Position, Rotation } from '@/stores/elements';
import { useMantineTheme } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

type Props = {
  attrs: Dimension & Position & Rotation;
  onPositionChange: (position: Position) => void;
  onRotate: (rotation: number) => void;
  children: React.ReactNode;
  show: boolean;
};

type DragStatus = 'idle' | 'move' | 'resize' | 'rotate';

export function DragHandler({ attrs, children, show, onPositionChange, onRotate }: Props) {
  const [dragStatus, setDragStatus] = useState<DragStatus>('idle');
  const [startAngle, setStartAngle] = useState(0);
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

    setStartAngle(R2D * Math.atan2(y, x));
    setDragStatus('rotate');
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
        border: `1px dashed ${theme.colors.gray[5]}`
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
          border: `1px solid ${theme.colors.gray[5]}`
        }}
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
          border: `1px solid ${theme.colors.gray[5]}`
        }}
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
          border: `1px solid ${theme.colors.gray[5]}`
        }}
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
