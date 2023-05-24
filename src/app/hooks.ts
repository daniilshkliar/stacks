import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { DirectionType } from "../utils/types";

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const usePosition = (
  preventOnScroll?: React.RefObject<HTMLDivElement>
) => {
  const [isCatched, setCatched] = useState(false);
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);
  const [y1, setY1] = useState(0);
  const [y2, setY2] = useState(0);

  const mouseMove = useCallback((e: MouseEvent) => {
    setX2(e.clientX);
    setY2(e.clientY);
  }, []);

  const touchMove = useCallback((e: TouchEvent) => {
    setX2(e.changedTouches[0].clientX);
    setY2(e.changedTouches[0].clientY);
  }, []);

  const release = useCallback(() => {
    setCatched(false);

    document.removeEventListener("touchmove", touchMove);
    document.removeEventListener("touchend", release);
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", release);
    preventOnScroll?.current?.removeEventListener("scroll", release);
  }, [touchMove, mouseMove]);

  const mouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setCatched(true);

      setX1(e.clientX);
      setY1(e.clientY);
      setX2(e.clientX);
      setY2(e.clientY);

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", release);
      preventOnScroll?.current?.addEventListener("scroll", release);
    },
    [mouseMove, release]
  );

  const touchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setCatched(true);

      setX1(e.targetTouches[0].clientX);
      setY1(e.targetTouches[0].clientY);
      setX2(e.targetTouches[0].clientX);
      setY2(e.targetTouches[0].clientY);

      document.addEventListener("touchmove", touchMove);
      document.addEventListener("touchend", release);
      preventOnScroll?.current?.addEventListener("scroll", release);
    },
    [touchMove, release]
  );

  return {
    isCatched,
    x1,
    x2,
    y1,
    y2,
    mouseDown,
    touchStart,
    release,
  };
};

export const useSwipe = (
  slideIndex = 0,
  amountOfSlides = 1,
  threshold = 100,
  noBorderLimit = false,
  permittedDirections?: DirectionType[],
  preventOnScroll?: React.RefObject<HTMLDivElement>,
  onDirectionChange?: (direction: DirectionType | undefined) => void,
  onThresholdDirectionChange?: (
    thresholdDirection: DirectionType | undefined
  ) => void,
  onSwipe?: (newIndex: number) => void
) => {
  const ref = useRef<HTMLDivElement>(null);
  const sliderWidth = useRef(0);
  const maxOuterWidth = useRef(0);
  const currentSlideIndex = useRef(slideIndex);
  const isSwiped = useRef(false);
  const { isCatched, x1, x2, mouseDown, touchStart } =
    usePosition(preventOnScroll);
  const [direction, setDirection] = useState<DirectionType>();
  const [thresholdDirection, setThresholdDirection] = useState<DirectionType>();
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    if (ref.current) {
      sliderWidth.current = ref.current.clientWidth;
      maxOuterWidth.current = sliderWidth.current * (amountOfSlides - 1);
    }
  }, [ref]);

  useEffect(() => {
    currentSlideIndex.current = slideIndex;
    setTranslateX(-currentSlideIndex.current * sliderWidth.current);
  }, [slideIndex]);

  const changeDirection = useCallback(
    (
      deltaX: number,
      threshold: number,
      direction: DirectionType | undefined,
      callback: (direction: DirectionType | undefined) => void
    ) => {
      if (deltaX > threshold) {
        if (direction !== "right") {
          callback("right");
        }
      } else if (deltaX < -threshold) {
        if (direction !== "left") {
          callback("left");
        }
      } else {
        if (direction !== undefined) {
          callback(undefined);
        }
      }
    },
    []
  );

  const swipe = useCallback((direction: DirectionType) => {
    isSwiped.current = true;

    switch (direction) {
      case "left":
        if (currentSlideIndex.current < amountOfSlides - 1) {
          currentSlideIndex.current += 1;
          onSwipe && onSwipe(currentSlideIndex.current);
        } else if (noBorderLimit) {
          onSwipe && onSwipe(amountOfSlides);
        }
        break;
      case "right":
        if (currentSlideIndex.current > 0) {
          currentSlideIndex.current -= 1;
          onSwipe && onSwipe(currentSlideIndex.current);
        } else if (noBorderLimit) {
          onSwipe && onSwipe(-1);
        }
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    const deltaX = x2 - x1;

    if (isCatched) {
      isSwiped.current = false;

      const newTranslateX =
        deltaX - currentSlideIndex.current * sliderWidth.current;

      if (noBorderLimit) {
        if (
          (!permittedDirections?.includes("left") && newTranslateX < 0) ||
          (!permittedDirections?.includes("right") && newTranslateX > 0)
        ) {
          setTranslateX(0);
        } else {
          setTranslateX(newTranslateX);
        }
      } else if (newTranslateX > 0) {
        setTranslateX(0);
      } else if (newTranslateX < -maxOuterWidth.current) {
        setTranslateX(-maxOuterWidth.current);
      } else {
        setTranslateX(newTranslateX);
      }
    } else {
      if (!isSwiped.current && thresholdDirection) {
        swipe(thresholdDirection);
      }

      setTranslateX(-currentSlideIndex.current * sliderWidth.current);
    }

    changeDirection(deltaX, 0, direction, (direction) => {
      setDirection(direction);
      onDirectionChange && onDirectionChange(direction);
    });

    changeDirection(deltaX, threshold, thresholdDirection, (direction) => {
      setThresholdDirection(direction);
      onThresholdDirectionChange && onThresholdDirectionChange(direction);
    });
  }, [x1, x2, direction, thresholdDirection, isCatched]);

  return {
    ref,
    isCatched,
    x1,
    x2,
    translateX,
    mouseDown,
    touchStart,
  };
};
