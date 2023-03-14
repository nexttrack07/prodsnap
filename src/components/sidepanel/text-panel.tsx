import {
  Text,
  Space,
  createStyles,
  SimpleGrid,
  Center,
  Divider,
  Loader,
  Button,
  useMantineTheme,
  Image,
  Box
} from '@mantine/core';
import { getTemplates } from '../../api/template';
import { atom, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import {
  addElementAtom,
  CanvasElement,
  elementAtomsAtom,
  selectedElementAtomsAtom
} from '../../components/canvas/store';
import { addGroupAtom } from '../toolbar';

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
          color: '#000',
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
          color: '#000',
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
          color: '#000',
        }
      }
    },
  ];

export function TextPanel() {
  const addElement = useSetAtom(addElementAtom);
  const theme = useMantineTheme()
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
        console.log('data: ', data)
        setData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getTemplateData();
  }, []);

  const handleAddElement = (newEl: CanvasElement) => {
    addElement(newEl);
  };

  const handleAddTemplate = (newEls: CanvasElement[]) => {
    // console.log('new els: ', newEls)
    const newElAtoms = newEls.map((el) => atom(el));
    setElementAtoms((elAtoms) => [...elAtoms, ...newElAtoms]);
    setSelectedAtoms(newElAtoms);
    addGroup();
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
                }}>
                {item.data.content}
              </Text>
            );
          }
          return null;
        })}
      </SimpleGrid>
      <Divider my="xl" variant="dotted" />
      <SimpleGrid cols={1}>
        {loading && <Loader />}
        {data &&
          data.map((item: any) => (
            <Box onClick={() => handleAddTemplate(deserialize(item.data.template))} key={item.id}>
              <Image width={200} src={item.data.url} />
            </Box>
          ))}
      </SimpleGrid>
    </>
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