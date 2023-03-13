import { createStyles, useMantineTheme } from '@mantine/core';
import { atom, SetStateAction, useSetAtom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import React, { useCallback, useRef, useState, useEffect } from 'react';
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
    '&:hover + path': {
      stroke: theme.colors.blue[6]
    }
  }
}));

// const updatePointsAtom = atomFamily((pointAtoms: SVGPointAtom[]) =>
//   atom(null, (_, set, update: { x: number; y: number }) => {
//     pointAtoms.forEach(pointAtom => {
//       set(pointAtom, prev => ({ ...prev, x: prev.x + update.x, y: prev.y + update.y }));
//     })
//   })
// );

export function RenderCurve({ element, setElement, onSelect, isSelected }: Props) {
  const points = useAtomValue(getPointsAtom(element.points));
  const { classes } = useStyles();
  const [moving, setMoving] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  // const updatePoints = useSetAtom(updatePointsAtom(element.points));

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(e);
      if (isSelected) {
        setMoving(true);
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [isSelected, onSelect]
  );

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setMoving(false);
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      e.stopPropagation();
      if (moving) {
        const deltaX = e.clientX - lastPos.current.x;
        const deltaY = e.clientY - lastPos.current.y;
        // updatePoints({ x: deltaX, y: deltaY });
        setElement((prev) => {
          return {
            ...prev,
            points: points.map((point) =>
              atom({ ...point, x: point.x + deltaX, y: point.y + deltaY })
            )
          };
        });
      }
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [moving]);

  return (
    <>
      <svg
        style={{
          minHeight: 1,
          minWidth: 1,
          overflow: 'visible',
          display: 'block',
          width: '1',
          height: '10',
          position: 'absolute'
        }}
        vectorEffect="non-scaling-stroke">
        <g>
          <g style={{ userSelect: 'none' }}>
            <path
              onMouseDown={handleMouseDown}
              className={classes.path}
              d={getPathFromPoints(points)}
              strokeWidth="32"
              fill="none"
              opacity={0}
              pointerEvents="auto"
              strokeLinecap="butt"
              stroke="transparent"
              cursor={isSelected ? 'move' : 'pointer'}
            />
            <path
              onMouseDown={handleMouseDown}
              fill="none"
              strokeLinecap="butt"
              pointerEvents="auto"
              d={getPathFromPoints(points)}
              strokeWidth={element.strokeWidth}
              stroke={element.stroke}
            />
          </g>
        </g>
      </svg>
      {isSelected &&
        element.points.map((pointAtom) => (
          <RenderPoint key={`${pointAtom}`} width={element.strokeWidth} pointAtom={pointAtom} />
        ))}
    </>
  );
}
