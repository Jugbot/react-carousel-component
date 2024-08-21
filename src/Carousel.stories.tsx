import { Meta, StoryObj } from "@storybook/react";
import { Children, ComponentProps } from "react";

import { Carousel } from "./Carousel";
import { styled } from "@stitches/react";


const StyledCarousel = styled(Carousel, {
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

const StyledCarouselItem = styled(Carousel.Item, {
  width: "100px",
  height: "100px",
  padding: "25px",
  borderRadius: "4px",

  variants: {
    decorational: {
      true: {
        background: "none",
        width: "auto",
        height: "auto",
        padding: "8px 4px",
        border: "1px dashed black",
        writingMode: "vertical-rl",
        "&::before": {
          fontFamily: "monospace",
          content: '"decoration"',
        },
      },
      false: {},
    },
    theme: {
      undefined: {
        backgroundImage: "linear-gradient(45deg, #ccc, #fff)",
      },
      blue: {
        backgroundImage: "linear-gradient(45deg, #00f, #0ff)",
      },
      red: {
        backgroundImage: "linear-gradient(45deg, #f00, #f0f)",
      },
      green: {
        backgroundImage: "linear-gradient(45deg, #0f0, #ff0)",
      },
    },
  },

  compoundVariants: [
    {
      decorational: true,
      theme: "undefined",
      css: {
        background: "none",
      },
    },
  ],
});

interface CarouselStoryProps extends ComponentProps<typeof Carousel> {
  children: string[];
}

const StyledStory = ({ children, ...args }: CarouselStoryProps) => {
  const getTheme = (child: string) =>
    child === "blue" || child === "red" || child === "green"
      ? child
      : undefined;
  return (
    <StyledCarousel {...args}>
      {Children.map(children, (child) => (
        <StyledCarouselItem
          decorational={child === "decoration"}
          theme={getTheme(child)}
        />
      ))}
    </StyledCarousel>
  );
};

type Story = StoryObj<typeof StyledStory>;

const meta: Meta<typeof StyledStory> = {
  title: "Carousel",
  tags: ["autodocs"],
  component: Carousel,
  render: StyledStory,
};

export default meta;

export const CarouselStory: Story = {
  name: "Carousel",
  args: {
    focusedIndex: 0,
    allowScroll: true,
    hideScrollBar: true,
    children: ["blue", "red", "decoration", "green"],
  },
  argTypes: {
    onIndexChange: { action: "scrolled to" },
  }
};
