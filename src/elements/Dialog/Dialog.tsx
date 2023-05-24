import { memo, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import TextButton from "../Buttons/TextButton/TextButton";

import styles from "./Dialog.module.scss";

interface DialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  actions?: React.ReactNode;
  close: () => void;
}

const Dialog = memo(({ children, isOpen, actions, close }: DialogProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, close);

  if (!isOpen) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <div ref={ref} className={styles.dialog}>
        <div className={styles.body}>{children}</div>

        <div className={styles.buttons}>
          <TextButton
            variant="default"
            size="s"
            text="Cancel"
            onClick={close}
          />

          {actions}
        </div>
      </div>
    </div>
  );
});

export default Dialog;
