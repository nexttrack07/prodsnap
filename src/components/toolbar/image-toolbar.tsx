import React, { useRef } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  ColorPicker,
  NumberInputHandlers,
  NumberInput,
  DEFAULT_THEME,
  Group,
  Popover
} from '@mantine/core';
import { ImageType, selectedImageAtom, sidepanelAtom } from '@/components/canvas/store';
import { atom, useAtom, useAtomValue } from 'jotai';

const imageMaskAtom = atom(
  (get) => {
    const image = get(selectedImageAtom);
    if (!image) return null;
    return image.mask;
  },
  (get, set, mask: Partial<ImageType['mask']>) => {
    const image = get(selectedImageAtom);
    if (!image) return;
    console.log('mask: ', mask);
    set(selectedImageAtom, { ...image, mask: { ...image.mask, ...mask } });
  }
);

export function ImageToolbar() {
  const [sidepanel, setSidepanel] = useAtom(sidepanelAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const [mask, setMask] = useAtom(imageMaskAtom);
  const handlers = useRef<NumberInputHandlers>();

  if (!selectedImage) {
    return null;
  }

  const renderMaskProperties = () => {
    if (!mask || mask.id === 'none') return null;

    return (
      <Group>
        <Popover>
          <Popover.Target>
            <ActionIcon size={36}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderColor: mask.stroke,
                  borderWidth: 8,
                  borderStyle: 'solid',
                  borderRadius: 3
                }}
              />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <ColorPicker
              format="rgba"
              value={mask.stroke}
              onChange={(val) => setMask({ stroke: val })}
              swatches={[
                ...DEFAULT_THEME.colors.red,
                ...DEFAULT_THEME.colors.yellow,
                ...DEFAULT_THEME.colors.green,
                ...DEFAULT_THEME.colors.blue
              ]}
            />
          </Popover.Dropdown>
        </Popover>
        <Group spacing={5}>
          <ActionIcon size={36} variant="default" onClick={() => handlers.current?.decrement()}>
            –
          </ActionIcon>

          <NumberInput
            hideControls
            value={mask.strokeWidth}
            onChange={(val) => setMask({ strokeWidth: val ?? mask.strokeWidth })}
            handlersRef={handlers}
            max={50}
            min={1}
            step={1}
            styles={{ input: { width: 54, textAlign: 'center' } }}
          />

          <ActionIcon size={36} variant="default" onClick={() => handlers.current?.increment()}>
            +
          </ActionIcon>
        </Group>
      </Group>
    );
  };

  return (
    <Group>
      <Button
        onClick={() => setSidepanel((s) => (s === 'image-editing' ? 'upload' : 'image-editing'))}
        size="xs"
        variant={sidepanel === 'image-editing' ? 'light' : 'outline'}
      >
        Edit Photo
      </Button>
      {renderMaskProperties()}
    </Group>
  );
}
