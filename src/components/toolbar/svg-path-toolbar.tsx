import React from 'react';
import {
  ActionIcon,
  ColorPicker,
  Group,
  Popover,
  DEFAULT_THEME,
  Menu,
  Slider,
  SegmentedControl,
  Box
} from '@mantine/core';
import {
  activeElementAtom,
  activeElementAtomAtom,
  CanvasElementWithPointAtoms,
  MoveableElement,
  SVGPathType
} from '@/components/canvas/store';
import { BorderAll, BorderNone, BorderRadius, BorderStyle2 } from 'tabler-icons-react';
import { atom, useAtom } from 'jotai';

const propsAtom = atom(
  (get) => {
    const element = get(activeElementAtom);
    if (element && element.type === 'svg-path') {
      return element.props;
    }
    return null;
  },
  (get, set, props: SVGPathType['props']) => {
    const element = get(activeElementAtom);
    if (element && element.type === 'svg-path') {
      set(activeElementAtom, { ...element, props });
    }
  }
);

const strokePropsAtom = atom(
  (get) => {
    const element = get(activeElementAtom);
    if (element && element.type === 'svg-path') {
      return element.strokeProps;
    }
    return null;
  },
  (get, set, strokeProps: SVGPathType['strokeProps']) => {
    const element = get(activeElementAtom);
    if (element && element.type === 'svg-path') {
      set(activeElementAtom, { ...element, strokeProps });
    }
  }
);

export function SvgPathToolbar() {
  const [svgProps, setProps] = useAtom(propsAtom);
  const [strokeProps, setStrokeProps] = useAtom(strokePropsAtom);

  if (!svgProps || !strokeProps) {
    return null;
  }

  return (
    <Group>
      <Popover>
        <Popover.Target>
          <ActionIcon variant="default" size={36}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderColor: strokeProps.stroke,
                borderWidth: 8,
                borderStyle: 'solid'
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={strokeProps.stroke}
            onChange={(val) =>
              setStrokeProps({
                ...strokeProps,
                stroke: val,
                strokeWidth: strokeProps.strokeWidth ?? 10
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
      <Popover>
        <Popover.Target>
          <ActionIcon variant="default" size={36}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: svgProps.fill
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={svgProps.fill}
            onChange={(val) => setProps({ ...svgProps, fill: val })}
            swatches={[
              ...DEFAULT_THEME.colors.red,
              ...DEFAULT_THEME.colors.yellow,
              ...DEFAULT_THEME.colors.green,
              ...DEFAULT_THEME.colors.blue
            ]}
          />
        </Popover.Dropdown>
      </Popover>
      <Menu closeOnItemClick={false}>
        <Menu.Target>
          <ActionIcon size={36} variant="default">
            <BorderRadius />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Border Type</Menu.Label>
          <Menu.Item>
            <SegmentedControl
              onChange={(val) => {
                let strokeWidth = 0,
                  strokeDasharray = '0';
                switch (val) {
                  case 'none':
                    strokeWidth = 0;
                  case 'dashed':
                    strokeDasharray = '5,10';
                    strokeWidth = strokeProps.strokeWidth === 0 ? 10 : strokeProps.strokeWidth;
                  case 'all':
                    strokeDasharray = '0';
                    strokeWidth = strokeProps.strokeWidth === 0 ? 10 : strokeProps.strokeWidth;
                }
                setStrokeProps({
                  ...strokeProps,
                  strokeWidth,
                  strokeDasharray
                });
              }}
              data={[
                { label: <BorderNone />, value: 'none' },
                { label: <BorderStyle2 />, value: 'dashed' },
                { label: <BorderAll />, value: 'all' }
              ]}
            />
          </Menu.Item>
          <Menu.Label>Border Width</Menu.Label>
          <Menu.Item>
            <Slider
              value={strokeProps.strokeWidth}
              onChange={(strokeWidth) => setStrokeProps({ ...strokeProps, strokeWidth })}
            />
          </Menu.Item>
          <Menu.Label>Rounded Corner</Menu.Label>
          <Menu.Item>
            <Slider disabled />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
