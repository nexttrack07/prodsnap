import { SetStateAction, useRef } from "react";
import { MoveableElement, TextType } from "./store";
import { Center } from "@mantine/core";

export function RenderText({
  element,
}: {
  element: MoveableElement & TextType;
  setElement: (update: SetStateAction<MoveableElement & TextType>) => void;
  isSelected: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Center ref={ref} style={{ ...element.props, userSelect: "none" }}>
      {element.content}
    </Center>
  );
}
