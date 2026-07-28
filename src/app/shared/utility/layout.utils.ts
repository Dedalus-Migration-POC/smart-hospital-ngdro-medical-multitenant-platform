import { AreaSize } from '../layout-system/models/layout.model';
import {
  Align,
  Direction,
  FlexLayoutConfig,
  Grow,
  Justify,
  Shrink,
  Wrap,
} from '../models/shared_model';

// All classes for flex layout.
// Only flex-basis is in style bacause here set percentage
export function getFlexLayoutClasses(layout?: FlexLayoutConfig): string[] {
  return [
    'd-flex',
    getDirection(layout?.direction),
    // layout?.direction ? `flex-${layout.direction}` : '',
    getWrapClass(layout?.wrap),
    getAlignClass(layout?.align),
    getJustifyClass(layout?.justify),
    getGrowClass(layout?.grow),
    getShrinkClass(layout?.shrink),
    layout?.gap ?? '',
  ].filter(Boolean);
}

// Set the dimensions
export function getSizeStyles(size?: AreaSize): Record<string, string | number | null> {
  if (!size) return {};

  return {
    flexBasis: size.basis ?? null,
    width: size.width ?? null,
    minWidth: size.minWidth ?? null,
    maxWidth: size.maxWidth ?? null,
    height: size.height ?? null,
    minHeight: size.minHeight ?? null,
    maxHeight: size.maxHeight ?? null,
  };
}
function getDirection(dir?: Direction | Direction[]) {
  if (dir) {
    if (Array.isArray(dir)) {
      // console.log(dir);
      return dir
        ?.map((direction: Direction) => {
          return `flex-${direction}`;
        })
        ?.join(' ');
    } else {
      return `flex-${dir}`;
    }
  } else {
    return '';
  }
}

// Set vertical alignment
export function getAlignClass(align?: Align): string {
  switch (align) {
    case 'start':
      return 'align-items-start';
    case 'center':
      return 'align-items-center';
    case 'end':
      return 'align-items-end';
    case 'baseline':
      return 'align-items-baseline';
    case 'stretch':
      return 'align-items-stretch';
    case 'self-start':
      return 'align-self-start';
    case 'self-end':
      return 'align-self-end';
    default:
      return '';
  }
}

// Set horizontal alignment
export function getJustifyClass(justify?: Justify): string {
  switch (justify) {
    case 'start':
      return 'justify-content-start';
    case 'center':
      return 'justify-content-center';
    case 'end':
      return 'justify-content-end';
    case 'between':
      return 'justify-content-between';
    case 'around':
      return 'justify-content-around';
    case 'evenly':
      return 'justify-content-evenly';
    default:
      return '';
  }
}

// Set how the elements wrap to the next line
export function getWrapClass(wrap?: Wrap): string {
  switch (wrap) {
    case 'wrap':
      return 'flex-wrap';
    case 'nowrap':
      return 'flex-nowrap';
    case 'reverse':
      return 'flex-wrap-reverse';
    default:
      return '';
  }
}

// Set how items expand within the available space
export function getGrowClass(grow?: Grow): string {
  switch (grow) {
    case 'grow-0':
      return 'flex-grow-0';
    case 'grow-1':
      return 'flex-grow-1';
    default:
      return '';
  }
}

// Set how items are scaled down when there is not enough space.
export function getShrinkClass(shrink?: Shrink): string {
  switch (shrink) {
    case 'shrink-0':
      return 'flex-shrink-0';
    case 'shrink-1':
      return 'flex-shrink-1';
    default:
      return '';
  }
}
