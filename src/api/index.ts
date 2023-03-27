import { IPath } from '@/components/canvas/types';
import { DEFAULT_THEME } from '@mantine/core';
import { MoveableElement, SVGPathType } from 'components/canvas/store';

const SHAPES: { id: number; data: IPath }[] = [
  {
    id: 0,
    data: {
      type: 'path' as const,
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      attrs: {
        svgElement: {
          width: '100%',
          height: '100%',
          viewBox: '0 0 64 64',
          fill: DEFAULT_THEME.colors.blue[5],
          style: {
            top: 0,
            left: 0,
            position: 'absolute',
            overflow: 'hidden',
            pointerEvents: 'none'
          },
          stroke: DEFAULT_THEME.colors.blue[8],
          strokeWidth: 10,
          strokeDasharray: 'none',
          strokeLinecap: 'butt'
        },
        pathElement: {
          d: 'M0,0L64,0L64,64L0,64L0,0'
        },
        getPath: function (w: number, h: number) {
          return `M0,0L${w / 3.7},0L${w / 3.7},${h / 3.7}L0,${h / 3.7}L0,0`;
        },
        getViewBox: function (w: number, h: number) {
          return `0 0 ${w / 3.7} ${h / 3.7}`;
        },
        clipPathId: '001'
      }
    }
  }
];

export async function getShapes() {
  return Promise.resolve({ data: SHAPES });
}
