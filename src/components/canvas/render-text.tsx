import React, { useState, SetStateAction, useRef, useEffect } from "react";
import { TextType } from "./element.store";
import { Center } from "@mantine/core";
import { useWindowEvent } from "@mantine/hooks";

export function RenderText({
  element,
  setElement,
}: {
  element: TextType;
  setElement: (update: SetStateAction<TextType>) => void;
  isSelected: boolean;
}) {
  const [editable, setEditable] = useState(false);
  // const ref = useClickOutside(() => setEditable(false));
  const ref = useRef<HTMLDivElement>(null);
  const [fontRatio, setFontRatio] = useState(1);
  const [initialWidth, setInitialWidth] = useState(0);

  useWindowEvent("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditable(false);
    }
  });

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditable(true);
  };

  useEffect(() => {
    if (ref && ref.current) {
      setFontRatio(
        (element.props.fontSize as number) / ref.current.offsetWidth
      );
      setInitialWidth(ref.current.offsetWidth);
      setElement((el) => ({
        ...el,
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      }));
    }
  }, [ref.current]);

  useEffect(() => {
    const fontSize = fontRatio * element.width;
    setElement((el) => ({
      ...el,
      props: {
        ...el.props,
        fontSize,
      },
    }));
  }, [element.width, fontRatio]);

  return (
    <Center
      onDoubleClick={handleTextClick}
      ref={ref}
      style={{ ...element.props }}
    >
      {element.content}
    </Center>
  );
}
