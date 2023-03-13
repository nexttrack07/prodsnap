import { createStyles, useMantineTheme } from '@mantine/core';
import { atom, SetStateAction, useAtom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import React, { useCallback } from 'react';
import {
  CanvasElement,
  MoveableElement,
  SVGCurveType,
  SVGPointAtom,
  SVGPointType,
  Draggable
} from './store';
import { RenderPoint } from './render-point';

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
  path2: {
    '&:hover': {
      cursor: 'pointer',
    },
    '&:hover + path': {
      stroke: theme.colors.blue[6]
    }
  }
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
          overflow: 'visible',
          display: 'block',
          height: '100%',
          width: '100%',
          position: 'absolute'
        }}
        stroke={element.stroke}
        vectorEffect="non-scaling-stroke">
        <g>
          <g style={{ userSelect: 'none' }}>
            <path
              onMouseDown={handleMouseDown}
              className={classes.path2}
              d={getPathFromPoints(points)}
              strokeWidth="32"
              fill="none"
              opacity={0}
              pointerEvents="auto"
              strokeLinecap="butt"
              stroke="transparent"
            />
            <path
              onMouseDown={handleMouseDown}
              className={classes.path}
              fill="none"
              strokeLinecap='butt'
              pointerEvents='auto'
              d={getPathFromPoints(points)}
              strokeWidth={element.strokeWidth}
              stroke={element.stroke}
              markerEnd="url(#arrow)"
            />
          </g>
        </g>
      </svg>
      {isSelected &&
        element.points.map((pointAtom) => (
          <RenderPoint key={`${pointAtom}`} width={element.strokeWidth} pointAtom={pointAtom} />
        ))}
    </div>
  );
}

