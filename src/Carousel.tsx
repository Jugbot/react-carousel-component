import { debounce } from "./debounce";
import React, {
  Children,
  ComponentProps,
  UIEventHandler,
  useEffect,
  useRef,
} from "react";
import { styled, CSS } from "@stitches/react";

const scrollbarBeGone: CSS = {
  "-ms-overflow-style": "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};

const onScrollEnd = (onScroll: UIEventHandler) => debounce(onScroll, 500);

function childIntersectsCenter(parent: Element, child: Element): boolean {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  const center = parentRect.left + parentRect.width / 2;
  return childRect.right > center && childRect.left < center;
}

const CarouselSpacer = styled("div", {
  display: "inline-block",
  flexShrink: 0,
  width: "50%",
});

const CarouselContainer = styled("ol", {
  position: "relative",
  display: "flex",
  flexWrap: "nowrap",
  overflowX: "hidden",
  scrollSnapType: "x mandatory",
  scrollBehavior: "smooth",
  width: "100%",
  margin: 0,
  padding: 0,

  variants: {
    allowScroll: {
      true: {
        overflowX: "auto",
      },
    },
    hideScrollBar: {
      true: scrollbarBeGone,
    },
  },
});

const CarouselItem = styled("li", {
  display: "inline-block",
  flexShrink: 0,
  scrollSnapAlign: "center",
  // hardware acceleration for smooth scroll (black magic)
  transform: "translateZ(0)",

  variants: {
    decorational: {
      true: { scrollSnapAlign: "none" },
    },
  },
});

interface CarouselProps extends ComponentProps<typeof CarouselContainer> {
  /** The index of *focusable* children that the carousel is at. Changes to this prop will cause the carousel to automatically scroll to the target. */
  focusedIndex: number;
  /** Whether the user is able to scroll elements normally i.e. via click-and-drag on mobile or middle mouse drag on desktop. */
  allowScroll?: boolean;
  /** Hides the scrollbar using css. Sometimes you may not want to do this. Having `allowScroll: false` also disables the scroll bar. */
  hideScrollBar?: boolean;
  /** Callback that is called when the index changes. Returns the index relative to *all* children. */
  onIndexChange?: (index: number) => void;
}

/** 
 * ### A modern carousel component using scroll-snap.
 * - Allows you to scroll through a list of items, or navigate via the arrow keys. 
 * - Optionally, the focused element can be controlled via the `focusedIndex` and `onIndexChange` props.
 * - You can mark certain items as `"decorational"` which will prevent them from being focused.
 */
const CarouselComponent = ({
  focusedIndex,
  onIndexChange = () => {},
  allowScroll,
  hideScrollBar,
  children,
  ...rest
}: CarouselProps) => {
  const selectedItemRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLOListElement | null>(null);

  useEffect(() => {
    selectedItemRef.current?.scrollIntoView?.({ inline: "center" });
  }, [focusedIndex]);

  const handleScroll = () => {
    const containerNode = containerRef.current;
    if (containerNode === null) return;
    // Don't consider the "spacer" children
    const itemsToConsider = Array.from(containerNode.children).slice(1, -1);
    const centeredElementIndex = itemsToConsider.findIndex((node) =>
      childIntersectsCenter(containerNode, node)
    );
    onIndexChange(centeredElementIndex);
  };

  return (
    <CarouselContainer
      ref={containerRef}
      onScroll={onScrollEnd(handleScroll)}
      allowScroll={allowScroll}
      hideScrollBar={hideScrollBar}
      {...rest}
    >
      <CarouselSpacer />
      {(() => {
        let adjustedIndex = 0;
        return Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            !child.props.decorational
          ) {
            const index = adjustedIndex;
            adjustedIndex += 1;
            if (index === focusedIndex) {
              return React.cloneElement(child, {
                // @ts-expect-error We add a ref prop wether or not the child expects one
                ref: (ref: HTMLElement) => (selectedItemRef.current = ref),
              });
            }
          }
          return child;
        });
      })()}
      <CarouselSpacer />
    </CarouselContainer>
  );
};

type ComponentType = typeof CarouselComponent;
interface CompositeComponent extends ComponentType {
  Item: typeof CarouselItem;
}

const Carousel = CarouselComponent as CompositeComponent;
Carousel.Item = CarouselItem;

export { Carousel };
