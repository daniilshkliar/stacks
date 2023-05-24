export type ListType = "cycled" | "default";

export enum ListItemStatus {
  ready = 0,
  done = 1,
  repeat = 2,
}

export interface List {
  id: string;
  title: string;
  type: ListType;
  items: Array<string>;
}

export interface ListItem {
  id: string;
  text: string;
  status: ListItemStatus;
}
