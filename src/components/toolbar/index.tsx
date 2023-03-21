import React from 'react';
import { Box, Group, ActionIcon, Menu, SegmentedControl } from '@mantine/core';
import { FaRegObjectUngroup } from 'react-icons/fa';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  elementAtomsAtom,
  selectedElementAtomsAtom,
  groupsByIdAtom,
  canvasAtom,
  isPath,
  activeElementAtomAtom,
  CanvasElement,
  isCurve,
  isText,
  isImage
} from '../canvas/store';
import { SvgPathToolbar } from './svg-path-toolbar';
import { ImageToolbar } from './image-toolbar';
import { TextToolbar } from './text-toolbar';
import { CanvasToolbar } from './canvas-toolbar';
import {
  Copy,
  Eye,
  LayoutAlignBottom,
  LayoutAlignCenter,
  LayoutAlignLeft,
  LayoutAlignMiddle,
  LayoutAlignRight,
  LayoutAlignTop,
  LayoutDashboard,
  Trash
} from 'tabler-icons-react';
import { SvgCurveToolbar } from './svg-curve-toolbar';

const getTypeAtom = atom((get) => {
  const { isSelected } = get(canvasAtom);
  if (isSelected) return 'canvas';
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  const typesArr = selectedElementAtoms.map((a) => get(a).type);
  const typesSet = new Set(typesArr);
  if (typesSet.size === 1) {
    return typesArr[0];
  }

  return 'mixed';
});

const deleteSelectedAtom = atom(null, (get, set) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);

  if (selectedElementAtoms.length === 0) {
    set(elementAtomsAtom, []);
  } else {
    set(elementAtomsAtom, (elementAtoms) =>
      elementAtoms.filter((elementAtom) => !selectedElementAtoms.includes(elementAtom))
    );
    set(selectedElementAtomsAtom, []);
  }
});

const isGroupedAtom = atom((get) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  const selectedElements = selectedElementAtoms.map((elementAtom) => get(elementAtom));

  return selectedElements.every((el) => el.group);
});

export const addGroupAtom = atom(null, (get, set) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  const newId = selectedElementAtoms.reduce((acc, item) => acc + item.toString(), '');
  set(groupsByIdAtom, (obj) => ({
    ...obj,
    [newId]: [...selectedElementAtoms]
  }));
  selectedElementAtoms.forEach((elAtom) => {
    set(elAtom, (el) => ({
      ...el,
      group: newId
    }));
  });
});

const removeGroupAtom = atom(null, (get, set) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  const selectedElements = selectedElementAtoms.map((a) => get(a));
  const id = selectedElements[0].group;
  set(groupsByIdAtom, (obj) => {
    if (id) {
      delete obj[id];
    }
    return obj;
  });
  selectedElementAtoms.forEach((elAtom) => {
    set(elAtom, (el) => ({
      ...el,
      group: undefined
    }));
  });
});

const copySelectedAtom = atom(null, (get, set) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  const selectedElements = selectedElementAtoms.map((a) => get(a));

  set(elementAtomsAtom, (elementAtoms) => [
    ...elementAtoms,
    ...selectedElements.map((el) =>
      atom({ ...el, x: el.x + getRandomNumber(15, 20), y: el.y + getRandomNumber(40, 45) })
    )
  ]);
  set(selectedElementAtomsAtom, []);
});

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const activeElementAtom = atom(
  (get) => {
    const activeElementAtom = get(activeElementAtomAtom);
    if (activeElementAtom) {
      return get(activeElementAtom);
    }
    return null;
  },
  (get, set, element: CanvasElement) => {
    const activeElementAtom = get(activeElementAtomAtom);
    if (activeElementAtom) {
      set(activeElementAtom, element);
    }
  }
);

const alignElementsAtom = atom(
  null,
  (get, set, align: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const selectedElementAtoms = get(selectedElementAtomsAtom);
    const selectedElements = selectedElementAtoms.map((a) => get(a));
  }
);

