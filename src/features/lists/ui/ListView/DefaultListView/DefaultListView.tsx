import React from "react";
import { useAppSelector } from "../../../../../app/hooks";
import {
  selectEditableItemId,
  selectListItemsByListId,
} from "../../../model/listSlice";
import { ListItem } from "../../../model/listTypes";
import ListViewItem from "../ListViewItem/ListViewItem";

import DoneIcon from "../../../../../assets/icons/done-icon.svg";

interface DefaultListViewProps {
  listId: string;
  containerRef: React.RefObject<HTMLDivElement>;
  handleDeleteListItem: (item: ListItem) => void;
}

const DefaultListView = ({
  listId,
  containerRef,
  handleDeleteListItem,
}: DefaultListViewProps) => {
  const listItems = useAppSelector((state) =>
    selectListItemsByListId(state, listId)
  );
  const editableItemId = useAppSelector(selectEditableItemId);

  return (
    <div>
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
            onRightSwipe={handleDeleteListItem}
          />
        ))}
    </div>
  );
};

export default DefaultListView;
