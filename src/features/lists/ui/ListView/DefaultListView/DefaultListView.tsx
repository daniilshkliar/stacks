import React, { createRef, memo } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
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

const DefaultListView = memo(
  ({ listId, containerRef, handleDeleteListItem }: DefaultListViewProps) => {
    const listItems = useAppSelector((state) =>
      selectListItemsByListId(state, listId)
    );
    const editableItemId = useAppSelector(selectEditableItemId);

    return (
      <div style={{ overflow: "hidden" }}>
        <TransitionGroup component={null}>
          {listItems
            .filter((item) => !item.done)
            .map((item) => {
              const itemRef = createRef<HTMLDivElement>();

              return (
                <CSSTransition
                  key={item.id}
                  nodeRef={itemRef}
                  timeout={300}
                  classNames="list-item-animation"
                >
                  <div ref={itemRef}>
                    <ListViewItem
                      item={item}
                      listId={listId}
                      isEditableItem={editableItemId === item.id}
                      containerRef={containerRef}
                      onRightSwipeIcon={DoneIcon}
                      disableLeftSwipe
                      onRightSwipe={handleDeleteListItem}
                    />
                  </div>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      </div>
    );
  }
);

export default DefaultListView;
