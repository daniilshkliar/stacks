import { useRef } from "react";
import { useClickAway } from "react-use";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  changeEditableItem,
  selectEditableItemId,
  selectListItemsByListId,
  selectOpenList,
} from "../../model/listSlice";
import ListViewTitle from "./ListViewTitle/ListViewTitle";
import ListViewItem from "./ListViewItem/ListViewItem";

import styles from "./ListView.module.scss";

const ListView = () => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const openList = useAppSelector(selectOpenList);
  const listItems = useAppSelector((state) =>
    selectListItemsByListId(state, openList?.id)
  );
  const editableItemId = useAppSelector(selectEditableItemId);

  useClickAway(containerRef, () => {
    dispatch(changeEditableItem(undefined));
  });

  if (openList === undefined) {
    return <></>;
  }

  return (
    <>
      <ListViewTitle listId={openList.id} listTitle={openList.title} />

      <div ref={containerRef} className={styles.container}>
        {listItems.map((item) => (
          <ListViewItem
            key={item.id}
            item={item}
            listId={openList.id}
            isEditableItem={editableItemId === item.id}
            containerRef={containerRef}
          />
        ))}
      </div>
    </>
  );
};

export default ListView;
