import React, { SetStateAction, useEffect, useRef } from 'react';
import { TextType } from './store';
import { Box } from '@mantine/core';

export function RenderText({
  element,
  setElement
}: {
  element: TextType;
  setElement: (update: SetStateAction<TextType>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setElement((el) => ({
        ...el,
        width: textRef.current!.offsetWidth,
        height: textRef.current!.offsetHeight
      }));
    }
  }, [textRef.current?.offsetWidth, textRef.current?.offsetHeight]);

  const cursor = 'pointer';

  return (
    <Box
      ref={ref}
      style={{
        left: element.x,
        top: element.y,
        userSelect: 'none',
        visibility: element.mode === 'editing' ? 'hidden' : 'visible',
        position: 'absolute',
        whiteSpace: 'pre-wrap',
        transform: `rotate(${element.rotation ?? 0}deg)`,
        transformOrigin: 'center center',
        outline: 'none',
        cursor,
        ...element.props
      }}
    >
      <div tabIndex={0} ref={textRef}>
        {element.content}
      </div>
    </Box>
  );
}
