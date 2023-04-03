import React from 'react';
import { SVGCurveType } from '../store';

export function RenderMarker({
  id,
  type,
  size,
  color,
  orient = 'start'
}: {
  id: string;
  type: SVGCurveType['startMarker'];
  size: number;
  color: string;
  orient: 'start' | 'end';
}) {
  if (type === 'none') return null;

  const MarkerMap: Record<SVGCurveType['startMarker'], React.ReactNode> = {
    none: null,
    'outline-arrow': (
      <path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 0 0 L 8 4 L 0 8"
      />
    ),
    'fill-arrow': (
      <path fill={color} strokeLinecap="round" strokeLinejoin="round" d="M 0 0 L 8 4 L 0 8 Z" />
    ),
    'outline-circle': <circle strokeWidth={1} stroke={color} fill="none" cx={4} cy={4} r="3" />,
    'fill-circle': <circle fill={color} cx={4} cy={4} r="3" />
  };

  const viewBoxWidth = 10;
  const viewBoxHeight = 10;
  const markerWidth = 6;
  const markerHeight = 6;

  const scaledMarkerWidth = (markerWidth * size) / viewBoxWidth;
  const scaledMarkerHeight = (markerHeight * size) / viewBoxHeight;

  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="4"
      refY="4"
      markerUnits="userSpaceOnUse"
      markerWidth={scaledMarkerWidth}
      markerHeight={scaledMarkerHeight}
      orient={orient === 'start' ? 'auto-start-reverse' : 'auto'}
    >
      {MarkerMap[type]}
    </marker>
  );
}
