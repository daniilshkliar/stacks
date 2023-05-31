import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { selectRelativeToKeyboardStyle } from "../../../../settings/model/settingsSlice";
import {
  changeEditableItem,
  createListItem,
  selectEditableItemId,
  selectOpenList,
  updateListType,
} from "../../../model/listSlice";
import IconButton from "../../../../../elements/Buttons/IconButton/IconButton";

import styles from "./ListViewControls.module.scss";
import PlusIcon from "../../../../../assets/icons/plus-icon.svg";
import CycleIcon from "../../../../../assets/icons/cycle-icon.svg";
import ListIcon from "../../../../../assets/icons/list-icon.svg";
import DoubleDoneIcon from "../../../../../assets/icons/double-done-icon.svg";

const ListViewControls = () => {
  const dispatch = useAppDispatch();
  const openList = useAppSelector(selectOpenList);
  const editableItemId = useAppSelector(selectEditableItemId);
  const relativeToKeyboardStyle = useAppSelector(selectRelativeToKeyboardStyle);

  const finishEditing = useCallback(() => {
    dispatch(changeEditableItem(undefined));
  }, []);

  const changeListType = useCallback(() => {
    if (openList) {
      dispatch(
        updateListType({
          id: openList.id,
          newType: openList.type === "cycled" ? "default" : "cycled",
        })
      );
    }
  }, [openList]);

  const addListItem = useCallback(() => {
    if (openList) {
      dispatch(createListItem(openList.id));
    }
  }, [openList]);

  if (openList === undefined) {
    return <></>;
  }

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
        icon={openList.type === "cycled" ? CycleIcon : ListIcon}
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
};

export default ListViewControls;
