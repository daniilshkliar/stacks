import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Carousel from "../elements/Carousel/Carousel";
import CalendarScreen from "./CalendarScreen";
import ListScreen from "./ListScreen";

const HomeScreen = () => {
  const navigate = useNavigate();
  const listsContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  return (
    <Carousel
      slideIndex={location.pathname === "/calendar" ? 0 : 1}
      threshold={50}
      preventOnScroll={listsContainerRef}
      onSwipe={(newIndex) => navigate(newIndex === 0 ? "/calendar" : "/lists")}
    >
      <CalendarScreen />
      <ListScreen listsContainerRef={listsContainerRef} />
    </Carousel>
  );
};

export default HomeScreen;
