import { memo, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import Carousel from "../Carousel/Carousel";
import { DirectionType } from "../../utils/types";

import styles from "./Swiper.module.scss";

interface SwiperProps {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement>;
  animationDuration?: number;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  onLeftSwipeIcon?: string;
  onRightSwipeIcon?: string;
  onLeftSwipeClass?: string;
  onRightSwipeClass?: string;
  onLeftSwipeActiveClass?: string;
  onRightSwipeActiveClass?: string;
  vibrate?: boolean;
  onLeftSwipe?: () => void;
  onRightSwipe?: () => void;
}

const Swiper = memo(
  ({
    children,
    containerRef,
    animationDuration,
    disableLeftSwipe,
    disableRightSwipe,
    onLeftSwipeIcon,
    onRightSwipeIcon,
    onLeftSwipeClass,
    onRightSwipeClass,
    onLeftSwipeActiveClass,
    onRightSwipeActiveClass,
    vibrate,
    onLeftSwipe,
    onRightSwipe,
  }: SwiperProps) => {
    const [direction, setDirection] = useState<DirectionType>();
    const [active, setActive] = useState<DirectionType>();

    useEffect(() => {
      if (vibrate) {
        navigator.vibrate(20);
      }
    }, [active]);

    const onSwipe = useCallback((newIndex: number) => {
      if (newIndex === -1 && onRightSwipe) {
        onRightSwipe();
      } else if (newIndex === 1 && onLeftSwipe) {
        onLeftSwipe();
      }
    }, []);

    return (
      <div className={styles.container}>
        {direction && (
          <div
            className={classNames(styles.background, {
              [styles.onLeftSwipe]: !disableLeftSwipe && direction === "left",
              [styles.onRightSwipe]:
                !disableRightSwipe && direction === "right",
              [styles.onLeftSwipeActive]:
                !disableLeftSwipe && active === "left",
              [styles.onRightSwipeActive]:
                !disableRightSwipe && active === "right",
              [onLeftSwipeClass || ""]:
                !disableLeftSwipe && direction === "left",
              [onRightSwipeClass || ""]:
                !disableRightSwipe && direction === "right",
              [onLeftSwipeActiveClass || ""]:
                !disableLeftSwipe && active === "left",
              [onRightSwipeActiveClass || ""]:
                !disableRightSwipe && active === "right",
            })}
          >
            <div className={styles.icon}>
              {direction === "left"
                ? onLeftSwipeIcon && (
                    <img src={onLeftSwipeIcon} alt="left" draggable="false" />
                  )
                : onRightSwipeIcon && (
                    <img src={onRightSwipeIcon} alt="right" draggable="false" />
                  )}
            </div>
          </div>
        )}

        <Carousel
          preventOnScroll={containerRef}
          disableLeftSwipe={disableLeftSwipe}
          disableRightSwipe={disableRightSwipe}
          animationDuration={animationDuration}
          noBorderLimit
          maxContent
          stopPropagation
          onDirectionChange={setDirection}
          onThresholdDirectionChange={setActive}
          onSwipe={onSwipe}
        >
          {children}
        </Carousel>
      </div>
    );
  }
);

export default Swiper;
