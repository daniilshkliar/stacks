import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  deleteListItem,
  selectOpenList,
  updateListItemStatus,
} from "../../model/listSlice";
import { ListItem } from "../../model/listTypes";
import Dialog from "../../../../elements/Dialog/Dialog";
import TextButton from "../../../../elements/Buttons/TextButton/TextButton";
import ListViewTitle from "./ListViewTitle/ListViewTitle";
import DefaultListView from "./DefaultListView/DefaultListView";
import CycledListView from "./CycledListView/CycledListView";
import NoData from "../../../../elements/NoData/NoData";

import styles from "./ListView.module.scss";

const ListView = () => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const openList = useAppSelector(selectOpenList);
  const [itemToDelete, setItemToDelete] = useState<ListItem>();

  const toggleListItemStatus = (item: ListItem) => {
    dispatch(
      updateListItemStatus({
        id: item.id,
        done: !item.done,
      })
    );
  };

  const handleDeleteListItem = (item?: ListItem) => {
    const listItemId = item?.id || itemToDelete?.id;

    if (!openList || !listItemId) {
      return;
    }

    dispatch(
      deleteListItem({
        listId: openList.id,
        listItemId,
      })
    );

    setItemToDelete(undefined);
  };

  if (openList === undefined) {
    return <></>;
  }

  return (
    <>
      <Dialog
        isOpen={!!itemToDelete}
        close={() => {
          setItemToDelete(undefined);
        }}
        actions={
          <TextButton
            variant="default"
            type="error"
            size="s"
            text="Delete"
            onClick={handleDeleteListItem}
          />
        }
      >
        Delete <div className={styles.bold}>{itemToDelete?.text}</div>?
      </Dialog>

      <ListViewTitle listId={openList.id} listTitle={openList.title} />

      {openList.items.length === 0 ? (
        <NoData text="It's empty" />
      ) : (
        <div ref={containerRef} className={styles.container}>
          {openList.type === "default" ? (
            <DefaultListView
              listId={openList.id}
              containerRef={containerRef}
              handleDeleteListItem={handleDeleteListItem}
            />
          ) : (
            <CycledListView
              listId={openList.id}
              containerRef={containerRef}
              toggleListItemStatus={toggleListItemStatus}
              openListItemDeleteDialog={(item) => {
                setItemToDelete(item);
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ListView;
