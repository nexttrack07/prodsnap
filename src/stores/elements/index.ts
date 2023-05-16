import { atom } from "jotai";
import { ElementAtom, ElementGroupAtom } from "./type";
import { atomFamily } from "jotai/utils";
import { getElementBoundingBox, sortArrayBasedOnFirst } from "@/utils";

export * from './type';
export const elementGroupAtomsAtom = atom<ElementGroupAtom[]>([]);
export const activeElementAtomAtom = atom<ElementAtom | null>(null);
export const selectedElementGroupAtomsAtom = atom<ElementGroupAtom[]>([]);

export const positionAtom = atomFamily((elementAtoms: ElementAtom[]) => atom(
  (get) => {
    const elements = elementAtoms.map(el => get(el));

    const x = elements.reduce((prev, { x }) => Math.min(prev, x), Infinity);
    const y = elements.reduce((prev, { y }) => Math.min(prev, y), Infinity);

    return { x, y };
  },
  (_, set, update: { x: number; y: number }) => {
    elementAtoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        x: update.x + el.x,
        y: update.y + el.y,
      }));
    });
  }
));

// export const dimensionAtom1 = atomFamily((elementAtoms: ElementAtom[]) => atom(
//   (get) => {
//     const elements = elementAtoms.map(el => get(el));
//     const { x, y } = get(positionAtom(elementAtoms));

//     const width = elements.reduce((prev, { x: elX, width }) => Math.max(prev, elX + width - x), 0);
//     const height = elements.reduce((prev, { y: elY, height }) => Math.max(prev, elY + height - y), 0);

//     return { width, height };
//   },
//   (_, set, update: { width: number; height: number }) => {
//     elementAtoms.forEach((elementAtom) => {
//       set(elementAtom, (el) => ({
//         ...el,
//         height: el.height + update.height,
//         width: el.width + update.width,
//       }));
//     });
//   }
// ));


export const dimensionAtom = atomFamily((elementAtoms: ElementAtom[]) => atom(
  (get) => {
    const elements = elementAtoms.map(el => get(el));
    const { x, y } = get(positionAtom(elementAtoms));

    let maxX = -Infinity, maxY = -Infinity, minX = Infinity, minY = Infinity;

    elements.forEach(({ x: elX, y: elY, width, height, angle }) => {
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      // Points: top-left, top-right, bottom-right, bottom-left
      const points = [
        { x: elX - halfWidth, y: elY - halfHeight },
        { x: elX + halfWidth, y: elY - halfHeight },
        { x: elX + halfWidth, y: elY + halfHeight },
        { x: elX - halfWidth, y: elY + halfHeight },
      ];

      points.forEach(point => {
        // Applying rotation
        const rotatedX = elX + (point.x - elX) * Math.cos(angle) - (point.y - elY) * Math.sin(angle);
        const rotatedY = elY + (point.x - elX) * Math.sin(angle) + (point.y - elY) * Math.cos(angle);

        // Updating the bounding coordinates
        maxX = Math.max(maxX, rotatedX);
        maxY = Math.max(maxY, rotatedY);
        minX = Math.min(minX, rotatedX);
        minY = Math.min(minY, rotatedY);
      });
    });

    const width = maxX - minX;
    const height = maxY - minY;

    return { width, height };
  },
  (_, set, update: { width: number; height: number }) => {
    elementAtoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        height: el.height + update.height,
        width: el.width + update.width,
      }));
    });
  }
));


