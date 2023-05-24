import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { NormalizedEntity } from "../../../utils/types";
import { List, ListItem, ListItemStatus, ListType } from "./listTypes";
import {
  createNormalizedObject,
  deleteNormalizedObjects,
} from "../../../utils/methods";

interface ListState {
  lists: NormalizedEntity<List>;
  listItems: NormalizedEntity<ListItem>;
  openList?: string;
  editableItem?: string;
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
};

export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    createList: {
      reducer: (state, action: PayloadAction<List>) => {
        createNormalizedObject(state.lists, action.payload.id, action.payload);

        state.openList = action.payload.id;
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
      state.lists.byId[action.payload.id].title = action.payload.newTitle;
    },
    updateListType: (
      state,
      action: PayloadAction<{ id: string; newType: ListType }>
    ) => {
      state.lists.byId[action.payload.id].type = action.payload.newType;
    },
    deleteList: (state, action: PayloadAction<string>) => {
      deleteNormalizedObjects(
        state.listItems,
        state.lists.byId[action.payload].items
      );

      deleteNormalizedObjects(state.lists, [action.payload]);

      if (state.openList === action.payload) {
        state.openList = undefined;
      }
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
      },
      prepare: (listId: string) => {
        const newListItem: ListItem = {
          id: nanoid(),
          text: "",
          status: 0,
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
      state.listItems.byId[action.payload.id].text = action.payload.newText;
    },
    updateListItemStatus: (
      state,
      action: PayloadAction<{ id: string; newStatus: ListItemStatus }>
    ) => {
      state.listItems.byId[action.payload.id].status = action.payload.newStatus;
    },
    deleteListItem: (
      state,
      action: PayloadAction<{ listId: string; listItemId: string }>
    ) => {
      const { listId, listItemId } = action.payload;

      deleteNormalizedObjects(state.listItems, [listItemId]);

      state.lists.byId[listId].items = state.lists.byId[listId].items.filter(
        (id) => id !== listItemId
      );

      if (state.editableItem === listItemId) {
        state.editableItem = undefined;
      }
    },
    changeOpenList: (state, action: PayloadAction<string | undefined>) => {
      state.openList = action.payload;
    },
    changeEditableItem: (state, action: PayloadAction<string | undefined>) => {
      if (
        state.openList &&
        state.editableItem &&
        !state.listItems.byId[state.editableItem].text.trim()
      ) {
        deleteNormalizedObjects(state.listItems, [state.editableItem]);

        state.lists.byId[state.openList].items = state.lists.byId[
          state.openList
        ].items.filter((id) => id !== state.editableItem);
      }

      state.editableItem = action.payload;
    },
  },
});

export const selectLists = (state: RootState): List[] => {
  return state.lists.lists.allIds.map((id) => state.lists.lists.byId[id]);
};

export const selectListItemsByListId = (
  state: RootState,
  listId: string | undefined
): ListItem[] => {
  if (!listId) {
    return [];
  }

  return state.lists.lists.byId[listId].items.map(
    (id) => state.lists.listItems.byId[id]
  );
};

export const selectOpenListId = (state: RootState): string | undefined => {
  return state.lists.openList;
};

export const selectOpenList = (state: RootState): List | undefined => {
  if (!state.lists.openList) {
    return undefined;
  }

  return state.lists.lists.byId[state.lists.openList];
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
  changeOpenList,
  changeEditableItem,
} = listSlice.actions;

export default listSlice.reducer;
