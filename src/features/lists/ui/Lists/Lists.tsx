import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { changeOpenList, deleteList, selectLists } from "../../model/listSlice";
import { List } from "../../model/listTypes";
import { goTo } from "../../../navigation/model/navigationSlice";
import Swiper from "../../../../elements/Swiper/Swiper";
import Dialog from "../../../../elements/Dialog/Dialog";
import TextButton from "../../../../elements/Buttons/TextButton/TextButton";
import NoData from "../../../../elements/NoData/NoData";

import styles from "./Lists.module.scss";
import GarbageIcon from "../../../../assets/icons/garbage-bin-icon.svg";

interface ListsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const Lists = ({ containerRef }: ListsProps) => {
  const dispatch = useAppDispatch();
  const lists = useAppSelector(selectLists);
  const [listToDelete, setListToDelete] = useState<List>();

  const handleDeleteList = () => {
    if (!listToDelete) {
      return;
    }

    dispatch(deleteList(listToDelete.id));
    setListToDelete(undefined);
  };

  return (
    <>
      <Dialog
        isOpen={!!listToDelete}
        close={() => {
          setListToDelete(undefined);
        }}
        actions={
          <TextButton
            variant="default"
            type="error"
            size="s"
            text="Delete"
            onClick={handleDeleteList}
          />
        }
      >
        Delete <div className={styles.bold}>{listToDelete?.title}</div>?
      </Dialog>

      {lists.length === 0 ? (
        <NoData text="No lists" />
      ) : (
        <div ref={containerRef} className={styles.container}>
          {lists.map((list) => (
            <Swiper
              key={list.id}
              containerRef={containerRef}
              onLeftSwipeIcon={GarbageIcon}
              disableRightSwipe
              vibrate
              onLeftSwipe={() => {
                setListToDelete(list);
              }}
            >
              <div
                className={styles.item}
                onClick={() => {
                  dispatch(changeOpenList(list.id));
                  dispatch(goTo("list"));
                }}
              >
                {list.title}
              </div>
            </Swiper>
          ))}
        </div>
      )}
    </>
  );
};

export default Lists;
