import React, { useRef } from 'react';
import {
  ActionIcon,
  ColorPicker,
  Group,
  Popover,
  DEFAULT_THEME,
  NumberInput,
  SegmentedControl,
  NumberInputHandlers,
  Box,
  Stack,
  Text,
  Slider
} from '@mantine/core';
import { activeElementAtom, SVGCurveWithPointAtoms } from '@/components/canvas/store';
import { Line, LineDashed, LineDotted, VectorBezier } from 'tabler-icons-react';
import { atom, useAtom } from 'jotai';

type Marker = Record<SVGCurveWithPointAtoms['startMarker'], React.ReactNode>;

export const START_MARKERS: Marker = {
  none: (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 12v-.75h16a.75.75 0 0 1 0 1.5H5V12z"
        clipRule="evenodd"
      />
      <path fill="currentColor" d="M5 9.5v5L3 12l2-2.5z" />
    </>
  ),
  'outline-arrow': (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.97 12.53a.75.75 0 0 1 0-1.06l4.773-4.773a.75.75 0 0 1 1.06 1.06L5.311 11.25H20.5a.75.75 0 0 1 0 1.5H5.31l3.493 3.493a.75.75 0 1 1-1.06 1.06L2.97 12.53z"
        clipRule="evenodd"
      />
    </>
  ),
  'fill-arrow': (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M2.624 11.584a.5.5 0 0 0 0 .832l7.599 5.066a.5.5 0 0 0 .777-.416V6.934a.5.5 0 0 0-.777-.416l-7.599 5.066z"
      />
    </>
  ),
  'outline-circle': (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM7 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
        clipRule="evenodd"
      />
    </>
  ),
  'fill-circle': (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M4.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM7 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
        clipRule="evenodd"
      />
    </>
  )
};

export const END_MARKERS: Marker = {
  none: (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.75 12a.75.75 0 0 1 .75-.75H19a.75.75 0 0 1 0 1.5H3.5a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path fill="currentColor" d="M19 9.5v5l2-2.5-2-2.5z" />
    </>
  ),
  'outline-arrow': (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m16.257 6.697 4.773 4.773a.75.75 0 0 1 0 1.06l-4.773 4.773a.75.75 0 0 1-1.06-1.06l3.492-3.493H3.5a.75.75 0 0 1 0-1.5h15.19l-3.493-3.493a.75.75 0 1 1 1.06-1.06z"
        clipRule="evenodd"
      />
    </>
  ),
  'fill-arrow': (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.75 12a.75.75 0 0 1 .75-.75H13a.75.75 0 0 1 0 1.5H3.5a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M21.376 11.584a.5.5 0 0 1 0 .832l-7.599 5.066a.5.5 0 0 1-.777-.416V6.934a.5.5 0 0 1 .777-.416l7.599 5.066z"
      />
    </>
  ),
  'outline-circle': (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.75 12a.75.75 0 0 1 .75-.75H13a.75.75 0 0 1 0 1.5H3.5a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM17 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
        clipRule="evenodd"
      />
    </>
  ),
  'fill-circle': (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.75 12a.75.75 0 0 1 .75-.75H13a.75.75 0 0 1 0 1.5H3.5a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M14.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM17 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
        clipRule="evenodd"
      />
    </>
  )
};

const elementAtom = atom(
  (get) => {
    const element = get(activeElementAtom);
    if (element && element.type === 'svg-curve') {
      return element;
    }
    return null;
  },
  (get, set, element: Partial<SVGCurveWithPointAtoms>) => {
    const activeElement = get(activeElementAtom);
    if (activeElement && activeElement?.type === 'svg-curve') {
      set(activeElementAtom, { ...activeElement, ...element });
    }
  }
);

export function SvgCurveToolbar() {
  const handlers = useRef<NumberInputHandlers>();
  const [element, setElement] = useAtom(elementAtom);

  if (!element) return null;

  return (
    <Group>
      <Popover>
        <Popover.Target>
          <ActionIcon size={36}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderColor: element.stroke,
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
            value={element.stroke}
            onChange={(val) => setElement({ stroke: val })}
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
          value={element.strokeWidth}
          onChange={(val) => setElement({ strokeWidth: val ?? element.strokeWidth })}
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

      <SegmentedControl
        size="xs"
        value={element.strokeDasharray ?? ''}
        onChange={(val) => setElement({ strokeDasharray: val ?? '' })}
        data={[
          { label: <Line />, value: '' },
          { label: <LineDashed />, value: '21,7' },
          { label: <LineDotted />, value: '7,7' }
        ]}
      />

      <Popover withArrow shadow="sm">
        <Popover.Target>
          <ActionIcon variant="default" size={36}>
            <svg width={24} height={24}>
              {START_MARKERS[element.startMarker]}
            </svg>
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <Group spacing={2}>
              {Object.entries(START_MARKERS).map(([id, comp]) => (
                <ActionIcon
                  key={id}
                  onClick={() => setElement({ startMarker: id as keyof Marker })}
                  size={36}
                  color="dark"
                  variant={element.startMarker === id ? 'light' : 'default'}
                >
                  <svg width={24} height={24}>
                    {comp}
                  </svg>
                </ActionIcon>
              ))}
            </Group>
            <Stack spacing={3}>
              <Text size="sm">Size</Text>
              <Slider
                value={element.markerSize ?? 30}
                onChange={(val) => setElement({ markerSize: val })}
              />
            </Stack>
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <Popover withArrow shadow="sm">
        <Popover.Target>
          <ActionIcon variant="default" size={36}>
            <svg width={24} height={24}>
              {END_MARKERS[element.endMarker]}
            </svg>
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <Group spacing={2}>
              {Object.entries(END_MARKERS).map(([id, comp]) => (
                <ActionIcon
                  key={id}
                  color="dark.6"
                  onClick={() => setElement({ endMarker: id as keyof Marker })}
                  size={36}
                  variant={element.endMarker === id ? 'light' : 'default'}
                >
                  <svg width={24} height={24}>
                    {comp}
                  </svg>
                </ActionIcon>
              ))}
            </Group>
            <Stack spacing={3}>
              <Text size="sm">Size</Text>
              <Slider
                value={element.markerSize ?? 30}
                onChange={(val) => setElement({ markerSize: val })}
              />
            </Stack>
          </Stack>
        </Popover.Dropdown>
      </Popover>
      <SegmentedControl
        size="xs"
        value={element.isQuadratic ? 'curved' : 'straight'}
        onChange={(val) => setElement({ isQuadratic: val === 'curved' })}
        data={[
          { label: <Line />, value: 'straight' },
          { label: <VectorBezier />, value: 'curved' }
        ]}
      />
    </Group>
  );
}
