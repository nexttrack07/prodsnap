import { Element, Text } from '@/stores/elements';
import { Center } from '@mantine/core';
import { SetStateAction } from 'jotai';
import { useEffect, useRef, useState } from 'react';

type Props = {
  element: Element & Text;
  setElement: (update: SetStateAction<Element & Text>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

export function TextRenderer({ element, setElement, isSelected, onSelect }: Props) {
  const [editable, setEditable] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // const textRef = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });

  // useEffect(() => {
  //   if (textRef.current) {
  //     console.log('textRef.current', textRef.current);
  //     setElement((el) => ({
  //       ...el,
  //       width: textRef.current!.offsetWidth,
  //       height: textRef.current!.offsetHeight
  //     }));
  //   }
  // }, [textRef.current]);

  useEffect(() => {
    // Reset editable state when isSelected changes.
    // Prevents an item staying editable when another is selected.
    if (!isSelected) setEditable(false);
  }, [isSelected]);

  useEffect(() => {
    if (textRef2.current) {
      setElement((el) => ({
        ...el,
        // width: textRef2.current!.offsetWidth + 10,
        // height: textRef2.current!.offsetHeight
        // set the width to the width of the text + 10px padding but minimum 20px
        width: Math.max(textRef2.current!.offsetWidth + 5, 20),
        // set the height to the height of the textpx padding but minimum 20px
        height: Math.max(textRef2.current!.offsetHeight + 5, 40)
      }));
    }
  }, [element.content]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // setEditable(true) if isSelected and current element x,y is same as positionRef
    if (isSelected && positionRef.current.x === element.x && positionRef.current.y === element.y) {
      setEditable(true);
    } else {
      onSelect(e);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // set the position ref to current x, y of element
    positionRef.current = { x: element.x, y: element.y };
    if (editable) {
      e.stopPropagation();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (editable) {
      e.stopPropagation();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setElement((prev) => ({
      ...prev,
      content: e.target.value
    }));
  };

  return (
    <div
      ref={ref}
      style={{
        userSelect: 'none',
        whiteSpace: 'pre',
        outline: 'none',
        ...element.textProps
      }}
    >
      {editable ? (
        <input
          style={{
            // remove all input styles
            border: 'none',
            outline: 'none',
            padding: 0,
            margin: 0,
            background: 'transparent',
            cursor: 'text',
            // inherit font styles
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            fontStyle: 'inherit',
            color: 'inherit',
            // inherit text alignment
            textAlign: 'inherit',
            // inherit text transform
            textTransform: 'inherit',
            // inherit text decoration
            textDecoration: 'inherit',
            // inherit text spacing
            letterSpacing: 'inherit',
            wordSpacing: 'inherit',
            lineHeight: 'inherit',
            // set to 100% width and height
            width: element.width,
            height: element.height
            // if
          }}
          onMouseDown={(e) => e.stopPropagation()}
          value={element.content}
          onChange={handleChange}
        />
      ) : (
        <div
          tabIndex={0}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          // onBlur={handleBlur}
          // contentEditable={editable}
          // suppressContentEditableWarning={true}
          // ref={textRef}
          style={{
            cursor: 'grab',
            whiteSpace: 'pre'
          }}
        >
          {element.content}
        </div>
      )}
      <div
        ref={textRef2}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre'
        }}
      >
        {element.content}
      </div>
    </div>
  );
}
