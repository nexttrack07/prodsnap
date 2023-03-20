import { createStyles } from '@mantine/core';
import React from 'react';
import clsx from 'clsx';
import { Resizable } from '@/components/canvas/store';

type Props = {
  dimension: Resizable;
};

const useStyles = createStyles((theme) => ({
  resize: {
    backgroundColor: theme.colors.blue[0],
    border: `1px solid ${theme.colors.blue[4]}`,
    borderRadius: '50%',
    width: 14,
    height: 14,
    position: 'absolute',
    '&:hover': {
      backgroundColor: theme.colors.blue[6]
    }
  },
  resize_br: {
    bottom: 0,
    right: 0,
    transform: `translate(50%, 50%)`,
    cursor: 'se-resize'
  },
  resize_bl: {
    bottom: 0,
    left: 0,
    transform: `translate(-50%, 50%)`,
    cursor: 'sw-resize'
  },
  resize_tl: {
    top: 0,
    left: 0,
    cursor: 'nw-resize',
    transform: `translate(-50%, -50%)`
  },
  resize_tr: {
    top: 0,
    right: 0,
    cursor: 'ne-resize',
    transform: `translate(50%, -50%)`
  },
  resize_tm: {
    borderRadius: '40%',
    width: 20,
    height: 10,
    top: 0,
    left: '50%',
    cursor: 'n-resize',
    transform: `translate(-50%, -50%)`
  },
  resize_bm: {
    borderRadius: '40%',
    width: 20,
    height: 10,
    bottom: 0,
    left: '50%',
    cursor: 's-resize',
    transform: `translate(-50%, 50%)`
  },
  resize_lm: {
    borderRadius: '40%',
    height: 20,
    width: 10,
    left: 0,
    cursor: 'w-resize',
    top: '50%',
    transform: `translate(-50%, -50%)`
  },
  resize_rm: {
    borderRadius: '40%',
    height: 20,
    width: 10,
    right: 0,
    cursor: 'e-resize',
    top: '50%',
    transform: `translate(50%, -50%)`
  },
  borders: {
    border: `1px solid ${theme.colors.blue[4]}`
  }
}));

export function ResizeHandler({ dimension }: Props) {
  const { width, height } = dimension;
  const { classes } = useStyles();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width,
        height
      }}
      className={classes.borders}
    >
      <span className={clsx(classes.resize, classes.resize_tl)} />
      <span className={clsx(classes.resize, classes.resize_tr)} />
      <span className={clsx(classes.resize, classes.resize_bl)} />
      <span className={clsx(classes.resize, classes.resize_br)} />
      <span className={clsx(classes.resize, classes.resize_tm)} />
      <span className={clsx(classes.resize, classes.resize_bm)} />
      <span className={clsx(classes.resize, classes.resize_lm)} />
      <span className={clsx(classes.resize, classes.resize_rm)} />
    </div>
  );
}
