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
import { BorderAll, BorderNone, BorderRadius, BorderStyle2 } from 'tabler-icons-react';
import { SetStateAction, atom, useAtom } from 'jotai';
import { activeElementAtomAtom, Element, Path } from '@/stores/elements';

const activeElementAtom = atom(
  (get) => {
    const elementAtom = get(activeElementAtomAtom);
    if (elementAtom) {
      return get(elementAtom);
    }
    return null;
  },
  (get, set, element: Element | SetStateAction<Element>) => {
    const elementAtom = get(activeElementAtomAtom);
    if (elementAtom) {
      set(elementAtom, element);
    }
  }
);

const pathPropsAtom = atom(
  (get) => {
    const element = get(activeElementAtom);
    if (element && element.type === 'path') {
      return element.pathProps;
    }
    return null;
  },
  (get, set, pathProps: Path['pathProps']) => {
    const element = get(activeElementAtom);
    if (element && element.type === 'path') {
      set(activeElementAtom, { ...element, pathProps });
    }
  }
);

// const propsAtom = atom(
//   (get) => {
//     const element = get(activeElementAtom);
//     if (element && element.type === 'path') {
//       return element.pathProps;
//     }
//     return null;
//   },
//   (get, set, props: SVGPathType['props']) => {
//     const element = get(activeElementAtom);
//     if (element && element.type === 'svg-path') {
//       set(activeElementAtom, { ...element, props });
//     }
//   }
// );

// const strokePropsAtom = atom(
//   (get) => {
//     const element = get(activeElementAtom);
//     if (element && element.type === 'svg-path') {
//       return element.pathProps;
//     }
//     return null;
//   },
//   (get, set, pathProps: SVGPathType['pathProps']) => {
//     const element = get(activeElementAtom);
//     if (element && element.type === 'svg-path') {
//       set(activeElementAtom, { ...element, pathProps });
//     }
//   }
// );

export function SvgPathToolbar() {
  const [pathProps, setPathProps] = useAtom(pathPropsAtom);

  if (!pathProps) {
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
                borderColor: pathProps.stroke,
                borderWidth: 8,
                borderStyle: 'solid'
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={pathProps.stroke}
            onChange={(val) =>
              setPathProps({
                ...pathProps,
                stroke: val,
                strokeWidth: pathProps.strokeWidth ?? 10
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
                backgroundColor: pathProps.fill
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={pathProps.fill}
            onChange={(val) => setPathProps({ ...pathProps, fill: val })}
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
                    strokeWidth = pathProps.strokeWidth === 0 ? 10 : Number(pathProps.strokeWidth);
                  case 'all':
                    strokeDasharray = '0';
                    strokeWidth = pathProps.strokeWidth === 0 ? 10 : Number(pathProps.strokeWidth);
                }
                setPathProps({
                  ...pathProps,
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
              value={Number(pathProps.strokeWidth)}
              onChange={(strokeWidth) => setPathProps({ ...pathProps, strokeWidth })}
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
