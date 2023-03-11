import {
  Text,
  Space,
  createStyles,
  SimpleGrid,
  Center,
  Divider,
  Loader,
  Button,
  useMantineTheme
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

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: 'pointer',
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: '0 0 1px rgba(0,0,0,0.3)',
    borderRadius: 5,
    padding: 8,
    '&:hover': {
      opacity: 0.7,
      transform: 'scale(1.1)',
      transition: 'transform 0.3s'
    }
  }
}));

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
  const { classes } = useStyles();
  const theme = useMantineTheme()
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const setElementAtoms = useSetAtom(elementAtomsAtom);
  const setSelectedAtoms = useSetAtom(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);

  // useEffect(() => {
  //   async function getTemplateData() {
  //     try {
  //       setLoading(true);
  //       const data = await getTemplates();
  //       setData(data);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   getTemplateData();
  // }, []);

  const handleAddElement = (newEl: CanvasElement) => {
    addElement(newEl);
  };

  const handleAddTemplate = (newEls: CanvasElement[]) => {
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
                  border: `1px solid ${theme.colors.gray[1]}}`,
                  backgroundColor: theme.colors.gray[0],
                  padding: '8px 16px',
                  borderRadius: 2,
                  cursor: 'pointer'
                }}>
                {item.data.content}
              </Text>
            );
          }
          return null;
        })}
      </SimpleGrid>
      <Divider my="xl" variant="dotted" />
      <SimpleGrid cols={2}>
        {loading && <Loader />}
        {data &&
          data.map((item: any) => (
            <Button onClick={() => handleAddTemplate(JSON.parse(item.data.template))} key={item.id}>
              Add Template
            </Button>
          ))}
      </SimpleGrid>
    </>
  );
}
