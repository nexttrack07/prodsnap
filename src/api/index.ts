import { DEFAULT_THEME } from "@mantine/core";
import { MoveableElement, SVGPathType } from "components/canvas/store";

const SHAPES: { id: number; data: MoveableElement & SVGPathType}[] = [
  {
    id: 0,
    data: {
      type: "svg-path" as const,
      width: 250,
      height: 250,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 64 64",
        fill: DEFAULT_THEME.colors.blue[5],
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      path: { d: "M0,0L64,0L64,64L0,64L0,0", },
      strokeProps: {
        clipPathId: "001",
        stroke: DEFAULT_THEME.colors.blue[8],
        strokeWidth: 10,
        strokeDasharray: "none",
        strokeLinecap: "butt"
      }
    },
  },
  {
    id: 1,
    data: {
      type: "svg-path" as const,
      width: 250,
      height: 125,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 64 32",
        fill: DEFAULT_THEME.colors.blue[5],
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      path: { d: "M48,0L0,0L0,32L48,32L64,16L48,0", },
      strokeProps: {
        clipPathId: "001",
        stroke: DEFAULT_THEME.colors.blue[8],
        strokeWidth: 0,
        strokeDasharray: "none",
        strokeLinecap: "butt"
      }
    },
  },
  {
    id: 2,
    data: {
      type: "svg-path" as const,
      width: 730,
      height: 112,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 195 30",
        fill: DEFAULT_THEME.colors.blue[5],
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      path: { d: "M 194 0 L 0 0 L 16 30 L 194 29 L 194 0", },
      strokeProps: {
        clipPathId: "001",
        stroke: DEFAULT_THEME.colors.blue[8],
        strokeWidth: 0,
        strokeDasharray: "none",
        strokeLinecap: "butt"
      }
    },
  },
  {
    id: 3,
    data: {
      type: "svg-path" as const,
      width: 250,
      height: 240,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 200 195",
        fill: DEFAULT_THEME.colors.blue[5],
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      path: { d: "M71 0 0 0 0 193 199 192 71 0", },
      strokeProps: {
        clipPathId: "001",
        stroke: DEFAULT_THEME.colors.blue[8],
        strokeWidth: 0,
        strokeDasharray: "none",
        strokeLinecap: "butt"
      }
    },
  },
  {
    id: 4,
    data: {
      type: "svg-path" as const,
      width: 250,
      height: 250,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 64 64",
        fill: DEFAULT_THEME.colors.blue[5],
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      path: { d: "M32,0L42.1823,21.8177L64,32L42.1823,42.1823L32,64L21.8177,42.1823L0,32L21.8177,21.8177L32,0", },
      strokeProps: {
        clipPathId: "001",
        stroke: DEFAULT_THEME.colors.blue[8],
        strokeWidth: 5,
        strokeDasharray: "none",
        strokeLinecap: "butt"
      }
    },
  },
  {
    id: 5,
    data: {
      type: "svg-path" as const,
      width: 250,
      height: 250,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 64 64",
        fill: DEFAULT_THEME.colors.blue[5],
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      path: { d: "M45.25,0L64,18.75L64,45.25L45.25,64L18.75,64L0,45.25L0,18.75L18.75,0L45.25,0", },
      strokeProps: {
        clipPathId: "001",
        stroke: DEFAULT_THEME.colors.blue[8],
        strokeWidth: 4,
        strokeDasharray: "none",
        strokeLinecap: "butt"
      }
    },
  },
  {
    id: 6,
    data: {
      type: "svg-path" as const,
      width: 250,
      height: 250,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 64 64",
        fill: DEFAULT_THEME.colors.blue[5],
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      path: { d: "M32,0L35.1044,2.6258L38.6898,0.699276L41.1774,3.9096L45.0873,2.76655L46.8493,6.42107L50.9127,6.11146L51.8723,10.0505L55.9116,10.5878L56.0267,14.6392L59.8655,16L59.1311,19.9866L62.6014,22.1115L61.0497,25.8591L64,28.6551L61.6987,32L64,35.3449L61.0497,38.1409L62.6014,41.8885L59.1311,44.0134L59.8655,48L56.0267,49.3608L55.9116,53.4122L51.8723,53.9495L50.9127,57.8885L46.8493,57.5789L45.0873,61.2335L41.1774,60.0904L38.6898,63.3007L35.1044,61.3742L32,64L28.8956,61.3742L25.3102,63.3007L22.8226,60.0904L18.9127,61.2335L17.1507,57.5789L13.0873,57.8885L12.1277,53.9495L8.08838,53.4122L7.97326,49.3608L4.13454,48L4.8689,44.0134L1.39855,41.8885L2.9503,38.1409L0,35.3449L2.30131,32L0,28.6551L2.9503,25.8591L1.39855,22.1115L4.8689,19.9866L4.13454,16L7.97326,14.6392L8.08838,10.5878L12.1277,10.0505L13.0873,6.11146L17.1507,6.42107L18.9127,2.76655L22.8226,3.9096L25.3102,0.699276L28.8956,2.6258L32,0", },
      strokeProps: {
        clipPathId: "001",
        stroke: DEFAULT_THEME.colors.blue[8],
        strokeWidth: 0,
        strokeDasharray: "none",
        strokeLinecap: "butt"
      }
    },
  },
  {
    id: 7,
    data: {
      type: "svg-path" as const,
      width: 250,
      height: 250,
      x: 100,
      y: 10,
      props: {
        width: "100%",
        height: "100%",
        viewBox: "0 0 64 64",
        fill: DEFAULT_THEME.colors.blue[6],
        style: {
          top: 0,
          left: 0,
          position: "absolute",
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      path: { d: "M32,0L38.2117,8.81778L48,4.28719L48.9706,15.0294L59.7128,16L55.1822,25.7883L64,32L55.1822,38.2117L59.7128,48L48.9706,48.9706L48,59.7128L38.2117,55.1822L32,64L25.7883,55.1822L16,59.7128L15.0294,48.9706L4.28719,48L8.81778,38.2117L0,32L8.81778,25.7883L4.28719,16L15.0294,15.0294L16,4.28719L25.7883,8.81778L32,0", },
      strokeProps: {
        clipPathId: "001",
        stroke: DEFAULT_THEME.colors.gray[4],
        strokeWidth: 2,
        strokeDasharray: "none",
        strokeLinecap: "butt"
      }
    },
  },
];

export async function getShapes() {
  return Promise.resolve({ data: SHAPES });
}
