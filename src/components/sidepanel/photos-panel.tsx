import React from 'react';
import { Text, Space, createStyles, SimpleGrid, Image } from '@mantine/core';
import { useSetAtom } from 'jotai';
import {
  CanvasElementWithPointAtoms,
  MoveableElement,
  ImageType,
  ImageState,
  addElementAtom
} from '../../components/canvas/store';

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: 'pointer',
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: '0 0 1px rgba(0,0,0,0.3)',
    padding: 8,
    '&:hover': {
      opacity: 0.7,
      transform: 'scale(1.1)',
      transition: 'transform 0.3s'
    }
  }
}));

const data: { id: number; data: MoveableElement & ImageType }[] = [
  {
    id: 0,
    data: {
      type: 'image',
      state: ImageState.Normal,
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      url: 'https://media.kohlsimg.com/is/image/kohls/4637183_Navy_Blue?wid=600&hei=600&op_sharpen=1'
    }
  },
  {
    id: 1,
    data: {
      type: 'image',
      state: ImageState.Normal,
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      url: '/winter-hat.png'
    }
  }
];

export function PhotosPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Photos
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        {data.map((item) => (
          <Image
            key={item.id}
            radius="md"
            className={classes.shape}
            onClick={() => handleAddElement(item.data)}
            src={item.data.url}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
