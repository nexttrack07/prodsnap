import { ImageType } from '@/components/canvas/store';
import React from 'react';
import { Circle, Pentagon, Star, Rectangle, WashDrycleanOff } from 'tabler-icons-react';

export const BORDERS: { id: ImageType['border']['id']; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'none',
    icon: <WashDrycleanOff />,
    desc: 'No Crop'
  },
  {
    id: 'circle',
    icon: <Circle />,
    desc: 'Circle'
  },
  // {
  //   id: 'pentagon',
  //   icon: <Pentagon />
  // },
  {
    id: 'rectangle',
    icon: <Rectangle />,
    desc: 'Rectangle'
  }
  // {
  //   id: 'star',
  //   icon: <Star />
  // }
];
