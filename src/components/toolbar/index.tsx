import { useEffect } from "react";
import {
  Box,
  Group,
  ActionIcon,
  Menu,
  Button,
} from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { elementAtomsAtom, selectedElementAtomsAtom, activeElementAtomAtom, selectedItemsAtom, groupsByIdAtom } from "../canvas/store";
import { Eye, Trash } from "tabler-icons-react";

const getTypeAtom = atom((get) => {
  const activeElementAtom = get(activeElementAtomAtom);
  if (!activeElementAtom) return null;
  const activeElement = get(activeElementAtom);
  return activeElement.type;

});

const deleteSelectedAtom = atom(null, (get, set) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  set(elementAtomsAtom, elementAtoms => elementAtoms.filter(elementAtom => !selectedElementAtoms.includes(elementAtom)))
  set(selectedElementAtomsAtom, []);
});

const isGroupedAtom = atom(
  get => {
    const selectedElementAtoms = get(selectedElementAtomsAtom);
    const selectedElements = selectedElementAtoms.map(elementAtom => get(elementAtom));

    return selectedElements.every(el => el.group);
  }
)

const addGroupAtom = atom(null,
  (get, set) => {
    const selectedElementAtoms = get(selectedElementAtomsAtom);
    const newId = selectedElementAtoms.reduce((acc, item) => acc + item.toString(), "");
    set(groupsByIdAtom, obj => ({
      ...obj,
      [newId]: [...selectedElementAtoms]
    }))
    selectedElementAtoms.forEach(elAtom => {
      set(elAtom, el => ({
        ...el,
        group: newId
      }))
    })
  }
)
const removeGroupAtom = atom(null,
  (get, set) => {
    const selectedElementAtoms = get(selectedElementAtomsAtom);
    const selectedElements = selectedElementAtoms.map(a => get(a));
    const id = selectedElements[0].group;
    set(groupsByIdAtom, obj => {
      if (id) {
        delete obj[id]
      }
      return obj;
    })
    selectedElementAtoms.forEach(elAtom => {
      set(elAtom, el => ({
        ...el,
        group: undefined
      }))
    })
  }
)

export function Toolbar() {
  /* const type = useAtomValue(getTypeAtom); */
  const deletedSelectedElements = useSetAtom(deleteSelectedAtom);
  const selectedElements = useAtomValue(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);
  const removeGroup = useSetAtom(removeGroupAtom);
  const isGrouped = useAtomValue(isGroupedAtom);

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

  const handleUngroupElements = () => {
    removeGroup();
  }
  const handleGroupElements = () => {
    addGroup();
  }

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
      {/* {getType("text") && <TextToolbar />} */}
      {/* {getType("image") && <ImageToolbar />} */}
      {/* {getType("svg-path") && <SvgPathToolbar />} */}
      <div style={{ flex: 1 }} />
      <Group spacing="xs">
        {isGrouped ? (
          <Button onClick={handleUngroupElements}>UnGroup</Button>
        ): (
          <Button onClick={handleGroupElements}>Group</Button>
        )}
        <Menu width={170} position="bottom-end" closeOnItemClick={false}>
          <Menu.Target>
            <ActionIcon
              size={36}
              variant="default"
              disabled={selectedElements.length !== 1}
            >
              <Eye />
            </ActionIcon>
          </Menu.Target>
        </Menu>
        <ActionIcon
          size={36}
          variant="light"
          onClick={handleDeleteClick}
          disabled={selectedElements.length === 0}
          color="red"
        >
          <Trash />
        </ActionIcon>
      </Group>
    </Box>
  );
}
