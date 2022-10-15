import React, { useState, SetStateAction, useRef, useEffect } from "react";
import { TextType } from "./element.store";
import { Text } from "@mantine/core";
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
  const ref = useRef<HTMLDivElement>(null);

  useWindowEvent("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditable(false);
    }
  });

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditable(true);
  };

  const { width, height } = element;

  return (
    <Text
      onDoubleClick={handleTextClick}
      ref={ref}
      style={{ ...element.props, width, height }}
    >
      {element.content}
    </Text>
  );
}
