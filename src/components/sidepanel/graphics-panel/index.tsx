import { SVGGraphicType } from '@/components/canvas/store';
import { uuid } from '@/utils';
import { SimpleGrid, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import DATA from './data.json';

const getGraphics = (): Promise<SVGGraphicType[]> => {
  return Promise.resolve(DATA as unknown as SVGGraphicType[]);
};

export function GraphicsPanel() {
  const query = useQuery(['graphics'], getGraphics);

  return (
    <div>
      <Text size="md">Graphics</Text>
      <br />
      <SimpleGrid cols={5} spacing="md">
        {query.data?.map((graphic) => (
          <RenderGraphic key={uuid()} graphic={graphic} />
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
