import { useAppDispatch } from "../../../../../app/hooks";
import { goTo } from "../../../../navigation/model/navigationSlice";
import { createList } from "../../../model/listSlice";
import IconButton from "../../../../../elements/Buttons/IconButton/IconButton";

import styles from "./ListsControls.module.scss";
import PlusIcon from "../../../../../assets/icons/plus-icon.svg";

const ListControls = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.controls}>
      <IconButton
        size="l"
        variant="contained"
        icon={PlusIcon}
        onClick={() => {
          dispatch(createList());
          dispatch(goTo("list"));
        }}
      />
    </div>
  );
};

export default ListControls;