export function Toolbar() {
  const type = useAtomValue(getTypeAtom);
  const deletedSelectedElements = useSetAtom(deleteSelectedAtom);
  const selectedElements = useAtomValue(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);
  const removeGroup = useSetAtom(removeGroupAtom);
  const isGrouped = useAtomValue(isGroupedAtom);
  const copySelected = useSetAtom(copySelectedAtom);
  const [activeElement, setActiveElement] = useAtom(activeElementAtom);

  const handleDeleteClick = () => {
    deletedSelectedElements();
  };

  // TODO: This is interfering with the Text object. While typing, the delete key is triggering this event instead of backspace.

  // const handleDeletePress = (e: KeyboardEvent) => {
  //   if (e.key === 'Backspace') deletedSelectedElements();
  // };

  // useEffect(() => {
  //   window.addEventListener('keydown', handleDeletePress);

  //   return () => {
  //     window.removeEventListener('keydown', handleDeletePress);
  //   };
  // }, []);

  const handleUngroupElements = () => {
    removeGroup();
  };
  const handleGroupElements = () => {
    addGroup();
  };

  const handleCopyClick = () => {
    copySelected();
  };

  return (
    <Box
      p="xs"
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {activeElement && isPath(activeElement) && (
        <SvgPathToolbar element={activeElement} setElement={setActiveElement} />
      )}
      {activeElement && isCurve(activeElement) && (
        <SvgCurveToolbar element={activeElement} setElement={setActiveElement} />
      )}
      {activeElement && isText(activeElement) && (
        <TextToolbar element={activeElement} setElement={setActiveElement} />
      )}
      {activeElement && isImage(activeElement) && <ImageToolbar />}
      {!activeElement && <CanvasToolbar />}
      <div style={{ flex: 1 }} />
      <Group spacing="xs">
        <Menu closeOnItemClick={false}>
          <Menu.Target>
            <ActionIcon size={36} variant="default">
              <LayoutDashboard />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Alignment</Menu.Label>
            <Menu.Item>
              <SegmentedControl
                data={[
                  { label: <LayoutAlignBottom />, value: 'none' },
                  { label: <LayoutAlignCenter />, value: 'dashed' },
                  { label: <LayoutAlignTop />, value: 'all' }
                ]}
              />
            </Menu.Item>
            <Menu.Item>
              <SegmentedControl
                data={[
                  { label: <LayoutAlignLeft />, value: 'none' },
                  { label: <LayoutAlignMiddle />, value: 'dashed' },
                  { label: <LayoutAlignRight />, value: 'all' }
                ]}
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {!isGrouped && selectedElements.length > 1 ? (
          <ActionIcon
            onClick={handleGroupElements}
            variant="outline"
            color="dark"
            style={{ borderRadius: 4, borderColor: '#ccc' }}
            size={36}
          >
            <FaRegObjectUngroup />
          </ActionIcon>
        ) : selectedElements.length > 1 ? (
          <ActionIcon
            onClick={handleUngroupElements}
            variant="light"
            color="dark"
            style={{ borderRadius: 4, borderColor: '#ccc' }}
            size={36}
          >
            <FaRegObjectUngroup />
          </ActionIcon>
        ) : null}
        <ActionIcon
          size={36}
          variant="default"
          onClick={handleCopyClick}
          disabled={selectedElements.length === 0}
        >
          <Copy />
        </ActionIcon>
        <Menu width={170} position="bottom-end" closeOnItemClick={false}>
          <Menu.Target>
            <ActionIcon size={36} variant="default" disabled={selectedElements.length !== 1}>
              <Eye />
            </ActionIcon>
          </Menu.Target>
        </Menu>
        <ActionIcon size={36} variant="light" onClick={handleDeleteClick} color="red">
          <Trash />
        </ActionIcon>
      </Group>
    </Box>
  );
}
