import { Children, memo } from "react";
import classNames from "classnames";
import { useSwipe } from "../../app/hooks";
import { DirectionType } from "../../utils/types";

import styles from "./Carousel.module.scss";

interface CarouselProps {
  children: React.ReactNode;
  slideIndex?: number;
  threshold?: number;
  noBorderLimit?: boolean;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  preventOnScroll?: React.RefObject<HTMLDivElement>;
  maxContent?: boolean;
  stopPropagation?: boolean;
  animationDuration?: number;
  onDirectionChange?: (direction: DirectionType | undefined) => void;
  onThresholdDirectionChange?: (
    thresholdDirection: DirectionType | undefined
  ) => void;
  onSwipe?: (newIndex: number) => void;
}

const Carousel = memo(
  ({
    children,
    slideIndex,
    threshold,
    noBorderLimit,
    disableLeftSwipe,
    disableRightSwipe,
    preventOnScroll,
    maxContent,
    stopPropagation,
    animationDuration = 200,
    onDirectionChange,
    onThresholdDirectionChange,
    onSwipe,
  }: CarouselProps) => {
    const { ref, isCatched, translateX, mouseDown, touchStart } = useSwipe(
      slideIndex,
      Children.count(children),
      threshold,
      noBorderLimit,
      disableLeftSwipe,
      disableRightSwipe,
      preventOnScroll,
      onDirectionChange,
      onThresholdDirectionChange,
      onSwipe
    );

    return (
      <div
        className={classNames(styles.carousel, {
          [styles.fullSize]: !maxContent,
        })}
      >
        <div
          ref={ref}
          className={classNames(styles.slider, {
            [styles.fullSize]: !maxContent,
          })}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isCatched ? "none" : `all ${animationDuration}ms`,
          }}
          onClickCapture={(e) => {
            if (stopPropagation && translateX) {
              e.stopPropagation();
            }
          }}
          onMouseDown={mouseDown}
          onTouchStart={touchStart}
        >
          {Children.map(children, (child) => (
            <div className={styles.slide}>{child}</div>
          ))}
        </div>
      </div>
    );
  }
);

export default Carousel;
