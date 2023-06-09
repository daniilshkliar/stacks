import { memo } from "react";
import classNames from "classnames";
import { useAppDispatch } from "../../../../../app/hooks";
import {
  changeEditableItem,
  updateListItemText,
} from "../../../model/listSlice";
import { ListItem } from "../../../model/listTypes";
import TextInput from "../../../../../elements/Inputs/TextInput/TextInput";
import Swiper from "../../../../../elements/Swiper/Swiper";

import styles from "./ListViewItem.module.scss";

interface ListViewItemProps {
  item: ListItem;
  listId: string;
  isEditableItem: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  onLeftSwipeIcon?: string;
  onRightSwipeIcon?: string;
  onLeftSwipeClass?: string;
  onRightSwipeClass?: string;
  onLeftSwipeActiveClass?: string;
  onRightSwipeActiveClass?: string;
  onLeftSwipe?: (item: ListItem) => void;
  onRightSwipe?: (item: ListItem) => void;
}

const ListViewItem = memo(
  ({
    item,
    listId,
    isEditableItem,
    containerRef,
    disableLeftSwipe,
    disableRightSwipe,
    onLeftSwipeIcon,
    onRightSwipeIcon,
    onLeftSwipeClass,
    onRightSwipeClass,
    onLeftSwipeActiveClass,
    onRightSwipeActiveClass,
    onLeftSwipe,
    onRightSwipe,
  }: ListViewItemProps) => {
    const dispatch = useAppDispatch();

    return isEditableItem ? (
      <div className={styles.inputContainer}>
        <TextInput
          value={item.text}
          className={classNames(styles.input, {
            [styles.done]: item.done,
          })}
          placeholder="Item"
          autoFocus
          setValue={(newValue) => {
            dispatch(updateListItemText({ id: item.id, newText: newValue }));
          }}
          onBlur={() => {
            dispatch(changeEditableItem({ listId, itemId: undefined }));
          }}
        />
      </div>
    ) : (
      <Swiper
        containerRef={containerRef}
        disableLeftSwipe={disableLeftSwipe}
        disableRightSwipe={disableRightSwipe}
        onLeftSwipeIcon={onLeftSwipeIcon}
        onRightSwipeIcon={onRightSwipeIcon}
        onLeftSwipeClass={onLeftSwipeClass}
        onRightSwipeClass={onRightSwipeClass}
        onLeftSwipeActiveClass={onLeftSwipeActiveClass}
        onRightSwipeActiveClass={onRightSwipeActiveClass}
        vibrate
        onLeftSwipe={() => {
          onLeftSwipe && onLeftSwipe(item);
        }}
        onRightSwipe={() => {
          onRightSwipe && onRightSwipe(item);
        }}
      >
        <div
          className={classNames(styles.item, {
            [styles.done]: item.done,
          })}
          onClick={() => {
            dispatch(changeEditableItem({ listId, itemId: item.id }));
          }}
        >
          {item.text}
        </div>
      </Swiper>
    );
  }
);

export default ListViewItem;
