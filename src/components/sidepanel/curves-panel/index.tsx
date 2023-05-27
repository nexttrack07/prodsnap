import { Text, Space, createStyles, SimpleGrid } from '@mantine/core';
import { atom, useSetAtom } from 'jotai';
import { DATA } from './data';
import { CurveRenderer, getPathFromPoints } from '@/components/canvas/render-curve';
import { SVGCurveType, addElementAtom } from '@/components/canvas/store';

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: 'pointer',
    position: 'relative',
    // borderRadius: 4,
    // border: `1px solid ${theme.colors.gray[3]}`,
    display: 'flex',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      opacity: 0.7,
      transform: 'scale(1.1)',
      transition: 'transform 0.3s'
    }
  }
}));

type PointCurveType = SVGCurveType;

export function CurvesPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: PointCurveType) => {
    console.log('inside handleAddElement');
    addElement({ ...newEl, points: newEl.points.map((p) => atom(p)) });
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Lines
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={2}>
        {DATA.map((item) => {
          const points = item.data.points.map((p) => ({ ...p, x: p.x / 3, y: p.y / 3 }));
          const box = getBoundingBox(points);
          return (
            <div
              className={classes.shape}
              style={{
                width: box.width,
                height: box.height
              }}
              key={item.id}
            >
              <CurveRenderer
                onClick={() => handleAddElement(item.data)}
                element={{ ...item.data, points }}
              />
            </div>
          );
        })}
      </SimpleGrid>
    </>
  );
}

type Point = { x: number; y: number };

function getBoundingBox(points: Point[]): { width: number; height: number } {
  if (points.length === 0) {
    return { width: 0, height: 0 };
  }

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    if (points[i].x < minX) {
      minX = points[i].x;
    }
    if (points[i].x > maxX) {
      maxX = points[i].x;
    }
    if (points[i].y < minY) {
      minY = points[i].y;
    }
    if (points[i].y > maxY) {
      maxY = points[i].y;
    }
  }

  return { width: maxX - minX, height: maxY - minY };
}
