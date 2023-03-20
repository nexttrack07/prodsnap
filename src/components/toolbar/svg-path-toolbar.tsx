import React, { SVGAttributes } from 'react';
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
  MoveableElement,
  SVGPathType,
  SVGStrokeProps,
  selectedElementAtomsAtom,
  CanvasElement
} from '@/components/canvas/store';
import { atom, useAtom } from 'jotai';
import { BorderAll, BorderNone, BorderRadius, BorderStyle2 } from 'tabler-icons-react';

type Props = {
  element: MoveableElement & SVGPathType;
  setElement: (element: MoveableElement & SVGPathType) => void;
};

export function SvgPathToolbar({ element, setElement }: Props) {
  return (
    <Group>
      <Popover>
        <Popover.Target>
          <ActionIcon variant="default" size={36}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderColor: element.strokeProps.stroke,
                borderWidth: 8,
                borderStyle: 'solid'
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={element.strokeProps.stroke}
            onChange={(val) =>
              // setStrokeProps({
              //   stroke: val,
              //   strokeWidth: strokeProps.strokeWidth ?? 10
              // })
              setElement({
                ...element,
                strokeProps: {
                  ...element.strokeProps,
                  stroke: val,
                  strokeWidth: element.strokeProps.strokeWidth ?? 10
                }
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
                backgroundColor: element.props.fill
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={element.props.fill}
            onChange={(val) => setElement({ ...element, props: { ...element.props, fill: val } })}
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
                    strokeWidth =
                      element.strokeProps.strokeWidth === 0 ? 10 : element.strokeProps.strokeWidth;
                  case 'all':
                    strokeDasharray = '0';
                    strokeWidth =
                      element.strokeProps.strokeWidth === 0 ? 10 : element.strokeProps.strokeWidth;
                }
                setElement({
                  ...element,
                  strokeProps: { ...element.strokeProps, strokeWidth, strokeDasharray }
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
              value={element.strokeProps.strokeWidth}
              onChange={(strokeWidth) =>
                setElement({ ...element, strokeProps: { ...element.strokeProps, strokeWidth } })
              }
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
