import { useEffect, useRef, useState } from 'react';
import { Resizable } from './store';
import { createStyles } from '@mantine/core';

type Props = {
  position: { x: number; y: number };
  dimension: Resizable;
  onRotate: (rotation: number) => void;
  show?: boolean;
};

const useStyles = createStyles((theme) => ({
  rotateHandler: {
    position: 'absolute',
    top: -40,
    left: '50%',
    width: 12,
    height: 12,
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

export function RotateHandler({ dimension, position, onRotate, show = true }: Props) {
  const [isActive, setIsActive] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
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
    const { clientX, clientY } = e;

    center.current = {
      x: position.x + dimension.width / 2,
      y: position.y + dimension.height / 2
    };

    const posX = clientX - canvasPosition.x;
    const posY = clientY - canvasPosition.y;
    const x = posX - center.current.x;
    const y = posY - center.current.y;

    setStartAngle(R2D * Math.atan2(y, x));
    setIsActive(true);

    // middle of the element
    const middle = {
      x: position.x + dimension.width / 2,
      y: position.y - 40
    };
    console.log('expected position: ', middle);
    console.log('actual position: ', { x: posX, y: posY });
    console.log('actual position: ', { x: clientX, y: clientY });
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
        onRotate(currentRotation);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
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

  return <div onMouseDown={handleRotateMouseDown} className={classes.rotateHandler} />;
}
