import { useEffect, useRef, useState } from 'react';
import { Resizable } from './store';
import { createStyles, useMantineTheme } from '@mantine/core';
import { Rotate } from 'tabler-icons-react';

type Props = {
  position: { x: number; y: number };
  dimension: Resizable;
  onRotate: (rotation: number) => void;
  show?: boolean;
};

export function RotateHandler({ dimension, position, onRotate, show = true }: Props) {
  const [isActive, setIsActive] = useState(false);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const theme = useMantineTheme();

  const useStyles = createStyles((theme) => ({
    rotateHandler: {
      position: 'absolute',
      // position it in the top, the distance should be min of -40px and max of -80px and by default
      // it is 0.5 * width of the element
      top: -Math.min(Math.max(40, 0.5 * dimension.width), 80),
      left: '50%',
      width: 15,
      height: 15,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'grab',
      transform: 'translate(-50%, -50%)',
      border: `1px solid ${theme.colors.gray[5]}`,
      borderRadius: '50%',
      backgroundColor: theme.colors.gray[0],
      '&:hover': {
        filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))'
      }
    }
  }));

  const { classes } = useStyles();
  const center = useRef({ x: 0, y: 0 });
  const R2D = 180 / Math.PI;

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const { x, y } = canvas.getBoundingClientRect();
      setCanvasPosition({ x, y });
    }
  }, []);

  const handleRotateMouseDown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();

    center.current = {
      x: position.x + dimension.width / 2,
      y: position.y + dimension.height / 2
    };

    setIsActive(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isActive) {
        e.preventDefault();
        const posX = e.clientX - canvasPosition.x;
        const posY = e.clientY - canvasPosition.y;
        const x = posX - center.current.x;
        const y = posY - center.current.y;
        const d = R2D * Math.atan2(y, x);
        const currentRotation = d; // - startAngle;
        onRotate(currentRotation + 90);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsActive(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive]); // Add startRotation as a dependency

  if (!show) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={handleRotateMouseDown}
      className={classes.rotateHandler}
    >
      <Rotate color={theme.colors.gray[6]} size={12} />
    </div>
  );
}
