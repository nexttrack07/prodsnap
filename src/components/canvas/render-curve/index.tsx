import { createStyles, useMantineTheme } from '@mantine/core';
import { atom, SetStateAction, useSetAtom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  CanvasElement,
  CanvasElementWithPointAtoms,
  MoveableElement,
  SVGCurveType,
  SVGCurveWithPointAtoms,
  SVGPointAtom,
  SVGPointType
} from '../store';
import { RenderPoint } from '../render-point';
import { RenderMarker } from './render-start-marker';
import { uuid } from '@/utils';

type Props = {
  element: SVGCurveWithPointAtoms;
  isSelected: boolean;
  position?: { x: number; y: number };
  onSelect: (e: React.MouseEvent) => void;
  setElement: (update: SetStateAction<CanvasElementWithPointAtoms>) => void;
};

const getPointsAtom = atomFamily((atoms: SVGPointAtom[]) =>
  atom((get) => {
    return atoms.map((atom) => get(atom));
  })
);

export const getPathFromPoints = (points: { x: number; y: number }[], isQuadratic = false) => {
  if (points.length < 2) {
    throw new Error('At least two points are required to create a path.');
  }

  let pathData = `M${points[0].x} ${points[0].y}`;

  if (isQuadratic && points.length > 2) {
    for (let i = 1; i < points.length - 1; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      pathData += ` Q${p1.x} ${p1.y} ${midX} ${midY}`;
    }
    const lastPoint = points[points.length - 1];
    pathData += ` L${lastPoint.x} ${lastPoint.y}`;
  } else {
    for (let i = 1; i < points.length; i++) {
      pathData += ` L${points[i].x} ${points[i].y}`;
    }
  }

  return pathData;
};

const useStyles = createStyles((theme) => ({
  path: {
    '&:hover + path': {
      filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))'
    }
  }
}));

export function RenderCurve({
  element,
  setElement,
  onSelect,
  isSelected,
  position = { x: 0, y: 0 }
}: Props) {
  const { points: pointAtoms, ...rest } = element;
  const points = useAtomValue(getPointsAtom(pointAtoms));
  const [moving, setMoving] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

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
      <CurveRenderer
        isSelected={isSelected}
        onMouseDown={handleMouseDown}
        element={{ points, ...rest }}
        position={position}
      />
    </>
  );
}

type CurveRendererProps = {
  element: SVGCurveType;
  position?: { x: number; y: number };
  onMouseDown?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

export function CurveRenderer({
  element,
  onMouseDown = () => {},
  onClick = () => {},
  isSelected = false,
  position = { x: 0, y: 0 }
}: CurveRendererProps) {
  const markerId = uuid();
  const { classes } = useStyles();
  const points = element.points;
  const { width, height } = getBoundingBox(points);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <svg
      style={{
        minHeight: 1,
        minWidth: 1,
        overflow: 'visible',
        display: 'block',
        width,
        height,
        position: 'absolute'
      }}
      vectorEffect="non-scaling-stroke"
      onClick={handleClick}
    >
      <defs>
        <RenderMarker
          orient="start"
          type={element.startMarker}
          id={`start-${markerId}`}
          size={element.markerSize ?? 30}
          color={element.stroke ?? 'black'}
        />
        <RenderMarker
          orient="end"
          type={element.endMarker}
          id={`end-${markerId}`}
          size={element.markerSize ?? 30}
          color={element.stroke ?? 'black'}
        />
      </defs>
      <g>
        <g style={{ userSelect: 'none' }}>
          <path
            onMouseDown={onMouseDown}
            className={classes.path}
            d={getPathFromPoints(
              points.map((p) => ({ ...p, x: p.x - position.x, y: p.y - position.y })),
              element.isQuadratic
            )}
            strokeWidth="32"
            fill="none"
            opacity={0}
            pointerEvents="auto"
            strokeLinecap="butt"
            stroke="transparent"
            cursor={isSelected ? 'move' : 'pointer'}
          />
          <path
            onMouseDown={onMouseDown}
            fill="none"
            strokeLinecap="butt"
            pointerEvents="auto"
            d={getPathFromPoints(
              points.map((p) => ({ ...p, x: p.x - position.x, y: p.y - position.y })),
              element.isQuadratic
            )}
            strokeWidth={element.strokeWidth}
            stroke={element.stroke}
            strokeDasharray={element.strokeDasharray}
            markerStart={`url(#start-${markerId})`}
            markerEnd={`url(#end-${markerId})`}
          />
        </g>
      </g>
    </svg>
  );
}

function getBoundingBox(points: SVGPointType[]): { width: number; height: number } {
  if (points.length === 0) {
    return { width: 0, height: 0 };
  }

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    if (points[i].x < minX) {
      minX = points[i].x;
    }
    if (points[i].x > maxX) {
      maxX = points[i].x;
    }
    if (points[i].y < minY) {
      minY = points[i].y;
    }
    if (points[i].y > maxY) {
      maxY = points[i].y;
    }
  }

  return { width: maxX - minX, height: maxY - minY };
}
