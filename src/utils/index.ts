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