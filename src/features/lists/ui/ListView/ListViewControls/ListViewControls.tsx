import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
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

  if (openList === undefined) {
    return <></>;
  }

  return (
    <div className={styles.controls}>
      {editableItemId && (
        <IconButton
          variant="contained"
          size="m"
          icon={DoubleDoneIcon}
          onClick={() => {
            dispatch(changeEditableItem(undefined));
          }}
        />
      )}

      <IconButton
        size="m"
        icon={openList.type === "cycled" ? CycleIcon : ListIcon}
        onClick={() => {
          dispatch(
            updateListType({
              id: openList.id,
              newType: openList.type === "cycled" ? "default" : "cycled",
            })
          );
        }}
      />

      <IconButton
        variant="contained"
        size="l"
        icon={PlusIcon}
        onClick={() => {
          dispatch(createListItem(openList.id));
        }}
      />
    </div>
  );
};

export default ListViewControls;
