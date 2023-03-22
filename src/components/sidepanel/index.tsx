import React, { useState } from 'react';
import { Stack, Button, Box, useMantineTheme } from '@mantine/core';
import {
  Template,
  Camera,
  Photo,
  TextCaption,
  Line,
  Shape,
  ChartInfographic,
  Icon
} from 'tabler-icons-react';
import { ShapesPanel } from './shapes-panel';
import { PhotosPanel } from './photos-panel';
import { TextPanel } from './text-panel';
import { UploadPanel } from './upload-panel';
import { CurvesPanel } from './curves-panel';
import { atom, useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { PositionPanel } from './position-panel';

export const SIDEBAR_SIZE = 60;
export const SIDEPANEL_SIZE = 350 + SIDEBAR_SIZE;

type NavState =
  | 'templates'
  | 'upload'
  | 'photos'
  | 'text'
  | 'curves'
  | 'shapes'
  | 'graphics'
  | 'position';

const navItems: { icon: Icon; label: string; id: NavState }[] = [
  { icon: Template, label: 'Template', id: 'templates' },
  { icon: Camera, label: 'Upload', id: 'upload' },
  { icon: Photo, label: 'Photos', id: 'photos' },
  { icon: TextCaption, label: 'Text', id: 'text' },
  { icon: Line, label: 'Curves', id: 'curves' },
  { icon: Shape, label: 'Shapes', id: 'shapes' },
  { icon: ChartInfographic, label: 'Graphics', id: 'graphics' }
];

const panelMap: Record<NavState, JSX.Element> = {
  templates: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      Templates
    </motion.div>
  ),
  upload: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      <UploadPanel />
    </motion.div>
  ),
  photos: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      <PhotosPanel />
    </motion.div>
  ),
  text: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      <TextPanel />
    </motion.div>
  ),
  curves: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      <CurvesPanel />
    </motion.div>
  ),
  shapes: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      <ShapesPanel />
    </motion.div>
  ),
  graphics: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      Graphics
    </motion.div>
  ),
  position: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
    >
      <PositionPanel />
    </motion.div>
  )
};

export const sidepanelAtom = atom<NavState>('shapes');

export function Sidepanel() {
  const [active, setActive] = useAtom(sidepanelAtom);
  const theme = useMantineTheme();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <Stack
        spacing="xl"
        sx={{
          width: SIDEBAR_SIZE,
          height: '100%',
          padding: theme.spacing.xs,
          paddingTop: theme.spacing.lg,
          borderRight: `1px solid ${theme.colors.gray[4]}`
        }}
        justify="flex-start"
      >
        {navItems.map((item) => (
          <Button
            key={item.label}
            onClick={() => setActive(item.id)}
            variant={active === item.id ? 'light' : 'subtle'}
            color={active === item.id ? 'blue' : 'dark.8'}
            sx={{ margin: 1, padding: 4 }}
          >
            <item.icon strokeWidth={1.2} />
          </Button>
        ))}
      </Stack>
      <Box sx={{ width: '100%', borderRight: `1px solid ${theme.colors.gray[4]}` }} p="lg">
        <AnimatePresence>{panelMap[active]}</AnimatePresence>
      </Box>
    </div>
  );
}
