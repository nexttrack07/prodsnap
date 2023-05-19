import { Curve, Element, PointAtom } from '@/stores/elements';
import { uuid } from '@/utils';
import { createStyles } from '@mantine/core';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { RenderMarker } from '../../canvas/render-curve/render-start-marker';
import { PointRenderer } from './point-renderer';

type Props = {
  element: Element & Curve;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  setElement: (update: SetStateAction<Element & Curve>) => void;
  position?: { x: number; y: number };
};

const getPointsAtom = atomFamily((atoms: PointAtom[]) =>
  atom((get) => {
    return atoms.map((atom) => get(atom));
  })
);

const useStyles = createStyles((theme) => ({
  path: {
    '&:hover + path': {
      filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))'
    }
  }
}));

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

export function CurveRenderer({
  element,
  onSelect,
  isSelected,
  setElement,
  position = { x: 0, y: 0 }
}: Props) {
  const points = useAtomValue(getPointsAtom(element.points));
  const { classes } = useStyles();
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
  const markerId = uuid();
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
        onClick={(e) => e.stopPropagation()}
      >
        <defs>
          <RenderMarker
            orient="start"
            type={element.markerProps.startMarker}
            id={`start-${markerId}`}
            size={element.markerProps.markerSize ?? 30}
            color={element.pathProps.stroke ?? 'black'}
          />
          <RenderMarker
            orient="end"
            type={element.markerProps.endMarker}
            id={`end-${markerId}`}
            size={element.markerProps.markerSize ?? 30}
            color={element.pathProps.stroke ?? 'black'}
          />
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
              strokeWidth={element.pathProps.strokeWidth}
              stroke={element.pathProps.stroke}
              strokeDasharray={element.pathProps.strokeDasharray}
              markerStart={`url(#start-${markerId})`}
              markerEnd={`url(#end-${markerId})`}
            />
          </g>
        </g>
      </svg>
      {isSelected &&
        element.points.map((pointAtom) => (
          <PointRenderer
            position={position}
            key={`${pointAtom}`}
            width={element.pathProps.strokeWidth ? +element.pathProps.strokeWidth : 0}
            pointAtom={pointAtom}
          />
        ))}
    </>
  );
}
