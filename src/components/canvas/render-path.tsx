import React from 'react';
import { Box, createStyles, useMantineTheme } from "@mantine/core";
import { SetStateAction } from "jotai";
import { useState, useEffect, useRef } from "react";
import { CanvasElement, MoveableElement, SVGPathType } from "./store";

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

type Status =
  | "idle"
  | "rotating"
  | "moving"
  | "resizing-br"
  | "resizing-tl"
  | "resizing-bl"
  | "resizing-tr";

const useStyles = createStyles(theme => ({
  resizeHandle: {
    backgroundColor: theme.colors.gray[2],
    border: `1px solid ${theme.colors.dark[3]}`,
    borderRadius: '50%',
    width: 18,
    height: 18,
    position: 'absolute',
  }
}))

export function RenderPath({ element, onSelect, setElement, isSelected }: Props) {
  const { x, y, width, height } = element;
  const [status, setStatus] = useState<Status>('idle');
  const ref = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('moving');
    lastPos.current = { x: e.clientX, y: e.clientY };
    console.log('element: ', element, JSON.stringify(element));
  }

  const handleResizeMouseDown = (e: React.MouseEvent, status: Status) => {
    e.stopPropagation();
    setStatus(status);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      e.stopPropagation();
      if (status === 'moving') {
        const deltaX = e.clientX - lastPos.current.x + x;
        const deltaY = e.clientY - lastPos.current.y + y;
        setElement(el => ({ ...el, x: deltaX, y: deltaY }));
      } else if (status === 'resizing-br') {
        const deltaX = e.clientX - lastPos.current.x + width;
        setElement(el => ({ ...el, width: deltaX, height: el.height / el.width * deltaX }))
      }
    }

    function handleMouseUp(e: MouseEvent) {
      e.stopPropagation();
      setStatus('idle');
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [status, setElement])


  return (
    <Box
      ref={ref}
      onMouseDown={handleMouseDown}
      style={{
        left: x,
        top: y,
        width,
        height,
        position: 'absolute',
        border: isSelected ? `3px solid ${theme.colors.indigo[8]}` : '',
      }}
      onClick={onSelect}
    >
      <svg
        opacity={element.opacity}
        {...element.props}
        viewBox={element.getViewBox(width, height)}
      >
        <path
          {...element.path}
          d={element.getPath(width, height)}
        />
      </svg>
      <svg
        opacity={element.opacity}
        {...element.props}
        viewBox={element.getViewBox(width, height)}
      >
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
      {isSelected &&
        <span
          className={classes.resizeHandle}
          style={{ bottom: 0, right: 0, transform: 'translate(50%, 50%)' }}
          onMouseDown={e => handleResizeMouseDown(e, 'resizing-br')}
        />
      }
    </Box>
  );
}
