import { createStyles, useMantineTheme } from '@mantine/core';
import { atom, SetStateAction, useSetAtom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  CanvasElement,
  CanvasElementWithPointAtoms,
  MoveableElement,
  SVGCurveWithPointAtoms,
  SVGPointAtom
} from './store';
import { RenderPoint } from './render-point';

const START_MARKERS = {
  none: null,
  'outline-arrow': (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 2.5,-1.5,0.5,0,2.5,1.5 "
    />
  ),
  'fill-arrow': (
    <path
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 2.5,-1.5,0.5,0,2.5,1.5 Z"
    />
  ),
  'outline-circle': (
    <circle strokeWidth={1} stroke="currentColor" fill="none" cx={0} cy={0} r="1.2" />
  )
} as const;

const END_MARKERS = {
  none: null,
  'outline-arrow': (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M -2.5,-1.5,-0.5,0,-2.5,1.5 "
    />
  ),
  'fill-arrow': (
    <path
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M -2.5,-1.5,-0.5,0,-2.5,1.5 Z"
    />
  ),
  'outline-circle': (
    <circle strokeWidth={1} stroke="currentColor" fill="none" cx={0} cy={0} r="1.2" />
  )
} as const;

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

// const getPathFromPoints = (points: { x: number; y: number }[]) => {
//   return points.reduce((acc, point) => {
//     if (acc === '') {
//       return acc + `M ${point.x} ${point.y}`;
//     } else {
//       return acc + `L ${point.x} ${point.y}`;
//     }
//   }, '');
// };

const getPathFromPoints = (points: { x: number; y: number }[], isQuadratic = false) => {
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
      stroke: theme.colors.blue[6]
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
  const points = useAtomValue(getPointsAtom(element.points));
  const { classes } = useStyles();
  const [moving, setMoving] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  // const updatePoints = useSetAtom(updatePointsAtom(element.points));
  const { strokeWidth, stroke } = element;

  console.log('position', position);

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
  const markerSize = Math.max(4, strokeWidth ?? 0 * 2);
  const refX = markerSize * 0.8;
  const pathD = `M0,0 L${markerSize},${markerSize / 2} L0,${markerSize}`;
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
        vectorEffect="non-scaling-stroke"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth={element.strokeWidth}
            markerHeight={element.strokeWidth}
            orient="auto-start-reverse"
          >
            {START_MARKERS[element.startMarker]}
          </marker>
          <marker
            id="circle-marker"
            viewBox="0 0 10 10"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
          >
            <circle cx="3" cy="3" r="3" fill="currentColor" />
          </marker>
          <marker
            id="outline-arrow-marker"
            viewBox={`0 0 ${markerSize} ${markerSize}`}
            refX={refX}
            refY={markerSize / 2}
            orient="auto"
          >
            <path d={pathD} fill="none" stroke={stroke} />
          </marker>
        </defs>
        <g>
          <g style={{ userSelect: 'none' }}>
            <path
              onMouseDown={handleMouseDown}
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
              onMouseDown={handleMouseDown}
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
              markerEnd="url(#outline-arrow-marker)"
            />
          </g>
          {/* <g
            // style={{ position: 'absolute', left: points.at(0)!.x, top: points.at(-1)!.y }}
            // transform="translate(0 3.5) scale(7)"
            color={element.stroke}
            transform={`translate(${points.at(0)!.x - 7} ${points.at(0)!.y}) scale(5)`}
          >
            {START_MARKERS[element.startMarker]}
          </g>
          <g
            // style={{ position: 'absolute', left: points.at(0)!.x, top: points.at(-1)!.y }}
            // transform="translate(0 3.5) scale(7)"
            color={element.stroke}
            transform={`translate(${points.at(-1)!.x + 7} ${points.at(-1)!.y}) scale(5)`}
          >
            {END_MARKERS[element.endMarker]}
          </g> */}
        </g>
      </svg>
      {isSelected &&
        element.points.map((pointAtom) => (
          <RenderPoint
            position={position}
            key={`${pointAtom}`}
            width={element.strokeWidth ?? 0}
            pointAtom={pointAtom}
          />
        ))}
    </>
  );
}
