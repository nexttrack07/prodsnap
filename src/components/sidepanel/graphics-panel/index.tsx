import { uuid } from '@/utils';
import { Image, ScrollArea, SimpleGrid, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getGraphics } from '@/api/template';

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
