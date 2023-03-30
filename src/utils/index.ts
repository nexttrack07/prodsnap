export * from "./use-shiftkey";
export { default as useEventListener } from "./use-event";
export * from "./use-click-outside"

export const getImageDimensions = (src: string, w: number = Infinity, h: number = Infinity) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: Math.min(image.width, w), height: Math.min(image.height, h) });
    };
    image.onerror = (error) => {
      reject(error);
    };
    image.src = src;
  });
};


export function getRandomInt(min: number = 100, max: number = 500) {
  const n = Math.ceil(min);
  const x = Math.floor(max);
  return Math.floor(Math.random() * (x - n + 1)) + n;
}


export function deserialize(serializedObj: string): any {
  return JSON.parse(serializedObj, (key, value) => {
    if (typeof value === 'string' && value.match(/^function/)) {
      const funcBody = value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'));
      return new Function(`return ${value}`)();
    }
    return value;
  });
}

type Point = {
  x: number;
  y: number;
};

export function calculateAnglesOfRightTriangle(A: Point, B: Point, C: Point): [number, number, number] {
  function distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  const a = distance(B, C);
  const b = distance(A, C);
  const c = distance(A, B);

  const maxSide = Math.max(a, b, c);
  let alpha, beta, gamma;

  if (maxSide === c) {
    alpha = Math.atan2(b, a) * (180 / Math.PI);
    beta = 90 - alpha;
    gamma = 90;
  } else if (maxSide === b) {
    beta = Math.atan2(a, c) * (180 / Math.PI);
    alpha = 90 - beta;
    gamma = 90;
  } else {
    gamma = Math.atan2(b, c) * (180 / Math.PI);
    alpha = 90;
    beta = 90 - gamma;
  }

  return [alpha, beta, gamma];
}


export const SNAP_TOLERANCE = 5;

export function getSnap(num: number, d = 0, max = 1000) {
  if (num > -SNAP_TOLERANCE && num < SNAP_TOLERANCE) {
    return 0;
  } else if (num + d > max - SNAP_TOLERANCE && num + d < max + SNAP_TOLERANCE) {
    return max - d;
  }

  return num;
}
