import React, { useEffect } from "react";
import {
  Box,
  Group,
  Button,
  CopyButton,
  ActionIcon,
  Menu,
  Slider,
} from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  CanvasElement,
  elementsAtom,
  selectedElementsAtom,
} from "../canvas/store";
import { ImageToolbar } from "./image-toolbar";
import { Copy, Eye, Trash } from "tabler-icons-react";
import { TextToolbar } from "./text-toolbar";
import { SvgToolbar } from "./svg-toolbar";
import { SvgPathToolbar } from "./svg-path-toolbar";

const getTypeAtom = atom((get) => {
  const selectedElementIds = get(selectedElementsAtom);
  if (selectedElementIds.length === 0)
    return (_: CanvasElement["type"]) => false;
  const selectedElements = selectedElementIds.map((i) => get(elementsAtom)[i]);

  return (type: CanvasElement["type"]) =>
    selectedElements.every((el) => get(el).type === type);
});

const deleteSelectedAtom = atom(null, (get, set) => {
  const selectedElementsIds = get(selectedElementsAtom);
  set(elementsAtom, (items) =>
    items.filter((_, i) => !selectedElementsIds.includes(i))
  );
  set(selectedElementsAtom, []);
});

const selectedElementOpacityAtom = atom(
  (get) => {
    const selectedElementsIds = get(selectedElementsAtom);
    if (selectedElementsIds.length === 1) {
      const element = get(get(elementsAtom)[selectedElementsIds[0]]);
      return element.opacity;
    }
    return 0;
  },
  (get, set, update: number) => {
    const selectedElementsIds = get(selectedElementsAtom);
    if (selectedElementsIds.length === 1) {
      const elementAtom = get(elementsAtom)[selectedElementsIds[0]];
      set(elementAtom, (el) => ({ ...el, opacity: update }));
    }
  }
);

export function Toolbar() {
  const getType = useAtomValue(getTypeAtom);
  const deletedSelectedElements = useSetAtom(deleteSelectedAtom);
  const selectedElementsIds = useAtomValue(selectedElementsAtom);
  const [selectedElementOpacity, setSelectedElementOpacity] = useAtom(
    selectedElementOpacityAtom
  );

  const handleDeleteClick = () => {
    deletedSelectedElements();
  };

  const handleDeletePress = (e: KeyboardEvent) => {
    if (e.key === "Backspace") deletedSelectedElements();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDeletePress);

    return () => {
      window.removeEventListener("keydown", handleDeletePress);
    };
  }, []);

  return (
    <Box
      p="xs"
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {getType("text") && <TextToolbar />}
      {getType("image") && <ImageToolbar />}
      {getType("svg") && <SvgToolbar />}
      {getType("svg-path") && <SvgPathToolbar />}
      <div style={{ flex: 1 }} />
      <Group spacing="xs">
        <Menu width={170} position="bottom-end" closeOnItemClick={false}>
          <Menu.Target>
            <ActionIcon
              size={36}
              variant="default"
              disabled={selectedElementsIds.length !== 1}
            >
              <Eye />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Opacity</Menu.Label>
            <Menu.Item>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={selectedElementOpacity}
                onChange={(val) => setSelectedElementOpacity(val)}
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <ActionIcon
          size={36}
          variant="light"
          onClick={handleDeleteClick}
          disabled={selectedElementsIds.length === 0}
          color="red"
        >
          <Trash />
        </ActionIcon>
      </Group>
    </Box>
  );
}
