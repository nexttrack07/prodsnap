import React from 'react';
import { Box, Group, ActionIcon, Menu, SegmentedControl, Button } from '@mantine/core';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  elementAtomsAtom,
  selectedElementAtomsAtom,
  groupsByIdAtom,
  isPath,
  activeElementAtomAtom,
  isCurve,
  isText,
  isImage,
  CanvasElementWithPointAtoms
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
import { sidepanelAtom } from '../sidepanel';

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
  (get, set, element: CanvasElementWithPointAtoms) => {
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
    // get min and max x and y
    const minX = Math.min(...selectedElements.map((el) => el.x));
    const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));
    const minY = Math.min(...selectedElements.map((el) => el.y));
    const maxY = Math.max(...selectedElements.map((el) => el.y + el.height));

    if (align === 'left') {
      selectedElementAtoms.forEach((elAtom) => {
        set(elAtom, (el) => ({
          ...el,
          x: minX
        }));
      });
    } else if (align === 'center') {
      selectedElementAtoms.forEach((elAtom) => {
        set(elAtom, (el) => ({
          ...el,
          x: minX + (maxX - minX) / 2 - el.width / 2
        }));
      });
    } else if (align === 'right') {
      selectedElementAtoms.forEach((elAtom) => {
        set(elAtom, (el) => ({
          ...el,
          x: maxX - el.width
        }));
      });
    } else if (align === 'top') {
      selectedElementAtoms.forEach((elAtom) => {
        set(elAtom, (el) => ({
          ...el,
          y: minY
        }));
      });
    } else if (align === 'middle') {
      selectedElementAtoms.forEach((elAtom) => {
        set(elAtom, (el) => ({
          ...el,
          y: minY + (maxY - minY) / 2 - el.height / 2
        }));
      });
    } else if (align === 'bottom') {
      selectedElementAtoms.forEach((elAtom) => {
        set(elAtom, (el) => ({
          ...el,
          y: maxY - el.height
        }));
      });
    }
  }
);

export function Toolbar() {
  const deletedSelectedElements = useSetAtom(deleteSelectedAtom);
  const selectedElements = useAtomValue(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);
  const removeGroup = useSetAtom(removeGroupAtom);
  const isGrouped = useAtomValue(isGroupedAtom);
  const copySelected = useSetAtom(copySelectedAtom);
  // const [activeElement, setActiveElement] = useAtom(activeElementAtom);
  const alignElements = useSetAtom(alignElementsAtom);
  const [position, setPosition] = useAtom(sidepanelAtom);

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

  const handleAlignClick = (align: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    alignElements(align);
  };

  const handlePositionClick = () => {
    setPosition('position');
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
      <SvgPathToolbar />
      <TextToolbar />
      <ImageToolbar />
      <SvgCurveToolbar />
      {/* {!activeElement && <CanvasToolbar />} */}
      <div style={{ flex: 1 }} />
      <Group spacing="xs">
        {selectedElements.length > 1 && (
          <Menu closeOnItemClick={false}>
            <Menu.Target>
              <Button leftIcon={<LayoutDashboard size={18} />} variant="default" size="xs">
                Alignment
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Alignment</Menu.Label>
              <Menu.Item>
                <SegmentedControl
                  onChange={(value) =>
                    handleAlignClick(
                      value as 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
                    )
                  }
                  data={[
                    { label: <LayoutAlignBottom />, value: 'bottom' },
                    { label: <LayoutAlignCenter />, value: 'center' },
                    { label: <LayoutAlignTop />, value: 'top' }
                  ]}
                />
              </Menu.Item>
              <Menu.Item>
                <SegmentedControl
                  onChange={(value) =>
                    handleAlignClick(
                      value as 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
                    )
                  }
                  data={[
                    { label: <LayoutAlignLeft />, value: 'left' },
                    { label: <LayoutAlignMiddle />, value: 'middle' },
                    { label: <LayoutAlignRight />, value: 'right' }
                  ]}
                />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
        {!isGrouped && selectedElements.length > 1 ? (
          <Button onClick={handleGroupElements} variant="default" size="xs">
            Group
          </Button>
        ) : selectedElements.length > 1 ? (
          <Button onClick={handleUngroupElements} variant="light" size="xs">
            Ungroup
          </Button>
        ) : null}
        <Button leftIcon={<Copy size={18} />} onClick={handleCopyClick} size="xs" variant="default">
          Copy
        </Button>
        <Button
          onClick={handlePositionClick}
          size="xs"
          variant={position === 'position' ? 'light' : 'default'}
        >
          Position
        </Button>
        <ActionIcon size={36} variant="outline" onClick={handleDeleteClick} color="red">
          <Trash />
        </ActionIcon>
      </Group>
    </Box>
  );
}
