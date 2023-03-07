import React, { useState, SetStateAction, useRef, useEffect } from "react";
import {
  activeElementState,
  isElementSelectedState,
  selectedElementIdsState,
  TextType,
} from "./element.store";
import { Center, Text, useMantineTheme } from "@mantine/core";
import { useWindowEvent } from "@mantine/hooks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useKeyPress } from "../../utils/use-key-press";

export function RenderText({
  element,
  setElement,
  id,
}: {
  element: TextType;
  setElement: (update: SetStateAction<TextType>) => void;
  id: number;
  isSelected: boolean;
}) {
  const [editable, setEditable] = useState(false);
  const theme = useMantineTheme();
  const [moving, setMoving] = useState(false);
  const setSelectedElements = useSetRecoilState(selectedElementIdsState);
  const setActiveElement = useSetRecoilState(activeElementState);
  const isSelected = useRecoilValue(isElementSelectedState(id));
  const isShiftPressed = useKeyPress("Shift");
  const ref = useRef<HTMLDivElement>(null);

  console.log('element', element);

  useWindowEvent("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditable(false);
    }
  });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (moving) {
        setElement((prev) => ({
          ...prev,
          x: prev.x + e.movementX,
          y: prev.y + e.movementY,
        }));
      }
    }

    function handleMouseUp() {
      setMoving(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [moving]);

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("mousedown");
    e.stopPropagation();
    setMoving(true);
  };

  const handleTextClick = (e: React.MouseEvent) => {
    if (isSelected) {
      setEditable(true);
    }
  };

  const handleElementSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElements((items) => {
      if (isShiftPressed) {
        return items.includes(id) ? items : items.concat(id);
      } else {
        return [id];
      }
    });
    setActiveElement(id);
  };

  const handleBlur = (e: React.FocusEvent) => {
    setEditable(false);
    setElement((prev) => ({
      ...prev,
      content: (e.target as HTMLDivElement).innerText,
    }));
  };

  return (
    <Center
      onMouseDown={handleMouseDown}
      onClick={handleElementSelect}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        border: isSelected ? `2px dotted ${theme.colors.blue[8]}` : "none",
        borderRadius: 3,
        cursor: isSelected ? "move" : "pointer",
        userSelect: moving ? "none" : "auto",
      }}
    >
      <Text
        ref={ref}
        onDoubleClick={handleTextClick}
        style={element.props}
        contentEditable={editable}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
      >
        {element.content}
      </Text>
    </Center>
  );
}
