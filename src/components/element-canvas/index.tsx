import {
  activeElementAtomAtom,
  elementGroupAtomsAtom,
  selectedElementGroupAtomsAtom
} from '@/stores/elements';
import { Box } from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';
import { ElementGroup } from './element';
import React from 'react';

export function Canvas() {
  const elementGroupAtoms = useAtomValue(elementGroupAtomsAtom);
  const setSelectedElementGroupAtoms = useSetAtom(selectedElementGroupAtomsAtom);
  const setActiveElementAtom = useSetAtom(activeElementAtomAtom);
  const mousePosition = React.useRef({ x: 0, y: 0 });

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    // if the e.clientX and e.clientY are the same as the mousePosition.current
    // then the user clicked on the canvas
    // else the user dragged the mouse
    if (mousePosition.current.x === e.clientX && mousePosition.current.y === e.clientY) {
      setSelectedElementGroupAtoms([]);
      setActiveElementAtom(null);
    }
  };

  return (
    <Box
      id="canvas"
      onMouseDown={handleCanvasMouseDown}
      onMouseUp={handleCanvasMouseUp}
      sx={(theme) => ({
        width: 900,
        height: 700,
        border: `1px solid ${theme.colors.gray[4]}`,
        boxShadow: '0px 0px 0.8px rgba(0,0,0,0.3)',
        position: 'relative',
        backgroundColor: 'white',
        overflow: 'hidden'
      })}
    >
      {elementGroupAtoms.map((elementGroupAtom) => (
        <ElementGroup key={elementGroupAtom.toString()} group={elementGroupAtom} />
      ))}
    </Box>
  );
}
