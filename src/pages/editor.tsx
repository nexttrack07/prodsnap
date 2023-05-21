import { canvasAtom, unSelectAllAtom } from '@/components/canvas/store';
import { Center, AppShell, Footer, Text, Navbar } from '@mantine/core';
import { useSetAtom } from 'jotai';
import React from 'react';
import { Toolbar, Sidepanel, SIDEPANEL_SIZE, HeaderComponent } from '../components';
import { Canvas } from '@/components/element-canvas';

export const HEADER_SIZE = 60;
export const FOOTER_SIZE = 60;

export function Editor() {
  const unSelectAllElements = useSetAtom(unSelectAllAtom);
  const setCanvas = useSetAtom(canvasAtom);

  const handleEditorClick = () => {
    console.log('handleEditorClick');
    unSelectAllElements();
    setCanvas((c) => ({ ...c, isSelected: false }));
  };

  return (
    <AppShell
      navbar={
        <Navbar width={{ base: SIDEPANEL_SIZE }}>
          <Sidepanel />
        </Navbar>
      }
      header={<HeaderComponent />}
      padding={0}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            height: HEADER_SIZE,
            borderTop: 0,
            borderLeft: 0,
            borderRight: 0,
            borderBottom: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            borderStyle: 'solid'
          }}
        >
          <Toolbar />
        </div>
        <Center
          onClick={handleEditorClick}
          sx={(theme) => ({ flex: 1, backgroundColor: theme.colors.gray[1] })}
        >
          <Canvas />
        </Center>
      </div>
    </AppShell>
  );
}
