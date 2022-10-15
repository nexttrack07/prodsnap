import React from "react";
import { Box, Group, ActionIcon, Menu, Slider, Button } from "@mantine/core";
import {
  DefaultValue,
  selector,
  useRecoilCallback,
  useRecoilValue,
  useRecoilState,
} from "recoil";
import {
  activeElementState,
  Element,
  elementGroupsState,
  elementsState,
  selectedElementsAtom,
} from "../canvas/element.store";
import { Eye, Trash } from "tabler-icons-react";
import { TextToolbar } from "./text-toolbar";
import { elementState, selectedElementIdsState } from "../canvas/element.store";
import difference from "lodash/difference";
import sortBy from "lodash/sortBy";
import { SvgToolbar } from "./svg-toolbar";

const selectedOpacityAtom = selector({
  key: "selected-opacity-atom",
  get: ({ get }) => {
    const selectedElements = get(selectedElementsAtom);
    if (selectedElements.length === 1) return selectedElements[0].opacity;
    return 0;
  },
  set: ({ get, set }, newVal) => {
    if (newVal instanceof DefaultValue) return;

    const selectedElementIds = get(selectedElementIdsState);
    selectedElementIds.forEach((id) => {
      set(elementState(id), (el) => ({
        ...el,
        opacity: newVal,
      }));
    });
  },
});

const isGroupAtom = selector({
  key: "is-group",
  get: ({ get }) => {
    const selectedIds = get(selectedElementIdsState);
    const groups = get(elementGroupsState);

    let isGroup = false;
    groups.forEach((group) => {
      const diff = difference(group, selectedIds);
      if (diff.length === 0) {
        isGroup = true;
      }
    });
    return isGroup;
  },
});

export const activeElementTypeAtom = selector({
  key: "active-element-atom",
  get: ({ get }) => {
    const activeElementId = get(activeElementState);
    if (activeElementId === -1) return null;

    return get(elementState(activeElementId))["type"];
  },
});

export function Toolbar() {
  const selectedElementsIds = useRecoilValue(selectedElementIdsState);
  const activeElement = useRecoilValue(activeElementTypeAtom);
  const [selectedElementOpacity, setSelectedElementOpacity] =
    useRecoilState(selectedOpacityAtom);
  const isGroup = useRecoilValue(isGroupAtom);

  const getType = (type: Element["type"]) =>
    activeElement && activeElement === type;
  const handleDeleteClick = useRecoilCallback(
    ({ set }) =>
      () => {
        set(elementsState, (ids) =>
          ids.filter((id) => !selectedElementsIds.includes(id))
        );
        set(elementGroupsState, (groups) =>
          groups.filter(
            (group) => difference(group, selectedElementsIds).length !== 0
          )
        );
      },
    [selectedElementsIds]
  );

  const handleUngroup = useRecoilCallback(({ set }) => () => {
    set(elementGroupsState, (groups) => {
      return difference(groups, [selectedElementsIds]);
    });
  });

  const handleGroup = useRecoilCallback(({ set }) => () => {
    set(elementGroupsState, (groups) => {
      let newGroups: number[][] = [];
      selectedElementsIds.forEach((i) => {
        newGroups = groups.filter((group) => group.includes(i));
      });
      return newGroups.concat([sortBy(selectedElementsIds)]);
    });
  });

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
      {getType("shape") && <SvgToolbar />}
      <div style={{ flex: 1 }} />
      <Group spacing="xs">
        {isGroup ? (
          <Button onClick={handleUngroup} variant="outline">
            Ungroup
          </Button>
        ) : (
          <Button onClick={handleGroup} variant="outline">
            Group
          </Button>
        )}
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
