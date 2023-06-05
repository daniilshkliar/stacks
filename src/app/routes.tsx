import { Navigate } from "react-router-dom";
import App from "./App/App";
import { RootErrorBoundary } from "../screens/RootErrorBoundary";
import AccountScreen from "../screens/AccountScreen";
import HomeScreen from "../screens/HomeScreen";
import ListViewScreen from "../screens/ListViewScreen";

import AccountIcon from "../assets/icons/account-icon.svg";
import CalendarIcon from "../assets/icons/calendar-icon.svg";
import MenuIcon from "../assets/icons/menu-icon.svg";

export const routes = [
  {
    element: <App />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Navigate to="/lists" replace />,
      },
      {
        path: "/account",
        element: <AccountScreen />,
        navbarIcon: AccountIcon,
      },
      {
        path: "/calendar",
        element: <HomeScreen />,
        navbarIcon: CalendarIcon,
      },
      {
        path: "/lists",
        element: <HomeScreen />,
        navbarIcon: MenuIcon,
      },
      {
        path: "/list/:listId",
        element: <ListViewScreen />,
      },
    ],
  },
];
