import { RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { MoveableElement, TextType } from "./store";
import { Box, Center, useMantineTheme } from "@mantine/core";
import { useEventListener } from "../../utils";

type Status =
  | "idle"
  | "rotating"
  | "moving"
  | "resizing-br"
  | "resizing-tl"
  | "resizing-bl"
  | "resizing-tr";

export function RenderText({
  element,
  isSelected,
  onSelect,
  setElement
}: {
  element: MoveableElement & TextType;
  setElement: (update: SetStateAction<MoveableElement & TextType>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [editable, setEditable] = useState(false);
  const theme = useMantineTheme();
  const documentRef = useRef<Document>(document);
  const [status, setStatus] = useState<Status>("idle");
  const lastPos = useRef({ x: 0, y: 0 })
  const delta = useRef({ x: 0, y: 0 })

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setStatus("idle");
    setElement(el => ({ ...el, props: { fontSize: (el.props.fontSize as number) * ((el.width + delta.current.x) / el.width) } }))
    delta.current = { x: 0, y: 0 };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    lastPos.current = { x: e.clientX, y: e.clientY };
    setStatus("moving");
  }, []);

  const handleRotateMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus("rotating");
  }, []);

  const handleResizeMouseDown = (e: React.MouseEvent, stat: Status) => {
    e.stopPropagation();
    setStatus(stat);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  function getDegrees(mouseX: number, mouseY: number, ref: RefObject<HTMLDivElement>) {
    if (!ref.current) return 0;

    const rect = ref.current.getBoundingClientRect();
    const rectX = rect.left + rect.width / 2;
    const rectY = rect.top + rect.height / 2;
    const angle = Math.atan2(mouseY - rectY, mouseX - rectX) + Math.PI / 2;
    return Math.round((angle * 180) / Math.PI);
  }
  const handleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    if (status === "moving") {
      const deltaX = e.clientX - lastPos.current.x + element.x;
      const deltaY = e.clientY - lastPos.current.y + element.y;
      setElement(el => ({ ...el, x: deltaX, y: deltaY }));
    } else if (status === "rotating") {
      const r = getDegrees(e.clientX, e.clientY, ref);
      setElement(el => ({ ...el, rotaion: r }));
    } else if (status === "resizing-br") {
      const width = e.clientX - lastPos.current.x + element.x;
      delta.current = { x: width, y: width };
      const scaleX = 1 + width / element.width;
      setElement(el => ({ ...el, props: { ...el.props, transformOrigin: 'top left', transform: `scale(${scaleX},${scaleX})` } }));
    } else if (status === "resizing-tl") {
      const width = -e.movementX
      const height = -e.movementY
      const x = e.movementX
      const y = e.movementY

      setElement(el => ({ ...el, x, y, width, height }));
    } else if (status === "resizing-bl") {
      const width = -e.movementX
      const height = e.movementY
      const y = 0
      const x = e.movementX

      setElement(el => ({ ...el, x, y, width, height }));
    } else if (status === "resizing-tr") {
      const width = e.movementX
      const height = -e.movementY
      const x = 0
      const y = e.movementY

      setElement(el => ({ ...el, x, y, width, height }));
    }
  };


  useEventListener("pointerup", handleMouseUp, documentRef);
  useEventListener("pointermove", handleMouseMove, documentRef, [status]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e);
    if (isSelected) {
      setEditable(true);
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setElement(el => ({ ...el, content: e.currentTarget.innerText }))
  }

  useEffect(() => {
    if (!isSelected) {
      setEditable(false);
    }
  }, [isSelected])


  useEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setElement(el => ({ ...el, width, height }));
    }
  }, [])

  return (
    <Center
      ref={ref}
      onClick={handleClick}
      contentEditable={editable}
      suppressContentEditableWarning={true}
      onMouseDown={handleMouseDown}
      onBlur={handleBlur}
      style={{
        left: element.x,
        top: element.y,
        userSelect: "none",
        position: "absolute",
        border: isSelected ? `4px solid ${theme.colors.indigo[9]}` : '',
        borderRadius: 3,
        ...element.props
      }}>
      {element.content}
      {isSelected &&
        <Box
          onMouseDown={e => handleResizeMouseDown(e, "resizing-br")}
          onMouseUp={e => e.stopPropagation()}
          component='span'
          onClick={e => { e.stopPropagation() }}
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            height: 15,
            width: 15,
            borderRadius: '50%',
            transform: 'translate(50%,50%)',
            backgroundColor: theme.colors.gray[2],
            boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
            border: "1px solid rgba(0,0,0,0.3)",
            cursor: 'grab'
          }} />
      }
    </Center>
  );
}
