import { DBSchema, openDB } from "idb";
import { openDB as asyncOpenDB } from "idb/with-async-ittr";
import { List, ListItem } from "./listTypes";
import { NormalizedEntity } from "../../../utils/types";

interface ListDB extends DBSchema {
  lists: {
    key: string;
    value: List;
  };
  "list-items": {
    key: string;
    value: ListItem;
  };
  order: {
    key: string;
    value: Array<string>;
  };
}

export const initializeListDB = () => {
  openDB<ListDB>("list-db", 1, {
    upgrade(db) {
      db.createObjectStore("lists");
      db.createObjectStore("list-items");
      db.createObjectStore("order");
    },
  });
};

export const putListInDB = async (list: List, allIds?: Array<string>) => {
  const db = await openDB<ListDB>("list-db");

  db.put("lists", list, list.id);
  allIds && db.put("order", allIds, "lists");

  db.close();
};

export const putListItemInDB = async (
  listItem: ListItem,
  allIds?: Array<string>,
  list?: List
) => {
  const db = await openDB<ListDB>("list-db");

  db.put("list-items", listItem, listItem.id);
  allIds && db.put("order", allIds, "list-items");
  list && db.put("lists", list, list.id);

  db.close();
};

export const readListsFromDB = async () => {
  const normalizedListEntity: NormalizedEntity<List> = {
    byId: {},
    allIds: [],
  };
  const db = await asyncOpenDB<ListDB>("list-db");
  const tx = db.transaction("lists");

  for await (const cursor of tx.store) {
    normalizedListEntity.byId[cursor.key] = cursor.value;
  }
  normalizedListEntity.allIds = (await db.get("order", "lists")) || [];

  db.close();

  return normalizedListEntity;
};

export const readListItemsFromDB = async () => {
  const normalizedListItemEntity: NormalizedEntity<ListItem> = {
    byId: {},
    allIds: [],
  };
  const db = await asyncOpenDB<ListDB>("list-db");
  const tx = db.transaction("list-items");

  for await (const cursor of tx.store) {
    normalizedListItemEntity.byId[cursor.key] = cursor.value;
  }
  normalizedListItemEntity.allIds = (await db.get("order", "list-items")) || [];

  db.close();

  return normalizedListItemEntity;
};

export const deleteListFromDB = async (
  id: string,
  allIds: Array<string>,
  listItemsToDelete: Array<string>,
  allListItemsIds: Array<string>
) => {
  const db = await openDB<ListDB>("list-db");
  const tx = db.transaction("list-items", "readwrite");

  db.delete("lists", id);
  db.put("order", allIds, "lists");

  await Promise.all([
    ...listItemsToDelete.map((id) => tx.store.delete(id)),
    tx.done,
  ]);
  db.put("order", allListItemsIds, "list-items");

  db.close();
};

export const deleteListItemFromDB = async (
  id: string,
  allIds: Array<string>,
  list: List
) => {
  const db = await openDB<ListDB>("list-db");

  db.delete("list-items", id);
  db.put("order", allIds, "list-items");
  db.put("lists", list, list.id);

  db.close();
};
