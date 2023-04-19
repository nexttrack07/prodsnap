import { SVGGraphicType } from '@/components/canvas/store';
import { uuid } from '@/utils';
import { Image, ScrollArea, SimpleGrid, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
// import DATA from './data.json';
import { getGraphics } from '@/api/template';

// const getGraphics = (): Promise<SVGGraphicType[]> => {
//   return Promise.resolve(DATA as unknown as SVGGraphicType[]);
// };

export function GraphicsPanel() {
  const query = useQuery(['graphics'], getGraphics);

  return (
    <div>
      <Text size="md">Graphics</Text>
      <br />
      <ScrollArea.Autosize maxHeight={`calc(100vh - 150px)`}>
        <SimpleGrid cols={5} spacing="md">
          {query.data?.map((graphic) => (
            <Image height={50} src={graphic.url} key={uuid()} alt={graphic.desc} />
          ))}
        </SimpleGrid>
      </ScrollArea.Autosize>
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
