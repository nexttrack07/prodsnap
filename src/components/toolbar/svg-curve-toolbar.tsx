import React, { useRef, useState } from 'react';
import {
  ActionIcon,
  ColorPicker,
  Group,
  Popover,
  DEFAULT_THEME,
  NumberInput,
  NumberInputHandlers,
  Box,
  SegmentedControl,
  Grid
} from '@mantine/core';
import { MoveableElement, selectedElementAtomsAtom, SVGCurveType } from '@/components/canvas/store';
import { atom } from 'jotai';
import { Line, LineDashed, LineDotted } from 'tabler-icons-react';

type Marker = Record<SVGCurveType['startMarker'], React.ReactNode>;

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
  )
};

const svgPropsAtom = atom(
  (get) => {
    const selectedElementAtoms = get(selectedElementAtomsAtom);
    if (selectedElementAtoms.length === 1) {
      const selectedElement = get(selectedElementAtoms[0]);
      return selectedElement as MoveableElement & SVGCurveType;
    }
  },
  (get, set, update: { stroke?: string; strokeWidth?: number }) => {
    const selectedElementAtoms = get(selectedElementAtomsAtom);
    if (selectedElementAtoms.length === 1) {
      set(selectedElementAtoms[0], (el) => {
        if (el.type === 'svg-curve') {
          return { ...el, ...update };
        }
        return el;
      });
    }
  }
);

type Props = {
  element: MoveableElement & SVGCurveType;
  setElement: (element: MoveableElement & SVGCurveType) => void;
};

export function SvgCurveToolbar({ element, setElement }: Props) {
  const handlers = useRef<NumberInputHandlers>();

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
            onChange={(val) =>
              setElement({
                ...element,
                stroke: val
              })
            }
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
          onChange={(val) => setElement({ ...element, strokeWidth: val ?? element.strokeWidth })}
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
        value={element.strokeDasharray ?? ''}
        onChange={(val) => setElement({ ...element, strokeDasharray: val ?? '' })}
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
          <Grid gutter="xs" justify="center" align="center">
            {Object.entries(START_MARKERS).map(([id, comp]) => (
              <Grid.Col key={id} span="content">
                <ActionIcon
                  onClick={() => setElement({ ...element, startMarker: id as keyof Marker })}
                  size={36}>
                  <svg width={24} height={24}>
                    {comp}
                  </svg>
                </ActionIcon>
              </Grid.Col>
            ))}
          </Grid>
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
          <Grid gutter="xs" justify="center" align="center">
            {Object.entries(END_MARKERS).map(([id, comp]) => (
              <Grid.Col key={id} span="content">
                <ActionIcon
                  onClick={() => setElement({ ...element, endMarker: id as keyof Marker })}
                  size={36}>
                  <svg width={24} height={24}>
                    {comp}
                  </svg>
                </ActionIcon>
              </Grid.Col>
            ))}
          </Grid>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
