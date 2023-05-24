import { memo, useState } from "react";
import { useAppDispatch } from "../../../../../app/hooks";
import {
  changeEditableItem,
  deleteListItem,
  updateListItemStatus,
  updateListItemText,
} from "../../../model/listSlice";
import { ListItem, ListItemStatus } from "../../../model/listTypes";
import TextInput from "../../../../../elements/Inputs/TextInput/TextInput";
import TextButton from "../../../../../elements/Buttons/TextButton/TextButton";
import Dialog from "../../../../../elements/Dialog/Dialog";
import Swiper from "../../../../../elements/Swiper/Swiper";

import styles from "./ListViewItem.module.scss";
import DoneIcon from "../../../../../assets/icons/done-icon.svg";
import GarbageIcon from "../../../../../assets/icons/garbage-bin-icon.svg";

interface ListViewItemProps {
  item: ListItem;
  listId: string;
  isEditableItem: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ListViewItem = memo(
  ({ item, listId, isEditableItem, containerRef }: ListViewItemProps) => {
    const dispatch = useAppDispatch();
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
      <>
        <Dialog
          isOpen={isDeleteDialogOpen}
          close={() => {
            setDeleteDialogOpen(false);
          }}
          actions={
            <TextButton
              variant="default"
              type="error"
              size="s"
              text="Delete"
              onClick={() => {
                dispatch(deleteListItem({ listId, listItemId: item.id }));
              }}
            />
          }
        >
          Delete <div className={styles.bold}>{item.text}</div>?
        </Dialog>

        <div className={styles.container}>
          {isEditableItem ? (
            <div className={styles.inputContainer}>
              <TextInput
                value={item.text}
                className={styles.input}
                placeholder="Item"
                autoFocus
                setValue={(newValue) => {
                  dispatch(
                    updateListItemText({ id: item.id, newText: newValue })
                  );
                }}
              />
            </div>
          ) : (
            <Swiper
              containerRef={containerRef}
              leftIcon={DoneIcon}
              rightIcon={GarbageIcon}
              permittedDirections={["left", "right"]}
              onLeft={() => {
                dispatch(
                  updateListItemStatus({
                    id: item.id,
                    newStatus: ListItemStatus.done,
                  })
                );
              }}
              onRight={() => {
                setDeleteDialogOpen(true);
              }}
            >
              <div
                className={styles.item}
                onClick={() => {
                  dispatch(changeEditableItem(item.id));
                }}
              >
                {item.text}
              </div>
            </Swiper>
          )}
        </div>
      </>
    );
  }
);

export default ListViewItem;
