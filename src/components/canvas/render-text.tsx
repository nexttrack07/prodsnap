import React, {
  useState,
  SetStateAction,
  useRef,
  useEffect,
} from "react";
import { MoveableElement, TextType } from "./store";
import { Center } from "@mantine/core";
import { useClickOutside, useWindowEvent } from "@mantine/hooks";

export function RenderText({
  element,
}: {
  element: MoveableElement & TextType;
  setElement: (update: SetStateAction<MoveableElement & TextType>) => void;
  isSelected: boolean;
}) {
  const [editable, setEditable] = useState(false);
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
    if (ref.current) {
      setFontRatio(
        (element.props.fontSize as number) / ref.current.offsetWidth
      );
      setInitialWidth(ref.current.offsetWidth);
    }
  }, [ref.current]);

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
