import { Outlet, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useAppSelector, useDatabase, useMobileKeyboard } from "../hooks";
import { selectKeyboardHeight } from "../../features/settings/model/settingsSlice";
import { routes } from "../routes";

import styles from "./App.module.scss";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
        <Outlet />
      </div>

      {!keyboardHeight && (
        <div className={styles.navbar}>
          {routes[0].children
            .filter((route) => route.navbarIcon)
            .map((route) => (
              <div
                key={route.path}
                className={classNames(
                  styles.element,
                  styles[route.path.slice(1)],
                  {
                    [styles.current]: location.pathname === route.path,
                  }
                )}
                onClick={() => navigate(route.path)}
              >
                <img
                  src={route.navbarIcon}
                  alt={route.path}
                  draggable="false"
                />
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default App;
