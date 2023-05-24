import { memo, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useAppDispatch } from "../../../../../app/hooks";
import { updateListTitle } from "../../../model/listSlice";
import TextInput from "../../../../../elements/Inputs/TextInput/TextInput";
import ScreenTitle from "../../../../../elements/ScreenTitle/ScreenTitle";

import styles from "./ListViewTitle.module.scss";

interface ListViewTitleProps {
  listId: string;
  listTitle: string;
}

const ListViewTitle = memo(({ listId, listTitle }: ListViewTitleProps) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditable, setEditable] = useState(false);

  useOnClickOutside(containerRef, () => {
    if (!listTitle) {
      dispatch(updateListTitle({ id: listId, newTitle: "List" }));
    }

    setEditable(false);
  });

  return isEditable ? (
    <div ref={containerRef} className={styles.inputContainer}>
      <TextInput
        value={listTitle}
        placeholder="List"
        animationFrom="end"
        autoFocus
        className={styles.input}
        setValue={(newValue) => {
          dispatch(updateListTitle({ id: listId, newTitle: newValue }));
        }}
      />
    </div>
  ) : (
    <ScreenTitle
      title={listTitle}
      onClick={() => {
        setEditable(true);
      }}
    />
  );
});

export default ListViewTitle;
