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
  setElement,
  isSelected,
}: {
  element: MoveableElement & TextType;
  setElement: (update: SetStateAction<MoveableElement & TextType>) => void;
  isSelected: boolean;
}) {
  const [editable, setEditable] = useState(false);
  // const ref = useClickOutside(() => setEditable(false));
  const ref = useRef<HTMLDivElement>(null);
  const [fontRatio, setFontRatio] = useState(1);
  const [initialWidth, setInitialWidth] = useState(0);
  const [moving, setMoving] = useState(false);
  const initial = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    function handleMouseUp(e: MouseEvent) {
      e.stopPropagation();
      initial.current = { x: 0, y: 0 };
      setMoving(false);
    }

    function handleMouseMove(e: MouseEvent) {
      e.stopPropagation();
      if (moving) {
        const fontSize = fontRatio * (initialWidth + e.clientX - initial.current.x);
        setElement((el) => ({
          ...el,
          props: {
            ...el.props,
            fontSize,
          },
        }));
      }
    }

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [fontRatio, initialWidth, setMoving, setElement, moving]);

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("mouse down event");
    e.stopPropagation();
    initial.current = { x: e.clientX, y: e.clientY };
    setInitialWidth(ref.current?.offsetWidth as number);
    setMoving(true);
  };

  return (
    <>
      <Center
        onDoubleClick={handleTextClick}
        ref={ref}
        style={{ ...element.props }}
      >
        {element.content}
      </Center>
      {isSelected && (
        <span
          onMouseDown={handleMouseDown}
          style={{
            height: 12,
            width: 12,
            cursor: "se-resize",
            borderRadius: "100%",
            transform: "translate(50%, 50%)",
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            boxShadow: "0 0 1px rgba(0,0,0,0.4)",
            border: "1px solid rgba(0,0,0,0.3)",
          }}
        />
      )}
    </>
  );
}
