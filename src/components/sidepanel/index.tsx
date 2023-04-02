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
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { PositionPanel } from './position-panel';
import { TemplatesPanel } from './templates-panel';
import { NavState, sidepanelAtom } from '../canvas/store';
import { ImageOptions } from './image-options';

export const SIDEBAR_SIZE = 60;
export const SIDEPANEL_SIZE = 350 + SIDEBAR_SIZE;

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
  templates: <TemplatesPanel />,
  upload: <UploadPanel />,
  photos: <PhotosPanel />,
  text: <TextPanel />,
  curves: <CurvesPanel />,
  shapes: <ShapesPanel />,
  graphics: <>Graphics</>,
  position: <PositionPanel />,
  'image-editing': <ImageOptions />
};

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
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0 }}
          >
            {panelMap[active]}
          </motion.div>
        </AnimatePresence>
      </Box>
    </div>
  );
}
