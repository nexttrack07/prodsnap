import React from 'react';
import { ImageType } from '../store';

type Props = {
  width: number;
  height: number;
  mask: ImageType['mask'];
  uid: string;
};

const MaskMap: Record<ImageType['mask']['id'], React.FC<any>> = {
  none: () => null,
  circle: RenderCircleMask
};

export const RenderMask = ({ width, height, mask, uid }: Props) => {
  return MaskMap[mask.id]({ width, height, mask, uid });
};

function RenderCircleMask({
  width,
  mask,
  uid
}: {
  width: number;
  mask: ImageType['mask'];
  uid: string;
}) {
  return (
    <circle
      cx={width / 2}
      cy={width / 2}
      r={width / 2}
      fill="none"
      stroke={mask.stroke}
      strokeWidth={mask.strokeWidth}
      id={`circle-${uid}`}
    />
  );
}
