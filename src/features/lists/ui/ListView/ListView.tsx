import { useState, useRef, useCallback } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { deleteListItem, updateListItemStatus } from "../../model/listSlice";
import { List, ListItem } from "../../model/listTypes";
import Dialog from "../../../../elements/Dialog/Dialog";
import TextButton from "../../../../elements/Buttons/TextButton/TextButton";
import ListViewTitle from "./ListViewTitle/ListViewTitle";
import DefaultListView from "./DefaultListView/DefaultListView";
import CycledListView from "./CycledListView/CycledListView";
import NoData from "../../../../elements/NoData/NoData";

import styles from "./ListView.module.scss";

interface ListViewProps {
  list: List;
}

const ListView = ({ list }: ListViewProps) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemToDelete, setItemToDelete] = useState<ListItem>();

  const toggleListItemStatus = useCallback((item: ListItem) => {
    dispatch(
      updateListItemStatus({
        id: item.id,
        done: !item.done,
      })
    );
  }, []);

  const handleDeleteListItem = useCallback(
    (item?: ListItem) => {
      const listItemId = item?.id || itemToDelete?.id;

      if (!listItemId) {
        return;
      }

      dispatch(
        deleteListItem({
          listId: list.id,
          listItemId,
        })
      );

      setItemToDelete(undefined);
    },
    [itemToDelete]
  );

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

      <ListViewTitle listId={list.id} listTitle={list.title} />

      {list.items.length === 0 ? (
        <NoData text="It's empty" />
      ) : (
        <div ref={containerRef} className={styles.container}>
          {list.type === "default" ? (
            <DefaultListView
              listId={list.id}
              containerRef={containerRef}
              handleDeleteListItem={handleDeleteListItem}
            />
          ) : (
            <CycledListView
              listId={list.id}
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
