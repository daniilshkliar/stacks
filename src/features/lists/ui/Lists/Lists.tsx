import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { changeOpenList, deleteList, selectLists } from "../../model/listSlice";
import { goTo } from "../../../navigation/model/navigationSlice";
import Swiper from "../../../../elements/Swiper/Swiper";
import Dialog from "../../../../elements/Dialog/Dialog";
import TextButton from "../../../../elements/Buttons/TextButton/TextButton";

import styles from "./Lists.module.scss";
import GarbageIcon from "../../../../assets/icons/garbage-bin-icon.svg";

const Lists = () => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const lists = useAppSelector(selectLists);
  const [listToDelete, setListToDelete] = useState<string>();
  const [listToDeleteTitle, setListToDeleteTitle] = useState<string>("");

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
            onClick={() => {
              if (listToDelete) {
                dispatch(deleteList(listToDelete));
                setListToDelete(undefined);
              }
            }}
          />
        }
      >
        Delete <div className={styles.bold}>{listToDeleteTitle}</div>?
      </Dialog>

      <div ref={containerRef} className={styles.container}>
        {lists.map((list) => (
          <Swiper
            key={list.id}
            containerRef={containerRef}
            rightIcon={GarbageIcon}
            permittedDirections={["left"]}
            onRight={() => {
              setListToDelete(list.id);
              setListToDeleteTitle(list.title);
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
    </>
  );
};

export default Lists;
