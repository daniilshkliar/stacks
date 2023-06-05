import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../../app/hooks";
import { createList } from "../../../model/listSlice";
import IconButton from "../../../../../elements/Buttons/IconButton/IconButton";

import styles from "./ListsControls.module.scss";
import PlusIcon from "../../../../../assets/icons/plus-icon.svg";

const ListControls = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const addList = useCallback(() => {
    const list = dispatch(createList()).payload;

    navigate(`/list/${list.id}`);
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
