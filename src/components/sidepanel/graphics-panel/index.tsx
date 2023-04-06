import { addElementAtom, SVGGraphicType } from '@/components/canvas/store';
import { uuid } from '@/utils';
import { createStyles, SimpleGrid, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import React from 'react';
import DATA from './data.json';

const getGraphics = (): Promise<SVGGraphicType[]> => {
  return Promise.resolve(DATA as unknown as SVGGraphicType[]);
};

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

  const handleGraphicClick = (graphic: SVGGraphicType) => {
    addElement({
      type: 'svg',
      graphic,
      x: 100,
      y: 100,
      width: 100,
      height: 100
    });
  };

  return (
    <div>
      <Text size="md">Graphics</Text>
      <br />
      <SimpleGrid cols={5} spacing="md">
        {query.data?.map((graphic) => (
          <div className={classes.shape} onClick={() => handleGraphicClick(graphic)} key={uuid()}>
            <RenderGraphic graphic={graphic} />
          </div>
        ))}
      </SimpleGrid>
    </div>
  );
}

function RenderGraphic({ graphic }: { graphic: SVGGraphicType }) {
  const element = createSVGElement(graphic);
  return <div>{element}</div>;
}

export function createSVGElement(graphic: SVGGraphicType): React.ReactElement {
  const children = graphic.children.map(createSVGElement);

  return React.createElement(graphic.name, graphic.attributes, graphic.value, ...children);
}
