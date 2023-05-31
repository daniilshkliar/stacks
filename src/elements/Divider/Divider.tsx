import { memo } from "react";
import classNames from "classnames";

import styles from "./Divider.module.scss";

interface DividerProps {
  text?: string;
  variant?: "primary" | "secondary" | "default";
}

const Divider = memo(({ text, variant = "default" }: DividerProps) => {
  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.line, {
          [styles.primaryLine]: variant === "primary",
          [styles.secondaryLine]: variant === "secondary",
        })}
      />

      <div
        className={classNames(styles.text, {
          [styles.primaryText]: variant === "primary",
          [styles.secondaryText]: variant === "secondary",
        })}
      >
        {text}
      </div>

      <div
        className={classNames(styles.line, {
          [styles.primaryLine]: variant === "primary",
          [styles.secondaryLine]: variant === "secondary",
        })}
      />
    </div>
  );
});

export default Divider;
