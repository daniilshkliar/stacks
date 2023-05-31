import { memo } from "react";
import classNames from "classnames";

import styles from "./TextButton.module.scss";

interface TextButtonProps {
  text: string;
  variant?: "outlined" | "contained" | "default";
  size?: "s" | "m" | "l";
  type?: "error" | "warning" | "success" | "info";
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}

const TextButton = memo(
  ({
    text,
    variant = "outlined",
    size = "m",
    type,
    disabled,
    className,
    onClick,
  }: TextButtonProps) => {
    return (
      <div
        tabIndex={0}
        className={classNames(
          styles.button,
          styles[size],
          styles[variant],
          type && styles[`${variant}_${type}`],
          className,
          {
            [styles[`${variant}_disabled`]]: disabled,
          }
        )}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick();
          }
        }}
      >
        {text}
      </div>
    );
  }
);

export default TextButton;
