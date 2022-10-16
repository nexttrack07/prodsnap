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
  elementByIdAtom,
  elementListAtom,
  selectedElementListAtom,
  selectedItemsAtom,
} from "../canvas/store";
import { ImageToolbar } from "./image-toolbar";
import { Eye, Trash } from "tabler-icons-react";
import { TextToolbar } from "./text-toolbar";
import { SvgPathToolbar } from "./svg-path-toolbar";

const getTypeAtom = atom((get) => {
  const selected = get(selectedItemsAtom);

  if (selected.elements.length === 1) {
    return selected.elements[0].type;
  }

  return null;
});

const deleteSelectedAtom = atom(null, (get, set) => {
  const selectedElementsIds = get(selectedElementListAtom);
  set(elementListAtom, (items) =>
    items.filter((_, i) => !selectedElementsIds.includes(i))
  );
  set(elementByIdAtom, obj => {
    selectedElementsIds.forEach(id => {
      delete obj[id];
    })

    return obj;
  })
  set(selectedElementListAtom, []);
});

const selectedElementOpacityAtom = atom(
  (get) => {
    const selectedElementsIds = get(selectedElementListAtom);
    if (selectedElementsIds.length === 1) {
      const element = get(get(elementByIdAtom)[selectedElementsIds[0]]);
      return element.opacity;
    }
    return 0;
  },
  (get, set, update: number) => {
    const selectedElementsIds = get(selectedElementListAtom);
    if (selectedElementsIds.length === 1) {
      const elementAtom = get(elementByIdAtom)[selectedElementsIds[0]];
      set(elementAtom, (el) => ({ ...el, opacity: update }));
    }
  }
);

export function Toolbar() {
  const type = useAtomValue(getTypeAtom);
  const deletedSelectedElements = useSetAtom(deleteSelectedAtom);
  const selectedElementsIds = useAtomValue(selectedElementListAtom);
  const [selectedElementOpacity, setSelectedElementOpacity] = useAtom(
    selectedElementOpacityAtom
  );

  const handleDeleteClick = () => {
    deletedSelectedElements();
  };

  const handleDeletePress = (e: KeyboardEvent) => {
    if (e.key === "Backspace") deletedSelectedElements();
  };

  const getType = (t: string) => type && type === t;

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
