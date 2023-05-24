import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { goTo, selectLocation } from "../../model/navigationSlice";

import styles from "./NavBar.module.scss";
import AccountIcon from "../../../../assets/icons/account-icon.svg";
import CalendarIcon from "../../../../assets/icons/calendar-icon.svg";
import MenuIcon from "../../../../assets/icons/menu-icon.svg";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectLocation);

  return (
    <div className={styles.navbar}>
      <div
        className={classNames(styles.element, styles.account, {
          [styles.current]: location === "account",
        })}
        onClick={() => {
          dispatch(goTo("account"));
        }}
      >
        <img src={AccountIcon} alt="account" draggable="false" />
      </div>

      <div
        className={classNames(styles.element, styles.calendar, {
          [styles.current]: location === "calendar",
        })}
        onClick={() => {
          dispatch(goTo("calendar"));
        }}
      >
        <img src={CalendarIcon} alt="calendar" draggable="false" />
      </div>

      <div
        className={classNames(styles.element, styles.lists, {
          [styles.current]: location === "lists",
        })}
        onClick={() => {
          dispatch(goTo("lists"));
        }}
      >
        <img src={MenuIcon} alt="lists" draggable="false" />
      </div>
    </div>
  );
};

export default NavBar;
