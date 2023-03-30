import React from 'react';
import { Image } from '@mantine/core';
import logo from '@/assets/prodsnap_logo.png';

export function Logo() {
  return <Image src={logo} alt="Prodsnap Logo" width={120} />;
}
