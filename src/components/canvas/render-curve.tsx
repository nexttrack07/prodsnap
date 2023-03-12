import { createStyles, useMantineTheme } from '@mantine/core';
import { atom, SetStateAction, useAtom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import React, { useRef, useState, useCallback } from 'react';
import useEventListener from '../../utils/use-event';
import {
  CanvasElement,
  MoveableElement,
  SVGCurveType,
  SVGPointAtom,
  SVGPointType,
  Draggable
} from './store';

type SVGCanvasElement = MoveableElement & SVGCurveType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

const getPointsAtom = atomFamily((atoms: SVGPointAtom[]) =>
  atom((get) => {
    return atoms.map((atom) => get(atom));
  })
);

const getPathFromPoints = (points: (SVGPointType & Draggable)[]) => {
  return points.reduce((acc, point) => {
    if (acc === '') {
      return acc + `M ${point.x} ${point.y}`;
    } else {
      return acc + `L ${point.x} ${point.y}`;
    }
  }, '');
};

const useStyles = createStyles((theme) => ({
  path: {
    '&:hover': {
      cursor: 'pointer',
      stroke: theme.colors.blue[6]
    }
  },
}));

export function RenderCurve({ element, onSelect, isSelected }: Props) {
  const points = useAtomValue(getPointsAtom(element.points));
  const { classes } = useStyles();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e);
  }, []);

  return (
    <div
      style={{
        userSelect: 'none'
      }}>
      <svg
        style={{
          minHeight: 1,
          minWidth: 1,
          overflow: 'visible'
        }}
        vectorEffect="non-scaling-stroke">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <path
          onMouseDown={handleMouseDown}
          className={classes.path}
          d={getPathFromPoints(points)}
          strokeWidth={element.strokeWidth}
          stroke={element.stroke}
          markerEnd="url(#arrow)"
        />
      </svg>
      {isSelected &&
        element.points.map((pointAtom) => (
          <RenderPoint key={`${pointAtom}`} width={element.strokeWidth} pointAtom={pointAtom} />
        ))}
    </div>
  );
}

function RenderPoint({ pointAtom, width }: { pointAtom: SVGPointAtom; width: number }) {
  const [point, setPoint] = useAtom(pointAtom);
  const documentRef = useRef<Document>(document);
  const [isMoving, setIsMoving] = useState(false);
  const theme = useMantineTheme();

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
        left: point.x,
        top: point.y,
        transform: `translate(-${4}px,-${4 + width / 2}px)`,
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: theme.colors.blue[1],
        borderColor: theme.colors.blue[6],
        borderStyle: 'solid',
        borderWidth: 1,
        boxShadow: theme.shadows.sm
      }}></div>
  );
}
