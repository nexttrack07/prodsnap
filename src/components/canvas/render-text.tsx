import React, { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { MoveableElement, TextType } from './store';
import { Box, Center, useMantineTheme } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';
import clsx from 'clsx';
import { useResizeStyles } from './resize-handler';

type Status =
  | 'none'
  | 'rotate'
  | 'move'
  | 'resizing-br'
  | 'resizing-tl'
  | 'resizing-bl'
  | 'resizing-tr'
  | 'resizing-tm'
  | 'resizing-bm'
  | 'resizing-lm'
  | 'resizing-rm';

function selectElementContents(el: HTMLElement) {
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

export function RenderText({
  element,
  isSelected,
  onSelect,
  setElement
}: {
  element: MoveableElement & TextType;
  setElement: (update: SetStateAction<MoveableElement & TextType>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [editable, setEditable] = useState(false);
  const [status, setStatus] = useState<Status>('none');
  const lastPos = useRef({ x: 0, y: 0 });
  const { classes } = useResizeStyles();

  useWindowEvent('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditable(false);
    }
  });

  useEffect(() => {
    if (textRef.current) {
      setElement((el) => ({
        ...el,
        width: textRef.current!.offsetWidth,
        height: textRef.current!.offsetHeight
      }));
    }
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setEditable(false);

      if (status === 'move') {
        const deltaX = e.clientX - lastPos.current.x + element.x;
        const deltaY = e.clientY - lastPos.current.y + element.y;
        setElement((el) => ({ ...el, x: deltaX, y: deltaY }));
      } else if (status === 'resizing-br') {
        const newWidth = e.clientX - lastPos.current.x + element.width;
        const newFontSize = (newWidth / element.width) * (element.props.fontSize as number);
        // calculate new height based on new width
        const newHeight = (newWidth / element.width) * element.height;
        setElement((el) => ({
          ...el,
          width: newWidth,
          height: newHeight,
          props: { ...el.props, fontSize: newFontSize }
        }));
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      setStatus('none');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [status]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      lastPos.current = { x: e.clientX, y: e.clientY };
      setStatus('move');
      onSelect(e);
      if (isSelected) {
        selectElementContents(ref.current!);
        setEditable(true);
      }
    },
    [isSelected]
  );

  const handleResizeMouseDown = (e: React.MouseEvent, stat: Status) => {
    e.stopPropagation();
    setStatus(stat);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleBlur = (e: React.FocusEvent) => {
    setElement((prev) => ({
      ...prev,
      content: (e.target as HTMLDivElement).innerText,
      width: (e.target as HTMLDivElement).offsetWidth,
      height: (e.target as HTMLDivElement).offsetHeight
    }));
    setEditable(false);
  };

  const cursor =
    isSelected && status === 'move'
      ? 'move'
      : isSelected && status === 'resizing-br'
      ? 'se-resize'
      : isSelected && editable
      ? 'text'
      : 'pointer';

  return (
    <Center
      ref={ref}
      style={{
        left: element.x,
        top: element.y,
        userSelect: 'none',
        position: 'absolute',
        whiteSpace: 'pre-wrap',
        // width: element.width,
        // height: element.height,
        cursor,
        ...element.props
      }}
      onClick={onSelect}
      className={clsx({ [classes.borders]: isSelected })}
    >
      <div
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onBlur={handleBlur}
        contentEditable={editable}
        suppressContentEditableWarning={true}
        ref={textRef}
      >
        {element.content}
      </div>
      {isSelected && (
        <>
          <span
            onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-tl')}
            className={clsx(classes.resize, classes.resize_tl)}
          />
          <span
            onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-tr')}
            className={clsx(classes.resize, classes.resize_tr)}
          />
          <span
            onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-bl')}
            className={clsx(classes.resize, classes.resize_bl)}
          />
          <span
            onMouseDown={(e) => handleResizeMouseDown(e, 'resizing-br')}
            className={clsx(classes.resize, classes.resize_br)}
          />
        </>
      )}
    </Center>
  );
}

function reverseString(str: string): string {
  return str.split('').reverse().join('');
}
