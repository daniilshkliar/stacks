import ScreenTitle from "../elements/ScreenTitle/ScreenTitle";
import Lists from "../features/lists/ui/Lists/Lists";
import ListsControls from "../features/lists/ui/Lists/ListsControls/ListsControls";

interface ListScreenProps {
  listsContainerRef: React.RefObject<HTMLDivElement>;
}

const ListScreen = ({ listsContainerRef }: ListScreenProps) => {
  return (
    <>
      <ScreenTitle title="Lists" />
      <Lists containerRef={listsContainerRef} />
      <ListsControls />
    </>
  );
};

export default ListScreen;
