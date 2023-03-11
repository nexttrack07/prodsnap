import {
  Box,
  Popover,
  Group,
  ActionIcon,
  ColorPicker,
  DEFAULT_THEME
} from "@mantine/core";
import { canvasAtom } from "../canvas/store";
import { useAtom } from "jotai";

import React from "react";



export function CanvasToolbar() {
  const [canvasProps, setCanvasProps] = useAtom(canvasAtom);

  return (
    <Group>
      <Popover>
        <Popover.Target>
          <ActionIcon size={36}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: canvasProps.backgroundColor,
                borderRadius: 3,
                border: "1px solid #ccc"
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={canvasProps.backgroundColor}
            onChange={(val) => setCanvasProps(prev => ({ ...prev, backgroundColor: val }))}
            swatches={[
              ...DEFAULT_THEME.colors.red,
              ...DEFAULT_THEME.colors.yellow,
              ...DEFAULT_THEME.colors.green,
              ...DEFAULT_THEME.colors.blue,
            ]}
          />
        </Popover.Dropdown>
      </Popover>

    </Group>
  );
}