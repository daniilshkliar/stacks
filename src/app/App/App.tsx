import { useAppSelector } from "../hooks";
import { selectLocation } from "../../features/navigation/model/navigationSlice";
import AccountScreen from "../../screens/AccountScreen";
import ListViewScreen from "../../screens/ListViewScreen";
import HomeScreen from "../../screens/HomeScreen";
import NavBar from "../../features/navigation/ui/NavBar/NavBar";

import styles from "./App.module.scss";

const App = () => {
  const location = useAppSelector(selectLocation);

  return (
    <>
      <div className={styles.main}>
        {location === "account" ? (
          <AccountScreen />
        ) : location === "list" ? (
          <ListViewScreen />
        ) : (
          <HomeScreen />
        )}
      </div>

      <NavBar />
    </>
  );
};

export default App;
