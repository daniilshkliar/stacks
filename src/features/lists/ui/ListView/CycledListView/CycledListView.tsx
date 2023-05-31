import React from "react";
import { useAppSelector } from "../../../../../app/hooks";
import {
  selectEditableItemId,
  selectListItemsByListId,
} from "../../../model/listSlice";
import { ListItem } from "../../../model/listTypes";
import ListViewItem from "../ListViewItem/ListViewItem";
import Divider from "../../../../../elements/Divider/Divider";

import styles from "./CycledListView.module.scss";
import GarbageIcon from "../../../../../assets/icons/garbage-bin-icon.svg";
import CycleIcon from "../../../../../assets/icons/cycle-icon.svg";
import DoneIcon from "../../../../../assets/icons/done-icon.svg";

interface CycledListViewProps {
  listId: string;
  containerRef: React.RefObject<HTMLDivElement>;
  toggleListItemStatus: (item: ListItem) => void;
  openListItemDeleteDialog: (item: ListItem) => void;
}

const CycledListView = ({
  listId,
  containerRef,
  toggleListItemStatus,
  openListItemDeleteDialog,
}: CycledListViewProps) => {
  const listItems = useAppSelector((state) =>
    selectListItemsByListId(state, listId)
  );
  const editableItemId = useAppSelector(selectEditableItemId);

  return (
    <div>
      <Divider text="Active" />

      {listItems
        .filter((item) => !item.done)
        .map((item) => (
          <ListViewItem
            key={item.id}
            item={item}
            isEditableItem={editableItemId === item.id}
            containerRef={containerRef}
            onRightSwipeIcon={DoneIcon}
            disableLeftSwipe
            onRightSwipe={toggleListItemStatus}
          />
        ))}

      <Divider text="Done" />

      {listItems
        .filter((item) => item.done)
        .map((item) => (
          <ListViewItem
            key={item.id}
            item={item}
            isEditableItem={editableItemId === item.id}
            containerRef={containerRef}
            onLeftSwipeIcon={GarbageIcon}
            onRightSwipeIcon={CycleIcon}
            onRightSwipeClass={styles.repeat}
            onRightSwipeActiveClass={styles.repeatActive}
            onLeftSwipe={openListItemDeleteDialog}
            onRightSwipe={toggleListItemStatus}
          />
        ))}
    </div>
  );
};

export default CycledListView;
