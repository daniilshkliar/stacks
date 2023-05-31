import { memo } from "react";
import classNames from "classnames";

import styles from "./IconButton.module.scss";

interface IconButtonProps {
  icon: string;
  variant?: "outlined" | "contained";
  size?: "s" | "m" | "l";
  disabled?: boolean;
  vibrate?: boolean;
  className?: string;
  onClick: () => void;
}

const IconButton = memo(
  ({
    icon,
    variant = "outlined",
    size = "m",
    disabled,
    vibrate,
    className,
    onClick,
  }: IconButtonProps) => {
    return (
      <div
        tabIndex={0}
        className={classNames(
          styles.button,
          styles[variant],
          styles[size],
          className,
          {
            [styles[`${variant}_disabled`]]: disabled,
          }
        )}
        onClick={() => {
          if (vibrate) {
            navigator.vibrate(25);
          }

          onClick();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick();
          }
        }}
      >
        <img src={icon} alt="icon" draggable="false" />
      </div>
    );
  }
);

export default IconButton;
