import { MarkerType } from '@/components/canvas/store';
import { uuid } from '@/utils';

const markers: MarkerType[] = [
  'none',
  'fill-arrow',
  'outline-arrow',
  'outline-circle',
  'fill-circle'
];

export const StaightLines = markers.flatMap((startMarker) =>
  markers.map((endMarker) => ({
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: startMarker,
      markerSize: 30,
      endMarker: endMarker,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 10
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 10
        }
      ]
    }
  }))
);

export const DATA = [
  ...StaightLines,
  {
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'none' as MarkerType,
      markerSize: 30,
      endMarker: 'none' as MarkerType,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 10
        },
        {
          type: 'svg-point' as const,
          x: 100,
          y: 50
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 10
        }
      ]
    }
  },
  {
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'none' as MarkerType,
      markerSize: 30,
      endMarker: 'none' as MarkerType,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 100
        },
        {
          type: 'svg-point' as const,
          x: 100,
          y: 0
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 100
        }
      ]
    }
  },
  {
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      isQuadratic: true,
      stroke: 'black',
      startMarker: 'none' as MarkerType,
      markerSize: 30,
      endMarker: 'none' as MarkerType,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 100
        },
        {
          type: 'svg-point' as const,
          x: 100,
          y: 0
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 100
        }
      ]
    }
  },{
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      isQuadratic: true,
      stroke: 'black',
      startMarker: 'fill-arrow' as MarkerType,
      markerSize: 30,
      endMarker: 'fill-circle' as MarkerType,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 50
        },
        {
          type: 'svg-point' as const,
          x: 100,
          y: 100
        },
        {
          type: 'svg-point' as const,
          x: 200,
          y: 0
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 50
        }
      ]
    }
  },
  {
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      isQuadratic: true,
      stroke: 'black',
      startMarker: 'fill-arrow' as MarkerType,
      markerSize: 30,
      endMarker: 'outline-circle' as MarkerType,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 50
        },
        {
          type: 'svg-point' as const,
          x: 100,
          y: 100
        },
        {
          type: 'svg-point' as const,
          x: 200,
          y: 0
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 50
        }
      ]
    }
  },
  {
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      isQuadratic: false,
      stroke: 'black',
      startMarker: 'none' as MarkerType,
      markerSize: 30,
      endMarker: 'none' as MarkerType,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 50
        },
        {
          type: 'svg-point' as const,
          x: 100,
          y: 100
        },
        {
          type: 'svg-point' as const,
          x: 200,
          y: 0
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 50
        }
      ]
    }
  },
  {
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      isQuadratic: true,
      stroke: 'black',
      startMarker: 'none' as MarkerType,
      markerSize: 30,
      endMarker: 'none' as MarkerType,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 50
        },
        {
          type: 'svg-point' as const,
          x: 100,
          y: 100
        },
        {
          type: 'svg-point' as const,
          x: 200,
          y: 0
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 50
        }
      ]
    }
  },
  {
    id: uuid(),
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      isQuadratic: false,
      stroke: 'black',
      startMarker: 'fill-arrow' as MarkerType,
      markerSize: 30,
      endMarker: 'outline-circle' as MarkerType,
      points: [
        {
          type: 'svg-point' as const,
          x: 10,
          y: 50
        },
        {
          type: 'svg-point' as const,
          x: 100,
          y: 100
        },
        {
          type: 'svg-point' as const,
          x: 200,
          y: 0
        },
        {
          type: 'svg-point' as const,
          x: 300,
          y: 50
        }
      ]
    }
  }
];
