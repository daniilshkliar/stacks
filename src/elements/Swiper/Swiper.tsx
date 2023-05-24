import { memo, useState } from "react";
import classNames from "classnames";
import Carousel from "../Carousel/Carousel";
import { DirectionType } from "../../utils/types";

import styles from "./Swiper.module.scss";

interface SwiperProps {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement>;
  animationDuration?: number;
  permittedDirections?: DirectionType[];
  leftIcon?: string;
  rightIcon?: string;
  leftClass?: string;
  rightClass?: string;
  leftActiveClass?: string;
  rightActiveClass?: string;
  onLeft?: () => void;
  onRight?: () => void;
}

const Swiper = memo(
  ({
    children,
    containerRef,
    animationDuration,
    permittedDirections,
    leftIcon,
    rightIcon,
    leftClass,
    rightClass,
    leftActiveClass,
    rightActiveClass,
    onLeft,
    onRight,
  }: SwiperProps) => {
    const [direction, setDirection] = useState<DirectionType>();
    const [active, setActive] = useState<DirectionType>();

    const onSwipe = (newIndex: number) => {
      if (newIndex === -1 && onLeft) {
        onLeft();
      } else if (newIndex === 1 && onRight) {
        onRight();
      }
    };

    return (
      <div className={styles.container}>
        {direction && (
          <div
            className={classNames(styles.background, {
              [styles.left]: direction === "right",
              [styles.right]: direction === "left",
              [styles.leftActive]: active === "right",
              [styles.rightActive]: active === "left",
              [leftClass || ""]: direction === "right",
              [rightClass || ""]: direction === "left",
              [leftActiveClass || ""]: active === "right",
              [rightActiveClass || ""]: active === "left",
            })}
          >
            <div className={styles.icon}>
              {direction === "right"
                ? leftIcon && (
                    <img src={leftIcon} alt="left" draggable="false" />
                  )
                : rightIcon && (
                    <img src={rightIcon} alt="right" draggable="false" />
                  )}
            </div>
          </div>
        )}

        <Carousel
          permittedDirections={permittedDirections}
          preventOnScroll={containerRef}
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
