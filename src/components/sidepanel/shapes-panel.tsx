import React from 'react';
import { Text, Space, createStyles, SimpleGrid } from '@mantine/core';
import { useSetAtom, atom, PrimitiveAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { getShapes } from '../../api';
import { addElementAtom } from '@/components/canvas/element.store';
import { Atom, CanvasElementType, IPath } from '../canvas/types';

const useStyles = createStyles(() => ({
  shape: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
      transform: 'scale(1.1)',
      transition: 'transform 0.3s'
    }
  }
}));

export function ShapesPanel() {
  const query = useQuery(['shapes'], getShapes);
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: IPath) => {
    const newAtom: Atom<IPath> = atom(newEl);
    addElement({ type: 'path', atom: newAtom });
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Shapes
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        {query.data?.data?.map((item) => (
          <svg
            key={item.id}
            className={classes.shape}
            width={75}
            onClick={() => handleAddElement(item.data)}
            fill={item.data.attrs.svgElement.fill}
            stroke={item.data.attrs.svgElement.stroke}
            strokeWidth={item.data.attrs.svgElement.strokeWidth}
            viewBox={item.data.attrs.svgElement.viewBox}
          >
            <path {...item.data.attrs.pathElement} />
          </svg>
        ))}
      </SimpleGrid>
    </>
  );
}
