import React, { createRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
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
    <div style={{ overflow: "hidden" }}>
      <Divider text="Active" />

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
                    isEditableItem={editableItemId === item.id}
                    containerRef={containerRef}
                    onRightSwipeIcon={DoneIcon}
                    disableLeftSwipe
                    onRightSwipe={toggleListItemStatus}
                  />
                </div>
              </CSSTransition>
            );
          })}
      </TransitionGroup>

      <Divider text="Done" />

      <TransitionGroup component={null}>
        {listItems
          .filter((item) => item.done)
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
                    isEditableItem={editableItemId === item.id}
                    containerRef={containerRef}
                    onLeftSwipeIcon={GarbageIcon}
                    onRightSwipeIcon={CycleIcon}
                    onRightSwipeClass={styles.repeat}
                    onRightSwipeActiveClass={styles.repeatActive}
                    onLeftSwipe={openListItemDeleteDialog}
                    onRightSwipe={toggleListItemStatus}
                  />
                </div>
              </CSSTransition>
            );
          })}
      </TransitionGroup>
    </div>
  );
};

export default CycledListView;
