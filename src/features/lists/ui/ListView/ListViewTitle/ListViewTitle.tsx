import { memo, useState } from "react";
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
  const [isEditable, setEditable] = useState(false);

  const finishEditing = () => {
    if (!listTitle) {
      dispatch(updateListTitle({ id: listId, newTitle: "List" }));
    }

    setEditable(false);
  };

  return isEditable ? (
    <div className={styles.inputContainer}>
      <TextInput
        value={listTitle}
        placeholder="List"
        animationFrom="end"
        autoFocus
        className={styles.input}
        setValue={(newValue) => {
          dispatch(updateListTitle({ id: listId, newTitle: newValue }));
        }}
        onBlur={finishEditing}
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