export const combineElementGroupsAtom = atom(
  null,
  (get, set) => {
    const selectedElementGroupAtoms = get(selectedElementGroupAtomsAtom);
    const elementGroupAtoms = get(elementGroupAtomsAtom);
    const sortedSelectedElementGroupAtoms = sortArrayBasedOnFirst(elementGroupAtoms, selectedElementGroupAtoms);
    const elementGroups = sortedSelectedElementGroupAtoms.map(el => get(el));
    // extract the element atoms from the groups into an arrow
    // however the elements within a group should inherit the group's angle
    const elementAtoms = elementGroups.reduce((prev, { elements, angle }) => {
      // get the element values from the atoms
      const elementValues = elements.map(el => get(el));
      // add the angle to the elements and create new atoms
      const elementAtoms = elementValues.map(el => atom({ ...el, angle: el.angle + angle }));
      return [...prev, ...elementAtoms];
    }, [] as ElementAtom[]);
    const newGroup = {
      type: 'group' as const,
      elements: elementAtoms,
      angle: 0,
    }
    // remove all the selected element groups
    set(elementGroupAtomsAtom, (prev) => prev.filter(x => !selectedElementGroupAtoms.includes(x)));
    // add the new group
    set(elementGroupAtomsAtom, (prev) => [...prev, atom(newGroup)]);
  }
)

export const positionAndDimensionAtomWithRotation = atomFamily((elementAtoms: ElementAtom[]) => atom(
  (get) => {
    const elements = elementAtoms.map(el => get(el));
  
    const minMax = elements.reduce(({ minX, maxX, minY, maxY }, { x, y, width, height, angle }) => {
      const corners = [
        { x: x, y: y },
        { x: x + width, y: y },
        { x: x, y: y + height },
        { x: x + width, y: y + height }
      ];

      angle = angle === 0 ? 0 : angle - 90;
      console.log('angle', angle);
  
      const rotatedCorners = corners.map(({ x, y }) => ({
        x: x * Math.cos(angle) - y * Math.sin(angle),
        y: x * Math.sin(angle) + y * Math.cos(angle)
      }));
  
      return {
        minX: Math.min(minX, ...rotatedCorners.map(({ x }) => x)),
        maxX: Math.max(maxX, ...rotatedCorners.map(({ x }) => x)),
        minY: Math.min(minY, ...rotatedCorners.map(({ y }) => y)),
        maxY: Math.max(maxY, ...rotatedCorners.map(({ y }) => y))
      };
    }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  
    const x = minMax.minX;
    const y = minMax.minY;
    const width = minMax.maxX - minMax.minX;
    const height = minMax.maxY - minMax.minY;
  
    return { x, y, width, height };
  },
  (_, set, update: { x: number; y: number; width: number; height: number }) => {
    elementAtoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        x: update.x + el.x,
        y: update.y + el.y,
        width: el.width + update.width,
        height: el.height + update.height,
      }));
    });
  }
));

export const positionAndDimensionAtom = atomFamily((elementAtoms: ElementAtom[]) => atom(
  (get) => {
    const elements = elementAtoms.map(el => get(el));

    const x = elements.reduce((prev, { x }) => Math.min(prev, x), Infinity);
    const y = elements.reduce((prev, { y }) => Math.min(prev, y), Infinity);
    const width = elements.reduce((prev, { x: elX, width }) => Math.max(prev, elX + width - x), 0);
    const height = elements.reduce((prev, { y: elY, height }) => Math.max(prev, elY + height - y), 0);

    return { x, y, width, height };
  },
  (_, set, update: { x: number; y: number; width: number; height: number }) => {
    elementAtoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        x: update.x + el.x,
        y: update.y + el.y,
        width: el.width + update.width,
        height: el.height + update.height,
      }));
    });
  }
));

export const attrsAtom = atomFamily((elementAtoms: ElementAtom[]) => atom(
  (get) => {
    const attrs = elementAtoms.map(elAtom => {
      const el = get(elAtom);
      
      const { x, y, width, height } = getElementBoundingBox(el);

      return { x, y, width, height };
    })

    const x = attrs.reduce((prev, { x }) => Math.min(prev, x), Infinity);
    const y = attrs.reduce((prev, { y }) => Math.min(prev, y), Infinity);
    const width = attrs.reduce((prev, { x: elX, width }) => Math.max(prev, elX + width - x), 0);
    const height = attrs.reduce((prev, { y: elY, height }) => Math.max(prev, elY + height - y), 0);

    return { x, y, width, height };
  },
  (_, set, update: { x: number; y: number; width: number; height: number }) => {
    elementAtoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        x: update.x + el.x,
        y: update.y + el.y,
        width: el.width + update.width,
        height: el.height + update.height,
      }));
    });
  }
));
