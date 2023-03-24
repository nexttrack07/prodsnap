import { Text, Space, SimpleGrid, Divider, useMantineTheme } from '@mantine/core';
import { useSetAtom } from 'jotai';
import React from 'react';
import { addElementAtom, CanvasElement } from '../../components/canvas/store';

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

  const handleAddElement = (newEl: CanvasElement) => {
    addElement(newEl);
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
    </>
  );
}
