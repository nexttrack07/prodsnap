import { MarkerType, SVGCurveType } from "@/components/canvas/store";
import { uuid } from "@/utils";

export const DATA1: { id: number; prev: string; data: SVGCurveType }[] = [
  {
    id: 0,
    prev: 'M 0 0 L 25 25 L 100 0',
    data: {
      type: 'svg-curve',
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'none',
      markerSize: 30,
      endMarker: 'none',
      points: [
        {
          type: 'svg-point',
          x: 10,
          y: 10
        },
        {
          type: 'svg-point',
          x: 300,
          y: 10
        },
      ]
    }
  },
  {
    id: 1,
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve',
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'fill-arrow',
      markerSize: 30,
      endMarker: 'none',
      points: [
        {
          type: 'svg-point',
          x: 10,
          y: 10
        },
        {
          type: 'svg-point',
          x: 300,
          y: 10
        },
      ]
    }
  },
  {
    id: 2,
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve',
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'outline-arrow',
      markerSize: 30,
      endMarker: 'none',
      points: [
        {
          type: 'svg-point',
          x: 10,
          y: 10
        },
        {
          type: 'svg-point',
          x: 300,
          y: 10
        },
      ]
    }
  },
  {
    id: 1,
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve',
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'fill-circle',
      markerSize: 30,
      endMarker: 'none',
      points: [
        {
          type: 'svg-point',
          x: 10,
          y: 10
        },
        {
          type: 'svg-point',
          x: 300,
          y: 10
        },
      ]
    }
  },
  {
    id: 1,
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve',
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'outline-circle',
      markerSize: 30,
      endMarker: 'none',
      points: [
        {
          type: 'svg-point',
          x: 10,
          y: 10
        },
        {
          type: 'svg-point',
          x: 300,
          y: 10
        },
      ]
    }
  }
];

const markers: MarkerType[] = ['none', 'fill-arrow', 'outline-arrow', 'outline-circle', 'fill-circle'];

export const DATA = markers.flatMap(startMarker => 
    markers.map(endMarker => ({
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
                },
            ]
        }
    })
));
