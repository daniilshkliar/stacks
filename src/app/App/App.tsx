import classNames from "classnames";
import { useAppSelector, useDatabase, useMobileKeyboard } from "../hooks";
import { selectKeyboardHeight } from "../../features/settings/model/settingsSlice";
import { selectLocation } from "../../features/navigation/model/navigationSlice";
import AccountScreen from "../../screens/AccountScreen";
import ListViewScreen from "../../screens/ListViewScreen";
import HomeScreen from "../../screens/HomeScreen";
import NavBar from "../../features/navigation/ui/NavBar/NavBar";

import styles from "./App.module.scss";

const App = () => {
  const location = useAppSelector(selectLocation);
  const keyboardHeight = useAppSelector(selectKeyboardHeight);

  useDatabase();
  useMobileKeyboard();

  return (
    <>
      <div
        className={classNames(styles.main, {
          [styles.fullHeight]: keyboardHeight,
        })}
      >
        {location === "account" ? (
          <AccountScreen />
        ) : location === "list" ? (
          <ListViewScreen />
        ) : (
          <HomeScreen />
        )}
      </div>

      {!keyboardHeight && <NavBar />}
    </>
  );
};

export default App;
