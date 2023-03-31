import React from 'react';
import { useAtomValue } from 'jotai/utils';
import {
  activeElementAtom,
  activeElementAtomAtom,
  canvasAtom,
  isMovingAtom,
  elementAtomsAtom
} from './store';
import { atom } from 'jotai';

export function RenderGuide() {
  const element = useAtomValue(activeElementAtom);

  if (!element) return null;

  return (
    <>
      <RenderElementGuides />
      <RenderCanvasGuides />
    </>
  );
}

const getElementPositionsAtom = atom((get) => {
  const elements = get(elementAtomsAtom);
  const activeElement = get(activeElementAtomAtom);
  const els = elements.filter((e) => e !== activeElement);
  return els.map((elementAtom) => {
    const element = get(elementAtom);
    return {
      x: element.x,
      xM: element.x + element.width / 2,
      xE: element.x + element.width,
      y: element.y,
      yM: element.y + element.height / 2,
      yE: element.y + element.height
    };
  });
});

function RenderElementGuides() {
  const positions = useAtomValue(getElementPositionsAtom);
  const element = useAtomValue(activeElementAtom);
  const isMoving = useAtomValue(isMovingAtom);

  if (!element) return null;

  const x = element.x;
  const xM = element.x + element.width / 2;
  const xE = element.x + element.width;
  const y = element.y;
  const yM = element.y + element.height / 2;
  const yE = element.y + element.height;

  return (
    <>
      {positions.map((position) => (
        <React.Fragment key={position.y}>
          <XGuide show={isMoving && Math.abs(x - position.x) < 5} x={position.x} />
          <XGuide show={isMoving && Math.abs(xM - position.xM) < 5} x={position.xM} />
          <XGuide show={isMoving && Math.abs(xE - position.xE) < 5} x={position.xE} />
          <YGuide show={isMoving && Math.abs(y - position.y) < 5} y={position.y} />
          <YGuide show={isMoving && Math.abs(yM - position.yM) < 5} y={position.yM} />
          <YGuide show={isMoving && Math.abs(yE - position.yE) < 5} y={position.yE} />
        </React.Fragment>
      ))}
    </>
  );
}

function RenderCanvasGuides() {
  const canvasState = useAtomValue(canvasAtom);
  const isMoving = useAtomValue(isMovingAtom);
  const element = useAtomValue(activeElementAtom);

  if (!element) return null;

  const left = canvasState.width / 2;
  const top = canvasState.height / 2;
  const elementMiddle = element.x + element.width / 2;
  const elementCenter = element.y + element.height / 2;

  return (
    <>
      <XGuide show={isMoving && Math.abs(elementMiddle - left) < 5} x={left} />
      <YGuide show={isMoving && Math.abs(elementCenter - top) < 5} y={top} />
    </>
  );
}

type XGuideProps = {
  show: boolean;
  x: number;
};

function XGuide({ show, x }: XGuideProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        height: '100%',
        width: 1,
        backgroundColor: 'red',
        display: show ? 'block' : 'none'
      }}
    ></div>
  );
}

type YGuideProps = {
  show: boolean;
  y: number;
};

function YGuide({ show, y }: YGuideProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        height: 1,
        width: '100%',
        backgroundColor: 'red',
        display: show ? 'block' : 'none'
      }}
    ></div>
  );
}
