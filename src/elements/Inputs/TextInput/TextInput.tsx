import { memo, useEffect, useRef } from "react";
import classNames from "classnames";

import styles from "./TextInput.module.scss";

interface TextInputProps {
  value: string;
  placeholder: string;
  animationFrom?: "end" | "start";
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  setValue: (newValue: string) => void;
  onEnterPress?: () => void;
  onBlur?: () => void;
}

const TextInput = memo(
  ({
    value,
    placeholder,
    animationFrom = "start",
    autoFocus,
    disabled,
    className,
    setValue,
    onEnterPress,
    onBlur,
  }: TextInputProps) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.setSelectionRange(value.length, value.length);
      }
    }, []);

    useEffect(() => {
      if (ref.current) {
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    }, [ref, value]);

    return (
      <div className={styles.inputContainer}>
        <textarea
          ref={ref}
          name="text"
          className={classNames(styles.input, className)}
          value={value}
          placeholder={placeholder}
          rows={1}
          autoFocus={autoFocus}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled && onEnterPress) {
              onEnterPress();
            }
          }}
          onBlur={onBlur}
        />

        <div
          className={classNames(styles.line, {
            [styles.animationFromEnd]: animationFrom === "end",
            [styles.animationFromStart]: animationFrom === "start",
          })}
        />
      </div>
    );
  }
);

export default TextInput;
