import React, { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { MoveableElement, TextType } from './store';
import { Box, Center, useMantineTheme } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

type Status = 'none' | 'rotate' | 'move' | 'resize-br' | 'resize-tl' | 'resize-bl' | 'resize-tr';

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
  const [editable, setEditable] = useState(false);
  const theme = useMantineTheme();
  const [status, setStatus] = useState<Status>('none');
  const lastPos = useRef({ x: 0, y: 0 });

  useWindowEvent('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditable(false);
    }
  });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setEditable(false);

      if (status === 'move') {
        const deltaX = e.clientX - lastPos.current.x + element.x;
        const deltaY = e.clientY - lastPos.current.y + element.y;
        setElement((el) => ({ ...el, x: deltaX, y: deltaY }));
      } else if (status === 'resize-br') {
        const newWidth = e.clientX - lastPos.current.x + element.width;
        const newFontSize = (newWidth / element.width) * (element.props.fontSize as number);

        setElement((el) => ({
          ...el,
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
    setEditable(false);
    // setElement((prev) => ({
    //   ...prev,
    //   content: (e.target as HTMLDivElement).innerText,
    // }));
  };

  const cursor =
    isSelected && status === 'move'
      ? 'move'
      : isSelected && status === 'resize-br'
        ? 'se-resize'
        : isSelected && editable
          ? 'text'
          : 'pointer';

  return (
    <Center
      ref={ref}
      // onClick={handleClick}
      contentEditable={editable}
      suppressContentEditableWarning={true}
      onMouseDown={handleMouseDown}
      onInput={(e) => {
        setElement((prev) => ({ ...prev, content: (e.target as HTMLDivElement).innerText }));
      }}
      onBlur={handleBlur}
      style={{
        left: element.x,
        top: element.y,
        userSelect: 'none',
        position: 'absolute',
        border: isSelected ? `2px solid ${theme.colors.blue[7]}` : '',
        borderRadius: 3,
        whiteSpace: 'pre-wrap',
        ...element.props
      }}>
      {element.content}
      {isSelected && (
        <Box
          onMouseDown={(e) => handleResizeMouseDown(e, 'resize-br')}
          onMouseUp={(e) => e.stopPropagation()}
          component="span"
          onClick={(e) => {
            e.stopPropagation();
          }}
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            height: 15,
            width: 15,
            borderRadius: '50%',
            transform: 'translate(50%,50%)',
            backgroundColor: theme.colors.gray[2],
            boxShadow: '0 0 1px rgba(0,0,0,0.4)',
            border: '1px solid rgba(0,0,0,0.3)',
            cursor: 'grab'
          }}
        />
      )}
    </Center>
  );
}
