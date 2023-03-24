import React, { useEffect, useState } from 'react';
import { getTemplates } from '@/api/template';
import { useSetAtom } from 'jotai';
import {
  CanvasElement,
  createAtom,
  elementAtomsAtom,
  selectedElementAtomsAtom
} from '../canvas/store';
import { addGroupAtom } from '../toolbar';
import { Box, Image, LoadingOverlay, SimpleGrid } from '@mantine/core';

export function TemplatesPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const setElementAtoms = useSetAtom(elementAtomsAtom);
  const setSelectedAtoms = useSetAtom(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);

  useEffect(() => {
    async function getTemplateData() {
      try {
        setLoading(true);
        const data = await getTemplates();
        console.log('data: ', data);
        setData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getTemplateData();
  }, []);

  const handleAddTemplate = (newEls: CanvasElement[]) => {
    // console.log('new els: ', newEls)
    const newElAtoms = newEls.map((el) => createAtom(el));
    console.log('new atoms: ', newElAtoms);
    setElementAtoms((elAtoms) => [...elAtoms, ...newElAtoms]);
    setSelectedAtoms(newElAtoms);
    addGroup();
  };

  return (
    <SimpleGrid cols={2}>
      <LoadingOverlay
        loaderProps={{ size: 'sm', color: 'pink', variant: 'bars' }}
        visible={loading}
      />
      {data &&
        data.map((item: any) => (
          <Box onClick={() => handleAddTemplate(deserialize(item.data.template))} key={item.id}>
            <Image src={item.data.url} />
          </Box>
        ))}
    </SimpleGrid>
  );
}

function deserialize(serializedObj: string): any {
  return JSON.parse(serializedObj, (key, value) => {
    if (typeof value === 'string' && value.match(/^function/)) {
      const funcBody = value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'));
      return new Function(`return ${value}`)();
    }
    return value;
  });
}
