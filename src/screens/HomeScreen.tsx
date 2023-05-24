import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  goTo,
  selectLocation,
} from "../features/navigation/model/navigationSlice";
import Carousel from "../elements/Carousel/Carousel";
import CalendarScreen from "./CalendarScreen";
import ListScreen from "./ListScreen";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectLocation);

  return (
    <Carousel
      slideIndex={location === "calendar" ? 0 : 1}
      threshold={70}
      onSwipe={(newIndex) => {
        dispatch(goTo(newIndex === 0 ? "calendar" : "lists"));
      }}
    >
      <CalendarScreen />
      <ListScreen />
    </Carousel>
  );
};

export default HomeScreen;
