import {
  createAsyncThunk,
  createSlice,
  current,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { NormalizedEntity } from "../../../utils/types";
import { List, ListItem, ListType } from "./listTypes";
import {
  createNormalizedObject,
  deleteNormalizedObjects,
} from "../../../utils/methods";
import {
  deleteListFromDB,
  deleteListItemFromDB,
  putListInDB,
  putListItemInDB,
  readListItemsFromDB,
  readListsFromDB,
} from "./listDatabase";

interface ListState {
  lists: NormalizedEntity<List>;
  listItems: NormalizedEntity<ListItem>;
  editableItem?: string;
  isLoading: boolean;
}

const initialState: ListState = {
  lists: {
    byId: {},
    allIds: [],
  },
  listItems: {
    byId: {},
    allIds: [],
  },
  isLoading: false,
};

export const getListStateFromDB = createAsyncThunk(
  "lists/getListStateFromDB",
  async () => {
    const lists = await readListsFromDB();
    const listItems = await readListItemsFromDB();

    return { lists, listItems };
  }
);

export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    createList: {
      reducer: (state, action: PayloadAction<List>) => {
        createNormalizedObject(state.lists, action.payload.id, action.payload);

        putListInDB(action.payload, current(state.lists.allIds));
      },
      prepare: () => {
        const newList: List = {
          id: nanoid(),
          title: "List",
          type: "default",
          items: [],
        };

        return {
          payload: newList,
        };
      },
    },
    updateListTitle: (
      state,
      action: PayloadAction<{ id: string; newTitle: string }>
    ) => {
      const list = state.lists.byId[action.payload.id];

      list.title = action.payload.newTitle;

      putListInDB(current(list));
    },
    updateListType: (
      state,
      action: PayloadAction<{ id: string; newType: ListType }>
    ) => {
      const list = state.lists.byId[action.payload.id];

      list.type = action.payload.newType;

      if (state.editableItem) {
        state.editableItem = undefined;
      }

      putListInDB(current(list));
    },
    deleteList: (state, action: PayloadAction<string>) => {
      const listItemsToDelete = state.lists.byId[action.payload].items;

      deleteNormalizedObjects(state.listItems, listItemsToDelete);
      deleteNormalizedObjects(state.lists, [action.payload]);

      deleteListFromDB(
        action.payload,
        state.lists.allIds,
        current(listItemsToDelete),
        state.listItems.allIds
      );
    },
    createListItem: {
      reducer: (
        state,
        action: PayloadAction<{ listId: string; newListItem: ListItem }>
      ) => {
        const { listId, newListItem } = action.payload;

        createNormalizedObject(state.listItems, newListItem.id, newListItem);

        state.lists.byId[listId].items.push(newListItem.id);
        state.editableItem = newListItem.id;

        putListItemInDB(
          newListItem,
          current(state.listItems.allIds),
          current(state.lists.byId[listId])
        );
      },
      prepare: (listId: string) => {
        const newListItem: ListItem = {
          id: nanoid(),
          text: "",
          done: false,
        };

        return {
          payload: {
            listId,
            newListItem,
          },
        };
      },
    },
    updateListItemText: (
      state,
      action: PayloadAction<{ id: string; newText: string }>
    ) => {
      const listItem = state.listItems.byId[action.payload.id];

      listItem.text = action.payload.newText;

      putListItemInDB(current(listItem));
    },
    updateListItemStatus: (
      state,
      action: PayloadAction<{ id: string; done: boolean }>
    ) => {
      const listItem = state.listItems.byId[action.payload.id];

      listItem.done = action.payload.done;

      putListItemInDB(current(listItem));
    },
    deleteListItem: (
      state,
      action: PayloadAction<{ listId: string; listItemId: string }>
    ) => {
      const { listId, listItemId } = action.payload;
      const list = state.lists.byId[listId];

      deleteNormalizedObjects(state.listItems, [listItemId]);

      list.items = list.items.filter((id) => id !== listItemId);

      if (state.editableItem === listItemId) {
        state.editableItem = undefined;
      }

      deleteListItemFromDB(listItemId, state.listItems.allIds, current(list));
    },
    changeEditableItem: (
      state,
      action: PayloadAction<{ listId: string; itemId: string | undefined }>
    ) => {
      if (
        state.editableItem &&
        !state.listItems.byId[state.editableItem].text.trim()
      ) {
        listSlice.caseReducers.deleteListItem(state, {
          payload: {
            listId: action.payload.listId,
            listItemId: state.editableItem,
          },
          type: action.type,
        });
      }

      state.editableItem = action.payload.itemId;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListStateFromDB.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getListStateFromDB.fulfilled, (state, action) => {
      state.lists = action.payload.lists;
      state.listItems = action.payload.listItems;
      state.isLoading = false;
    });
    builder.addCase(getListStateFromDB.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const selectLists = (state: RootState): List[] => {
  return state.lists.lists.allIds.map((id) => state.lists.lists.byId[id]);
};

export const selectListById = (
  state: RootState,
  id: string | undefined
): List | undefined => {
  if (!id) {
    return undefined;
  }

  return state.lists.lists.byId[id];
};

export const selectListItemsByListId = (
  state: RootState,
  listId: string
): ListItem[] => {
  return state.lists.lists.byId[listId].items.map(
    (id) => state.lists.listItems.byId[id]
  );
};

export const selectEditableItemId = (state: RootState): string | undefined => {
  return state.lists.editableItem;
};

export const {
  createList,
  updateListTitle,
  updateListType,
  deleteList,
  createListItem,
  updateListItemText,
  updateListItemStatus,
  deleteListItem,
  changeEditableItem,
} = listSlice.actions;

export default listSlice.reducer;
