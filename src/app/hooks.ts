import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { DirectionType } from "../utils/types";
import {
  updateKeyboardHeight,
  updateRelativeToKeyboardStyle,
} from "../features/settings/model/settingsSlice";
import { getListStateFromDB } from "../features/lists/model/listSlice";
import { initializeListDB } from "../features/lists/model/listDatabase";

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDatabase = () => {
  const dispatch = useAppDispatch();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      initializeListDB();

      dispatch(getListStateFromDB());

      isFirstRender.current = false;
    }
  }, []);
};

export const useMobileKeyboard = () => {
  const dispatch = useAppDispatch();
  const keyboardHeight = useRef(0);

  const updateRelativeStyle = () => {
    if (keyboardHeight.current && window.visualViewport) {
      dispatch(
        updateRelativeToKeyboardStyle({
          bottom: keyboardHeight.current - window.visualViewport.offsetTop,
        })
      );
    } else {
      dispatch(updateRelativeToKeyboardStyle(undefined));
    }
  };

  const onResize = () => {
    if (window.visualViewport) {
      keyboardHeight.current =
        window.innerHeight - window.visualViewport.height;

      dispatch(updateKeyboardHeight(keyboardHeight.current));
      updateRelativeStyle();
    }
  };

  useEffect(() => {
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", updateRelativeStyle);
    onResize();

    return () => {
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", updateRelativeStyle);
    };
  }, []);
};

export const usePosition = (
  preventOnScroll?: React.RefObject<HTMLDivElement>
) => {
  const [isCatched, setCatched] = useState(false);
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);
  const [y1, setY1] = useState(0);
  const [y2, setY2] = useState(0);

  const mouseMove = (e: MouseEvent) => {
    setX2(e.clientX);
    setY2(e.clientY);
  };

  const touchMove = (e: TouchEvent) => {
    setX2(e.changedTouches[0].clientX);
    setY2(e.changedTouches[0].clientY);
  };

  const release = () => {
    setCatched(false);

    document.removeEventListener("touchmove", touchMove);
    document.removeEventListener("touchend", release);
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", release);
    preventOnScroll?.current?.removeEventListener("scroll", release);
  };

  const mouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCatched(true);

    setX1(e.clientX);
    setY1(e.clientY);
    setX2(e.clientX);
    setY2(e.clientY);

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", release);
    preventOnScroll?.current?.addEventListener("scroll", release);
  };

  const touchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setCatched(true);

    setX1(e.targetTouches[0].clientX);
    setY1(e.targetTouches[0].clientY);
    setX2(e.targetTouches[0].clientX);
    setY2(e.targetTouches[0].clientY);

    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", release);
    preventOnScroll?.current?.addEventListener("scroll", release);
  };

  return {
    isCatched,
    x1,
    x2,
    y1,
    y2,
    mouseDown,
    touchStart,
  };
};

export const useSwipe = (
  slideIndex = 0,
  amountOfSlides = 1,
  threshold = 100,
  noBorderLimit = false,
  disableLeftSwipe = false,
  disableRightSwipe = false,
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
  const direction = useRef<DirectionType>();
  const thresholdDirection = useRef<DirectionType>();
  const { isCatched, x1, x2, mouseDown, touchStart } =
    usePosition(preventOnScroll);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    if (ref.current) {
      sliderWidth.current = ref.current.clientWidth;
      maxOuterWidth.current = sliderWidth.current * (amountOfSlides - 1);
    }
  }, [ref, amountOfSlides]);

  useEffect(() => {
    currentSlideIndex.current = slideIndex;
    setTranslateX(-currentSlideIndex.current * sliderWidth.current);
  }, [slideIndex]);

  const calculateDirection = (
    deltaX: number,
    directionForComparison: DirectionType | undefined,
    threshold: number,
    callback: (newDirection: DirectionType | undefined) => void
  ) => {
    if (deltaX > threshold) {
      if (directionForComparison !== "right") {
        callback("right");
      }
    } else if (deltaX < -threshold) {
      if (directionForComparison !== "left") {
        callback("left");
      }
    } else {
      if (directionForComparison !== undefined) {
        callback(undefined);
      }
    }
  };

  const calculateTranslateX = (deltaX: number) => {
    const newTranslateX =
      deltaX - currentSlideIndex.current * sliderWidth.current;

    if (
      (disableLeftSwipe && newTranslateX < 0) ||
      (disableRightSwipe && newTranslateX > 0)
    ) {
      setTranslateX(0);
    } else if (noBorderLimit) {
      setTranslateX(newTranslateX);
    } else if (newTranslateX > 0) {
      setTranslateX(0);
    } else if (newTranslateX < -maxOuterWidth.current) {
      setTranslateX(-maxOuterWidth.current);
    } else {
      setTranslateX(newTranslateX);
    }
  };

  const swipe = (direction: DirectionType) => {
    let newIndex: number | undefined;

    switch (direction) {
      case "left":
        if (disableLeftSwipe) {
          return;
        }

        if (currentSlideIndex.current < amountOfSlides - 1) {
          newIndex = currentSlideIndex.current += 1;
        } else if (noBorderLimit) {
          newIndex = amountOfSlides;
        }

        break;
      case "right":
        if (disableRightSwipe) {
          return;
        }

        if (currentSlideIndex.current > 0) {
          newIndex = currentSlideIndex.current -= 1;
        } else if (noBorderLimit) {
          newIndex = -1;
        }

        break;
      default:
        break;
    }

    if (newIndex !== undefined && onSwipe) {
      onSwipe(newIndex);
    }
  };

  useEffect(() => {
    const deltaX = x2 - x1;

    calculateDirection(deltaX, direction.current, 0, (newDirection) => {
      direction.current = newDirection;
      onDirectionChange && onDirectionChange(direction.current);
    });

    calculateDirection(
      deltaX,
      thresholdDirection.current,
      threshold,
      (newDirection) => {
        thresholdDirection.current = newDirection;
        onThresholdDirectionChange &&
          onThresholdDirectionChange(thresholdDirection.current);
      }
    );

    if (isCatched) {
      calculateTranslateX(deltaX);
    } else {
      if (thresholdDirection.current) {
        swipe(thresholdDirection.current);
      }

      setTranslateX(-currentSlideIndex.current * sliderWidth.current);
    }
  }, [x1, x2, isCatched, disableLeftSwipe, disableRightSwipe]);

  return {
    ref,
    isCatched,
    translateX,
    mouseDown,
    touchStart,
  };
};
