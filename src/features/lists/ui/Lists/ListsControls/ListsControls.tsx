import { useCallback } from "react";
import { useAppDispatch } from "../../../../../app/hooks";
import { goTo } from "../../../../navigation/model/navigationSlice";
import { createList } from "../../../model/listSlice";
import IconButton from "../../../../../elements/Buttons/IconButton/IconButton";

import styles from "./ListsControls.module.scss";
import PlusIcon from "../../../../../assets/icons/plus-icon.svg";

const ListControls = () => {
  const dispatch = useAppDispatch();

  const addList = useCallback(() => {
    dispatch(createList());
    dispatch(goTo("list"));
  }, []);

  return (
    <div className={styles.controls}>
      <IconButton
        size="l"
        variant="contained"
        icon={PlusIcon}
        onClick={addList}
      />
    </div>
  );
};

export default ListControls;
