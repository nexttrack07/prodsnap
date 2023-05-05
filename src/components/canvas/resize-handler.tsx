import { createStyles } from '@mantine/core';
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Resizable } from '@/components/canvas/store';

export const useResizeStyles = createStyles((theme) => ({
  resize: {
    backgroundColor: theme.colors.gray[0],
    border: `1px solid ${theme.colors.gray[5]}`,
    borderRadius: '25%',
    width: 12,
    height: 12,
    position: 'absolute',
    '&:hover': {
      filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))'
    }
  },
  resize_br: {
    bottom: 0,
    right: 0,
    transform: `translate(50%, 50%)`,
    cursor: 'se-resize'
  },
  resize_bl: {
    bottom: 0,
    left: 0,
    transform: `translate(-50%, 50%)`,
    cursor: 'sw-resize'
  },
  resize_tl: {
    top: 0,
    left: 0,
    cursor: 'nw-resize',
    transform: `translate(-50%, -50%)`
  },
  resize_tr: {
    top: 0,
    right: 0,
    cursor: 'ne-resize',
    transform: `translate(50%, -50%)`
  },
  resize_tm: {
    borderRadius: '40%',
    width: 20,
    height: 10,
    top: 0,
    left: '50%',
    cursor: 'n-resize',
    transform: `translate(-50%, -50%)`
  },
  resize_bm: {
    borderRadius: '40%',
    width: 20,
    height: 10,
    bottom: 0,
    left: '50%',
    cursor: 's-resize',
    transform: `translate(-50%, 50%)`
  },
  resize_lm: {
    borderRadius: '40%',
    height: 20,
    width: 10,
    left: 0,
    cursor: 'w-resize',
    top: '50%',
    transform: `translate(-50%, -50%)`
  },
  resize_rm: {
    borderRadius: '40%',
    height: 20,
    width: 10,
    right: 0,
    cursor: 'e-resize',
    top: '50%',
    transform: `translate(50%, -50%)`
  },
  borders: {
    border: `1px solid ${theme.colors.gray[5]}`
  }
}));

type Props = {
  show?: boolean;
  dimension: Resizable;
  withSEResize?: boolean;
  withSWResize?: boolean;
  withNEResize?: boolean;
  withNWResize?: boolean;
  withTMResize?: boolean;
  withBMResize?: boolean;
  withLMResize?: boolean;
  withRMResize?: boolean;
  onResize: (p: { x: number; y: number; width: number; height: number }) => void;
};

export type Status =
  | 'idle'
  | 'resizing-br'
  | 'resizing-tl'
  | 'resizing-bl'
  | 'resizing-tr'
  | 'resizing-tm'
  | 'resizing-bm'
  | 'resizing-lm'
  | 'resizing-rm';

export function ResizeHandler({
  dimension,
  show = true,
  withBMResize = true,
  withLMResize = true,
  withNEResize = true,
  withTMResize = true,
  withNWResize = true,
  withRMResize = true,
  withSEResize = true,
  withSWResize = true,
  onResize
}: Props) {
  const { width, height } = dimension;
  const { classes } = useResizeStyles();
  const [status, setStatus] = React.useState<Status>('idle');
  const lastPosition = React.useRef({ x: 0, y: 0 });

  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    type: Status
  ) => {
    e.stopPropagation();
    setStatus(type);
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (status === 'idle') return;

      if (status === 'resizing-br') {
        const delta = e.movementX;
        onResize({ x: 0, y: 0, width: delta, height: delta });
      } else if (status === 'resizing-tl') {
        const delta = e.movementX;
        onResize({ x: delta, y: delta, width: -delta, height: -delta });
      } else if (status === 'resizing-bl') {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        onResize({ x: deltaX, y: 0, width: -deltaX, height: deltaY });
      } else if (status === 'resizing-tr') {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        onResize({ x: 0, y: deltaY, width: deltaX, height: -deltaY });
      } else if (status === 'resizing-tm') {
        const delta = e.movementY;
        onResize({ x: 0, y: delta, width: 0, height: -delta });
      } else if (status === 'resizing-bm') {
        const delta = e.movementY;
        onResize({ x: 0, y: 0, width: 0, height: delta });
      } else if (status === 'resizing-lm') {
        const delta = e.movementX;
        onResize({ x: delta, y: 0, width: -delta, height: 0 });
      } else if (status === 'resizing-rm') {
        const delta = e.movementX;
        onResize({ x: 0, y: 0, width: delta, height: 0 });
      }
    };

    const handleMouseUp = () => {
      setStatus('idle');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [status]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width,
        height
      }}
      className={classes.borders}
    >
      {withNEResize && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-tl')}
          className={clsx(classes.resize, classes.resize_tl)}
        />
      )}
      {withNWResize && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-tr')}
          className={clsx(classes.resize, classes.resize_tr)}
        />
      )}
      {withSWResize && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-bl')}
          className={clsx(classes.resize, classes.resize_bl)}
        />
      )}
      {withSEResize && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-br')}
          className={clsx(classes.resize, classes.resize_br)}
        />
      )}
      {withTMResize && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-tm')}
          className={clsx(classes.resize, classes.resize_tm)}
        />
      )}
      {withBMResize && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-bm')}
          className={clsx(classes.resize, classes.resize_bm)}
        />
      )}
      {withLMResize && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-lm')}
          className={clsx(classes.resize, classes.resize_lm)}
        />
      )}
      {withRMResize && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-rm')}
          className={clsx(classes.resize, classes.resize_rm)}
        />
      )}
    </div>
  );
}
