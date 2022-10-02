const SHAPES = [
  {
    id: 0,
    data: {
      type: "svg" as const,
      width: 250,
      height: 250,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 64 64",
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      elements: [{ tag: "path", props: { d: "M0,0L64,0L64,64L0,64L0,0", fill: "#919191"} }],
    },
  },
];

export async function getShapes() {
  return Promise.resolve({ data: SHAPES });
}
