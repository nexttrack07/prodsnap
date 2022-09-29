import React, { useState, useCallback, SetStateAction } from "react";
import { CanvasElement, MoveableElement, TextType } from "./store";
import { Center, Text, useMantineTheme } from "@mantine/core";
import { useClickOutside, useWindowEvent } from "@mantine/hooks";
import { Moveable, MoveableItem } from "../moveable"

export function RenderText({
  element,
  setElement,
  isSelected
}: {
  element: MoveableElement & TextType,
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
}) {
  const [editable, setEditable] = useState(false);
  const ref = useClickOutside(() => setEditable(false));
  const theme = useMantineTheme();

  useWindowEvent("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditable(false)
    }
  });

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditable(true);
  };

  const handleMoveElement = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        x: d.x + el.x,
        y: d.y + el.y,
      }));
    },
    [setElement]
  );

  const handleResizeElement = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        width: d.x + el.width,
        height: d.y + el.height,
      }));
    },
    [setElement]
  );


  const { height, width } = element;

  return (
    <>
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
          onDoubleClick={handleTextClick}
          contentEditable={editable}
          sx={{ cursor: "text" }}
        >
          {element.content}
        </Text>
      </Center>
      {isSelected && (
        <Moveable>
          <MoveableItem onMove={handleMoveElement}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: theme.colors.blue[6],
              }}
              className="border border-dashed border-blue-500"
              onClick={(e) => e.stopPropagation()}
            ></div>
          </MoveableItem>
          <MoveableItem onMove={handleResizeElement}>
            <span
              style={{
                height: 10,
                width: 10,
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
          </MoveableItem>
        </Moveable>
      )}
    </>
  );
}
