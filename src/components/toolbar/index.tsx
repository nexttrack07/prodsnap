import React, { useEffect } from 'react';
import { Box, Group, ActionIcon, Menu, Button } from '@mantine/core';
import { FaRegObjectGroup, FaRegObjectUngroup } from 'react-icons/fa';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import {
  elementAtomsAtom,
  selectedElementAtomsAtom,
  activeElementAtomAtom,
  groupsByIdAtom
} from '../canvas/store';
import { SvgPathToolbar } from './svg-path-toolbar';
import { ImageToolbar } from './image-toolbar';
import { TextToolbar } from './text-toolbar';
import { CanvasToolbar } from './canvas-toolbar';
import { Copy, Eye, Trash } from 'tabler-icons-react';
import { SvgCurveToolbar } from './svg-curve-toolbar';

const getTypeAtom = atom((get) => {
  const activeElementAtom = get(activeElementAtomAtom);
  if (!activeElementAtom) return 'canvas';
  const activeElement = get(activeElementAtom);
  return activeElement.type;
});

const deleteSelectedAtom = atom(null, (get, set) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  set(elementAtomsAtom, (elementAtoms) =>
    elementAtoms.filter((elementAtom) => !selectedElementAtoms.includes(elementAtom))
  );
  set(selectedElementAtomsAtom, []);
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

export function Toolbar() {
  const type = useAtomValue(getTypeAtom);
  const deletedSelectedElements = useSetAtom(deleteSelectedAtom);
  const selectedElements = useAtomValue(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);
  const removeGroup = useSetAtom(removeGroupAtom);
  const isGrouped = useAtomValue(isGroupedAtom);
  const copySelected = useSetAtom(copySelectedAtom);

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
      }}>
      {type === 'text' && <TextToolbar />}
      {type === 'image' && <ImageToolbar />}
      {type === 'svg-path' && <SvgPathToolbar />}
      {type === 'svg-curve' && <SvgCurveToolbar />}
      {type === 'canvas' && <CanvasToolbar />}
      <div style={{ flex: 1 }} />
      <Group spacing="xs">
        {!isGrouped && selectedElements.length > 1 ? (
          <ActionIcon
            onClick={handleGroupElements}
            variant="outline"
            color="dark"
            style={{ borderRadius: 4, borderColor: '#ccc' }}
            size={36}>
            <FaRegObjectUngroup />
          </ActionIcon>
        ) : selectedElements.length > 1 ? (
          <ActionIcon
            onClick={handleUngroupElements}
            variant="light"
            color="dark"
            style={{ borderRadius: 4, borderColor: '#ccc' }}
            size={36}>
            <FaRegObjectUngroup />
          </ActionIcon>
        ) : null}
        <ActionIcon
          size={36}
          variant="default"
          onClick={handleCopyClick}
          disabled={selectedElements.length === 0}>
          <Copy />
        </ActionIcon>
        <Menu width={170} position="bottom-end" closeOnItemClick={false}>
          <Menu.Target>
            <ActionIcon size={36} variant="default" disabled={selectedElements.length !== 1}>
              <Eye />
            </ActionIcon>
          </Menu.Target>
        </Menu>
        <ActionIcon
          size={36}
          variant="light"
          onClick={handleDeleteClick}
          disabled={selectedElements.length === 0}
          color="red">
          <Trash />
        </ActionIcon>
      </Group>
    </Box>
  );
}
