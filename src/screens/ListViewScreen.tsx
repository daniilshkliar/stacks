import { useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectListById } from "../features/lists/model/listSlice";
import ListView from "../features/lists/ui/ListView/ListView";
import ListViewControls from "../features/lists/ui/ListView/ListViewControls/ListViewControls";
import NoData from "../elements/NoData/NoData";

const ListViewScreen = () => {
  const { listId } = useParams();
  const list = useAppSelector((state) => selectListById(state, listId));

  if (!list) {
    return <NoData text="This list doesn't exist" />;
  }

  return (
    <>
      <ListView list={list} />
      <ListViewControls listId={list.id} listType={list.type} />
    </>
  );
};

export default ListViewScreen;
