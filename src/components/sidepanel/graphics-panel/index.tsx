import { uuid } from '@/utils';
import { Image, ScrollArea, SimpleGrid, Text, createStyles } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getGraphics } from '@/api/template';
import { useSetAtom } from 'jotai';
import { CanvasElementWithPointAtoms, addElementAtom } from '@/components/canvas/store';

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

export function GraphicsPanel() {
  const query = useQuery(['graphics'], getGraphics);
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  return (
    <div>
      <Text size="md">Graphics</Text>
      <br />
      <ScrollArea.Autosize maxHeight={`calc(100vh - 150px)`}>
        <SimpleGrid cols={5} spacing="md">
          {query.data?.map((graphic) => (
            <Image
              onClick={() => {
                handleAddElement({
                  type: 'svg-graphic',
                  url: graphic.url,
                  alt: graphic.desc,
                  x: 100,
                  y: 200,
                  width: 100,
                  height: 200
                });
              }}
              className={classes.shape}
              height={50}
              src={graphic.url}
              key={uuid()}
              alt={graphic.desc}
            />
          ))}
        </SimpleGrid>
      </ScrollArea.Autosize>
    </div>
  );
}
