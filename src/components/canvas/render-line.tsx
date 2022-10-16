import { SetStateAction } from "jotai";
import { MoveableElement, SVGLineType } from "./store";

type SVGLineElement = MoveableElement & SVGLineType;

type Props = {
  element: SVGLineElement;
  setElement: (update: SetStateAction<SVGLineElement>) => void;
  isSelected: boolean;
};
export function RenderLine({ element }: Props) {

  return (
    <>
      <svg opacity={element.opacity} {...element.props}>
        <g>
        <line {...element.line} fill="none" />
        </g>
      </svg>
    </>
  );
}
