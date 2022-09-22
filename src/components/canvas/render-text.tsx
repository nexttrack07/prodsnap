import React, { useState } from "react";
import { MoveableElement, TextType } from "./store";
import { Center, Text } from "@mantine/core";
import { useClickOutside, useWindowEvent } from "@mantine/hooks";

export function RenderText({
  element,
}: {
  element: MoveableElement & TextType;
}) {
  const [editable, setEditable] = useState(false);
  const ref = useClickOutside(() => setEditable(false));

  useWindowEvent("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditable(false)
    }
  });

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditable(true);
  };

  const { height, width } = element;

  return (
    <Center
      sx={(theme) => ({
        width,
        height,
        borderWidth: 0,
        borderStyle: "dotted",
        borderColor: theme.colors.blue[4],
        '&:hover': {
          borderWidth: 2,
          cursor: "pointer"
        }
      })}
    >
      <Text
        ref={ref}
        style={{ ...element.props }}
        onClick={handleTextClick}
        contentEditable={editable}
        sx={{ cursor: "text" }}
      >
        {element.content}
      </Text>
    </Center>
  );
}
