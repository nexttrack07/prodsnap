import React, { useState, SetStateAction, useRef, useEffect, useCallback } from "react";
import {
  activeElementState,
  isElementSelectedState,
  selectedElementIdsState,
  TextType,
} from "./element.store";
import { Center, useMantineTheme } from "@mantine/core";
import { useWindowEvent } from "@mantine/hooks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useKeyPress } from "../../utils/use-key-press";

type Status =
  | "resize-br"
  | "resize-bl"
  | "resize-tr"
  | "resize-tl"
  | "move"
  | "none";

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
  const [status, setStatus] = useState<Status>("none");
  const setSelectedElements = useSetRecoilState(selectedElementIdsState);
  const setActiveElement = useSetRecoilState(activeElementState);
  const isSelected = useRecoilValue(isElementSelectedState(id));
  const isShiftPressed = useKeyPress("Shift");
  const lastPos = useRef({ x: 0, y: 0 });

  useWindowEvent("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditable(false);
    }
  });


  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setEditable(false);

      if (status === "move") {
        const deltaX = e.clientX - lastPos.current.x + element.x;
        const deltaY = e.clientY - lastPos.current.y + element.y;
        setElement((el) => ({ ...el, x: deltaX, y: deltaY }));
      } else if (status === "resize-br") {
        const newWidth = e.clientX - lastPos.current.x + element.width;
        const newFontSize = newWidth / element.width * (element.props.fontSize as number);

        setElement((el) => ({
          ...el,
          props: { ...el.props, fontSize: newFontSize }
        }));
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      setStatus('none');
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [status]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    lastPos.current = { x: e.clientX, y: e.clientY };
    setStatus('move');
  }, []);

  const handleResizeMouseDown = (e: React.MouseEvent, stat: Status) => {
    e.stopPropagation();
    setStatus(stat);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElements((items) => {
      if (isShiftPressed) {
        return items.includes(id) ? items : items.concat(id);
      } else {
        return [id];
      }
    });
    setActiveElement(id);
    if (isSelected) {
      setEditable(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    setEditable(false);
    setElement((prev) => ({
      ...prev,
      content: (e.target as HTMLDivElement).innerText,
    }));
  };

  const cursor = isSelected && status === "move" ? "move"
    : isSelected && status === "resize-br" ? "se-resize"
      : isSelected && editable ? "text" : "pointer";

  return (
    <Center
      onMouseDown={handleMouseDown}
      contentEditable={editable}
      suppressContentEditableWarning={true}
      onClick={handleClick}
      onBlur={handleBlur}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        border: isSelected ? `2px dashed ${theme.colors.blue[8]}` : "none",
        borderRadius: 3,
        cursor,
        userSelect: status === "move" || "resize-br" ? "none" : "auto",
        ...element.props
      }}
    >
      {element.content}
      {isSelected && (
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, "resize-br")}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            borderRadius: "50%",
            width: 10,
            height: 10,
            backgroundColor: theme.colors.blue[8],
            boxShadow: `0 0 0 2px ${theme.colors.blue[0]}`,
            transform: "translate(50%, 50%)",
            cursor: "se-resize",
          }}
        ></span>
      )}
    </Center>
  );
}
