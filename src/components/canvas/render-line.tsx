import React, { useEffect, useRef, useState } from 'react';
import { atom, SetStateAction, useAtom, useAtomValue } from 'jotai';
import { MoveableElement, SVGLineType } from './store';
import { RenderPoint } from './render-point';
import { createStyles } from '@mantine/core';

type SVGLineElement = MoveableElement & SVGLineType;

type Props = {
  element: SVGLineElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  setElement: (update: SetStateAction<SVGLineElement>) => void;
};

const useStyles = createStyles((theme) => ({
  line: {
    '&:hover + line': {
      stroke: theme.colors.blue[6]
    }
  }
}))

export function RenderLine({ element, setElement, onSelect, isSelected }: Props) {
  const start = useAtomValue(element.start);
  const end = useAtomValue(element.end);
  const { classes } = useStyles();
  const [moving, setMoving] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });


  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e);
    if (isSelected) {
      setMoving(true);
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  useEffect(() => {
    function handleMouseUp(e: MouseEvent) {
      e.stopPropagation();
      setMoving(false);
    }

    function handleMouseMove(e: MouseEvent) {
      e.stopPropagation();
      if (moving) {
        const deltaX = e.clientX - lastPos.current.x;
        const deltaY = e.clientY - lastPos.current.y;
        setElement((prev) => {
          return {
            ...prev,
            start: atom({ ...start, x: start.x + deltaX, y: start.y + deltaY }),
            end: atom({ ...end, x: end.x + deltaX, y: end.y + deltaY }),
          }
        })
      }
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [moving]);

  return (
    <>
      <svg
        style={{
          overflow: 'visible',
          width: '1',
          height: '10',
          display: 'block',
          position: 'absolute',
          minHeight: 1,
          minWidth: 1,
        }}
        opacity={element.opacity}>
        <g>
          <g style={{ userSelect: 'none' }}>
            <line
              onMouseDown={handleMouseDown}
              className={classes.line}
              {...element.strokeProps}
              strokeWidth={32}
              opacity={0}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              fill="none"
              cursor={isSelected ? 'move' : 'pointer'}
            />
            <line
              {...element.strokeProps}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              fill="none"
            />
          </g>
        </g>
      </svg>
      {isSelected && (
        <>
          <RenderPoint pointAtom={element.start} width={element.strokeProps.strokeWidth ?? 4} />
          <RenderPoint pointAtom={element.end} width={element.strokeProps.strokeWidth ?? 4} />
        </>
      )}
    </>
  );
}
