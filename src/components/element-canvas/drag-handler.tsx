import { Dimension, Position, Rotation } from '@/stores/elements';
import { useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';

type Props = {
  attrs: Dimension & Position & Rotation;
  onPositionChange: (position: Position) => void;
  children: React.ReactNode;
  show: boolean;
};

type DragStatus = 'idle' | 'move' | 'resize' | 'rotate';

export function DragHandler({ attrs, children, show, onPositionChange }: Props) {
  const [dragStatus, setDragStatus] = useState<DragStatus>('idle');
  const theme = useMantineTheme();

  const handleMoveMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setDragStatus('move');
  };

  useEffect(() => {
    // handleMouseUp handler resets the dragStatus to idle
    const handleMouseUp = () => {
      setDragStatus('idle');
    };

    // handleMouseMove handler updates the position of the element if the dragStatus is 'move'
    const handleMouseMove = (e: MouseEvent) => {
      if (dragStatus === 'move') {
        onPositionChange({
          x: e.movementX,
          y: e.movementY
        });
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
        border: show ? `1px dashed ${theme.colors.gray[5]}` : 'none'
      }}
      id="drag-handler"
    >
      {children}
    </div>
  );
}
