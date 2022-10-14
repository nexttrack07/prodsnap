import React, { createContext, useContext, useEffect, MutableRefObject, useRef, useState } from "react";

type MoveContextType = {
  moving: boolean;
  delta: MutableRefObject<{ x: number; y: number }>;
  initPosition: MutableRefObject<{ x: number; y: number }>;
}

const MoveContext = createContext<MoveContextType | null>(null);

const useMoveContext = () => {
  const context = useContext(MoveContext);

  if (!context) throw new Error('MoveableItem should be used within Moveable!');

  return context;
}

type MoveableProps = {
  children: JSX.Element | JSX.Element[];
}

export function Moveable({ children }: MoveableProps) {
  const [moving, setMoving] = useState(false);
  const delta = useRef({ x: 0, y: 0 });
  const initPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      initPosition.current = { x: 0, y: 0 };
      setMoving(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      setMoving(true);
      delta.current = { x: e.clientX - initPosition.current.x, y: e.clientY - initPosition.current.y };
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [])

  return (
    <MoveContext.Provider value={{ moving, delta, initPosition }}>
      {children}
    </MoveContext.Provider>
  )
}

type MoveableItemProps = {
  children: JSX.Element;
  onMove: (d: { x: number; y: number }) => void;
  onMouseDown?: VoidFunction;
}

export function MoveableItem({ children, onMove, onMouseDown }: MoveableItemProps) {
  const [pressed, setPressed] = useState(false);
  const { moving, delta, initPosition } = useMoveContext();

  useEffect(() => {
    if (!moving) setPressed(false);
  }, [moving])

  useEffect(() => {
    if (moving && pressed) {
      onMove(delta.current);
    }
  }, [moving, pressed, onMove])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPressed(true);
    initPosition.current = { x: e.clientX, y: e.clientY };
    onMouseDown && onMouseDown();
  }

  return (
    <span onMouseDown={handleMouseDown}>
      {children}
    </span>
  )
}
