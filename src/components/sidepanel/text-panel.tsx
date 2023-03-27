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

import { getSelections } from '@/api/template';
import { addGroupAtom } from '../toolbar';
import { deserialize } from '@/utils';
import { CanvasItemType, IText } from '../canvas/types';
import { addElementAtom, elementsAtom, selectedElementsAtom } from '../canvas/element.store';

const elementData: {
  id: number;
  data: IText;
}[] = [
  {
    id: 0,
    data: {
      type: 'text',
      attrs: {
        style: {
          fontSize: 50,
          fontFamily: 'open sans',
          color: '#000'
        },
        content: 'Heading'
      },
      left: 200,
      top: 100,
      width: 300,
      height: 50
    }
  },
  {
    id: 1,
    data: {
      type: 'text',
      attrs: {
        style: {
          fontSize: 30,
          fontFamily: 'open sans',
          color: '#000'
        },
        content: 'Subheading'
      },
      left: 200,
      top: 100,
      width: 300,
      height: 50
    }
  },
  {
    id: 2,
    data: {
      type: 'text',
      attrs: {
        style: {
          fontSize: 20,
          fontFamily: 'open sans',
          color: '#000'
        },
        content: 'A little bit of text'
      },
      left: 200,
      top: 100,
      width: 300,
      height: 50
    }
  }
];

// create fake data of type { id: number, data: IText }[]

export function TextPanel() {
  const addElement = useSetAtom(addElementAtom);
  const theme = useMantineTheme();
  // const setElementAtoms = useSetAtom(elementsAtom);
  // const setSelectedAtoms = useSetAtom(selectedElementsAtom);
  // const addGroup = useSetAtom(addGroupAtom);
  // const query = useQuery(['selections'], getSelections);

  const handleAddElement = (newEl: CanvasItemType) => {
    addElement(newEl);
  };

  // const handleAddTemplate = (newEls: CanvasElement[]) => {
  //   const newElAtoms = newEls.map((el) => createAtom(el));
  //   setElementAtoms((elAtoms) => [...elAtoms, ...newElAtoms]);
  //   setSelectedAtoms(newElAtoms);
  //   addGroup();
  // };

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
                  ...item.data.attrs.style,
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
                {item.data.attrs.content}
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
