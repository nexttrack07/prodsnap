import React, { useRef, useState } from 'react';
import { createStyles } from '@mantine/core';
import { useAtom } from 'jotai';
import { SVGPointAtom } from './store';
import useEventListener from '../../utils/use-event';

const useStyles = createStyles((theme) => ({
  point: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: theme.colors.gray[1],
    borderColor: theme.colors.gray[6],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: theme.shadows.sm,
    '&:hover': {
      // stroke: theme.colors.blue[6]
      filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))'
    }
  }
}));

export function RenderPoint({
  pointAtom,
  width,
  position
}: {
  pointAtom: SVGPointAtom;
  width: number;
  position: { x: number; y: number };
}) {
  const [point, setPoint] = useAtom(pointAtom);
  const documentRef = useRef<Document>(document);
  const [isMoving, setIsMoving] = useState(false);
  const { classes } = useStyles();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMoving(true);
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    setIsMoving(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    if (isMoving) {
      setPoint((el) => ({ ...el, x: e.movementX + el.x, y: e.movementY + el.y }));
    }
  };

  useEventListener('pointerup', handleMouseUp, documentRef);
  useEventListener('pointermove', handleMouseMove, documentRef, [isMoving]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: point.x - position.x,
        top: point.y - position.y,
        transform: `translate(-${4}px,-${4 + width / 2}px)`,
        cursor: isMoving ? 'grabbing' : 'pointer'
      }}
      className={classes.point}
    ></div>
  );
}
