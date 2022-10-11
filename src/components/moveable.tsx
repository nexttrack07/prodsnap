import React, { createContext, useContext, useEffect, useState } from "react";

type MoveContextType = {
  moving: boolean;
  delta: { x: number; y: number };
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
  const [delta, setDelta] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      setMoving(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      setMoving(true);
      setDelta({ x: e.movementX, y: e.movementY });
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [])

  return (
    <MoveContext.Provider value={{ moving, delta }}>
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
  const { moving, delta } = useMoveContext();

  useEffect(() => {
    if (!moving) setPressed(false);
  }, [moving])

  useEffect(() => {
    if (moving && pressed) {
      onMove(delta);
    }
  }, [moving, pressed, delta, onMove])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPressed(true);
    onMouseDown && onMouseDown();
  }

  return (
    <span onMouseDown={handleMouseDown}>
      {children}
    </span>
  )
}
