import { memo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { selectRelativeToKeyboardStyle } from "../../../../settings/model/settingsSlice";
import {
  changeEditableItem,
  createListItem,
  selectEditableItemId,
  updateListType,
} from "../../../model/listSlice";
import { ListType } from "../../../model/listTypes";
import IconButton from "../../../../../elements/Buttons/IconButton/IconButton";

import styles from "./ListViewControls.module.scss";
import PlusIcon from "../../../../../assets/icons/plus-icon.svg";
import CycleIcon from "../../../../../assets/icons/cycle-icon.svg";
import ListIcon from "../../../../../assets/icons/list-icon.svg";
import DoubleDoneIcon from "../../../../../assets/icons/double-done-icon.svg";

interface ListViewControlsProps {
  listId: string;
  listType: ListType;
}

const ListViewControls = memo(({ listId, listType }: ListViewControlsProps) => {
  const dispatch = useAppDispatch();
  const editableItemId = useAppSelector(selectEditableItemId);
  const relativeToKeyboardStyle = useAppSelector(selectRelativeToKeyboardStyle);

  const finishEditing = useCallback(() => {
    dispatch(changeEditableItem({ listId, itemId: undefined }));
  }, []);

  const changeListType = useCallback(() => {
    dispatch(
      updateListType({
        id: listId,
        newType: listType === "cycled" ? "default" : "cycled",
      })
    );
  }, [listType]);

  const addListItem = useCallback(() => {
    dispatch(createListItem(listId));
  }, []);

  return (
    <div className={styles.controls} style={relativeToKeyboardStyle}>
      {editableItemId && (
        <IconButton
          variant="contained"
          size="m"
          icon={DoubleDoneIcon}
          onClick={finishEditing}
        />
      )}

      <IconButton
        size="m"
        icon={listType === "cycled" ? CycleIcon : ListIcon}
        vibrate
        onClick={changeListType}
      />

      <IconButton
        variant="contained"
        size="l"
        icon={PlusIcon}
        onClick={addListItem}
      />
    </div>
  );
});

export default ListViewControls;
