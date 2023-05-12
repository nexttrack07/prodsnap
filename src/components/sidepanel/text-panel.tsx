import {
  Text,
  Space,
  SimpleGrid,
  Divider,
  useMantineTheme,
  LoadingOverlay,
  Box,
  Image
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { atom, useSetAtom } from 'jotai';
import React from 'react';
import {
  addElementAtom,
  CanvasElement,
  CanvasElementWithPointAtoms,
  createAtom,
  elementAtomsAtom,
  selectedElementAtomsAtom
} from '../../components/canvas/store';
import { addGroupAtom } from '../toolbar';
import { deserialize } from '@/utils';
import { Element, ElementGroup, elementGroupAtomsAtom } from '@/stores/elements';

const elementData: {
  id: number;
  data: Element;
}[] = [
  {
    id: 0,
    data: {
      x: 200,
      y: 100,
      type: 'text' as const,
      width: 300,
      angle: 0,
      height: 50,
      content: 'Heading',
      textProps: {
        fontSize: 50,
        color: '#000'
      }
    }
  },
  {
    id: 1,
    data: {
      x: 200,
      y: 100,
      angle: 0,
      type: 'text' as const,
      width: 300,
      height: 50,
      content: 'Subheading',
      textProps: {
        fontSize: 30,
        color: '#000'
      }
    }
  },
  {
    id: 2,
    data: {
      x: 200,
      y: 100,
      type: 'text' as const,
      width: 300,
      height: 50,
      content: 'A little bit of text',
      angle: 0,
      textProps: {
        fontSize: 20,
        color: '#000'
      }
    }
  }
];

export function TextPanel() {
  const addElement = useSetAtom(addElementAtom);
  const theme = useMantineTheme();
  const setElementAtoms = useSetAtom(elementAtomsAtom);
  const setElementGroupAtoms = useSetAtom(elementGroupAtomsAtom);
  const setSelectedAtoms = useSetAtom(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);

  const handleAddElement = (newEl: Element) => {
    const newElementGroup: ElementGroup = {
      type: 'group',
      angle: 0,
      elements: [atom(newEl)]
    };
    setElementGroupAtoms((prev) => [...prev, atom(newElementGroup)]);
  };

  const handleAddTemplate = (newEls: CanvasElement[]) => {
    const newElAtoms = newEls.map((el) => createAtom(el));
    setElementAtoms((elAtoms) => [...elAtoms, ...newElAtoms]);
    setSelectedAtoms(newElAtoms);
    addGroup();
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Text
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={1}>
        {elementData.map((item: any) => {
          if (item.data.type === 'text') {
            return (
              <Text
                key={item.id}
                onClick={() => handleAddElement(item.data)}
                style={{
                  ...item.data.props,
                  backgroundColor: theme.colors.gray[1],
                  padding: '8px 16px',
                  borderRadius: 2,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: theme.colors.gray[4],
                  cursor: 'pointer',
                  display: 'block'
                }}
              >
                {item.data.content}
              </Text>
            );
          }
          return null;
        })}
      </SimpleGrid>
      <Divider my="xl" variant="dotted" />
      {/* <SimpleGrid cols={2}>
        <LoadingOverlay
          loaderProps={{ size: 'sm', color: 'pink', variant: 'bars' }}
          visible={query.isLoading}
        />
        {query.data &&
          query.data.map((item: any) => (
            <Box
              style={{ cursor: 'pointer' }}
              onClick={() => handleAddTemplate(deserialize(item.data.selection))}
              key={item.id}
            >
              <Image src={item.data.url} />
            </Box>
          ))}
      </SimpleGrid> */}
    </>
  );
}
