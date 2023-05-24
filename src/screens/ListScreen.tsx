import ScreenTitle from "../elements/ScreenTitle/ScreenTitle";
import Lists from "../features/lists/ui/Lists/Lists";
import ListsControls from "../features/lists/ui/Lists/ListsControls/ListsControls";

const ListScreen = () => {
  return (
    <>
      <ScreenTitle title="Lists" />
      <Lists />
      <ListsControls />
    </>
  );
};

export default ListScreen;
