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
import { useSetAtom } from 'jotai';
import React from 'react';
import {
  addElementAtom,
  CanvasElement,
  CanvasElementWithPointAtoms,
  createAtom,
  elementAtomsAtom,
  selectedElementAtomsAtom
} from '../../components/canvas/store';
import { getSelections } from '@/api/template';
import { addGroupAtom } from '../toolbar';
import { deserialize } from '@/utils';

const elementData: {
  id: number;
  data: CanvasElement;
}[] = [
  {
    id: 0,
    data: {
      x: 200,
      y: 100,
      type: 'text' as const,
      width: 300,
      height: 50,
      content: 'Heading',
      props: {
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
      type: 'text' as const,
      width: 300,
      height: 50,
      content: 'Subheading',
      props: {
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
      props: {
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
  const setSelectedAtoms = useSetAtom(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);
  const query = useQuery(['selections'], getSelections);

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  const handleAddTemplate = (newEls: CanvasElement[]) => {
    // console.log('new els: ', newEls)
    const newElAtoms = newEls.map((el) => createAtom(el));
    console.log('new atoms: ', newElAtoms);
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
      <SimpleGrid cols={2}>
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
      </SimpleGrid>
    </>
  );
}
