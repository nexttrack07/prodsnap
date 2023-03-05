import React, { useState } from 'react';
import { Stack, Button, Box } from '@mantine/core';
import {
  Template,
  Camera,
  Photo,
  TextCaption,
  Line,
  Shape,
  ChartInfographic,
  Icon,
} from "tabler-icons-react";
import { ShapesPanel } from './shapes-panel';
import { PhotosPanel } from './photos-panel';
import { TextPanel } from './text-panel';
import { UploadPanel } from './upload-panel';
import { CurvesPanel } from './curves-panel';

export const SIDEBAR_SIZE = 60;
export const SIDEPANEL_SIZE = 300 + SIDEBAR_SIZE;

type NavState = "templates" | "upload" | "photos" | "text" | "curves" | "shapes" | "graphics";

const navItems: { icon: Icon; label: string; id: NavState }[] = [
  { icon: Template, label: "Template", id: "templates" },
  { icon: Camera, label: "Upload", id: "upload" },
  { icon: Photo, label: "Photos", id: "photos" },
  { icon: TextCaption, label: "Text", id: "text" },
  { icon: Line, label: "Curves", id: "curves" },
  { icon: Shape, label: "Shapes", id: "shapes" },
  { icon: ChartInfographic, label: "Graphics", id: "graphics" },
];

const panelMap: Record<NavState, JSX.Element> = {
  templates: <div>Templates</div>,
  upload: <UploadPanel />,
  photos: <PhotosPanel />,
  text: <TextPanel />,
  curves: <CurvesPanel />,
  shapes: <ShapesPanel />,
  graphics: <div>Graphics</div>,
}

export function Sidepanel() {
  const [active, setActive] = useState<NavState>("shapes");

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <Stack
        spacing="xl"
        sx={(theme) => ({
          width: SIDEBAR_SIZE,
          height: "100%",
          padding: theme.spacing.xs,
          paddingTop: theme.spacing.lg,
          borderRight: "1px solid",
          borderColor: theme.colors.gray[2],
        })}
        justify="flex-start"
      >
        {navItems.map((item) => (
          <Button
            key={item.label}
            onClick={() => setActive(item.id)}
            variant={active === item.id ? "light" : "subtle"}
            color={active === item.id ? "blue" : "dark.8"}
            sx={{ margin: 1, padding: 4 }}
          >
            <item.icon strokeWidth={1.2} />
          </Button>
        ))}
      </Stack>
      <Box sx={{ width: "100%" }} p="lg">
        {panelMap[active]}
      </Box>
    </div>
  )
}
