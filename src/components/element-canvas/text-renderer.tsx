import { Element, Text } from '@/stores/elements';
import { Center } from '@mantine/core';

type Props = {
  element: Element & Text;
};

export function TextRenderer({ element }: Props) {
  return (
    <Center
      // ref={ref}
      style={{
        left: element.x,
        top: element.y,
        userSelect: 'none',
        position: 'absolute',
        whiteSpace: 'pre-wrap',
        transform: `rotate(${(element.angle ?? 0) + 90}deg)`,
        transformOrigin: 'center center',
        outline: 'none',
        cursor: 'text',
        ...element.textProps
      }}
      // className={clsx({ [classes.borders]: isSelected })}
    >
      <div
        tabIndex={0}
        // onMouseDown={handleMouseDown}
        // onBlur={handleBlur}
        // contentEditable={editable}
        suppressContentEditableWarning={true}
        // ref={textRef}
      >
        {element.content}
      </div>
    </Center>
  );
}
