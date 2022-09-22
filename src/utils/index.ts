export * from "./use-shiftkey";
export { default as useEventListener } from "./use-event";
export * from "./use-click-outside"

export const getImageDimensions = (src: string) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
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