import React from 'react';
import { Box, createStyles } from '@mantine/core';
import { SetStateAction } from 'jotai';
import { useState, useRef } from 'react';
import { CanvasElement, Draggable, MoveableElement, SVGPathType } from '@/components/canvas/store';
import { DragHandler } from './drag-handler';
import { ResizeHandler } from './resize-handler';

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

type Status =
  | 'idle'
  | 'rotating'
  | 'moving'
  | 'resizing-br'
  | 'resizing-tl'
  | 'resizing-bl'
  | 'resizing-tr';

const useStyles = createStyles((theme) => ({
  resizeHandle: {
    backgroundColor: theme.colors.blue[0],
    border: `1px solid ${theme.colors.blue[4]}`,
    borderRadius: '50%',
    width: 16,
    height: 16,
    position: 'absolute'
  }
}));

export function RenderPath({ element, onSelect, setElement, isSelected }: Props) {
  const { x, y, width, height } = element;
  const { classes } = useStyles();
  const [status, setStatus] = useState<Status>('idle');

  console.log('hello');
  const lastPos = useRef({ x: 0, y: 0 });

  const handleResizeMouseDown = (e: React.MouseEvent, status: Status) => {
    e.stopPropagation();
    setStatus(status);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (p: Draggable) => {
    setElement((el) => ({ ...el, x: p.x + el.x, y: p.y + el.y }));
  };

  const handleClick = (e: React.MouseEvent) => {
    onSelect(e);
  };

  return (
    <DragHandler
      onClick={handleClick}
      position={{ x, y }}
      dimension={{ width, height }}
      onMove={handleMouseMove}>
      <svg opacity={element.opacity} {...element.props} viewBox={element.getViewBox(width, height)}>
        <path {...element.path} d={element.getPath(width, height)} />
      </svg>
      <svg opacity={element.opacity} {...element.props} viewBox={element.getViewBox(width, height)}>
        <clipPath id={element.strokeProps.clipPathId}>
          <path d={element.getPath(width, height)} />
        </clipPath>
        <path
          d={element.getPath(width, height)}
          stroke={element.strokeProps.stroke}
          strokeWidth={element.strokeProps.strokeWidth}
          strokeLinecap={element.strokeProps.strokeLinecap}
          strokeDasharray={element.strokeProps.strokeDasharray}
          clipPath={element.strokeProps.clipPathId}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* {isSelected && (
        <span
          className={classes.resizeHandle}
          style={{ bottom: 0, right: 0, transform: 'translate(50%, 50%)' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-br')}
        />
      )} */}
      <ResizeHandler dimension={{ width, height }} />
    </DragHandler>
  );
}
