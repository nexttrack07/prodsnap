import React, { useEffect } from 'react';
import { Box, Group, Button, CopyButton } from "@mantine/core";
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { CanvasElement, elementsAtom, selectedElementsAtom } from '../canvas/store';
import { ImageToolbar } from './image-toolbar';
import { Copy, Trash } from 'tabler-icons-react';
import { TextToolbar } from './text-toolbar';
import { SvgToolbar } from './svg-toolbar';

const getTypeAtom = atom(
  get => {
    const selectedElementIds = get(selectedElementsAtom);
    if (selectedElementIds.length === 0) return (_: CanvasElement["type"]) => false
    const selectedElements = selectedElementIds.map(i => get(elementsAtom)[i]);

    return (type: CanvasElement["type"]) => selectedElements.every(el => get(el).type === type)
  }
)

const deleteSelectedAtom = atom(
  null,
  (get, set) => {
    const selectedElementsIds = get(selectedElementsAtom);
    set(elementsAtom, items => items.filter((_, i) => !selectedElementsIds.includes(i)));
    set(selectedElementsAtom, [])
  }
)

export function Toolbar() {
  const getType = useAtomValue(getTypeAtom);
  const deletedSelectedElements = useSetAtom(deleteSelectedAtom);
  const selectedElementsIds = useAtomValue(selectedElementsAtom);

  const handleDeleteClick = () => {
    deletedSelectedElements();
  }


  const handleDeletePress = (e: KeyboardEvent) => {
    if (e.key === "Backspace") deletedSelectedElements();
  }

  useEffect(() => {
    window.addEventListener('keydown', handleDeletePress);

    return () => {
      window.removeEventListener('keydown', handleDeletePress);
    }
  }, [])

  return (
    <Box p="xs" sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {getType("text") && <TextToolbar />}
      {getType("image") && <ImageToolbar />}
      {getType("svg") && <SvgToolbar />}
      <div style={{ flex: 1 }} />
      <Group>
        <Button variant="light" onClick={handleDeleteClick} disabled={selectedElementsIds.length === 0} color="red">
          <Trash />
        </Button>
      </Group>
    </Box>
  )
}
