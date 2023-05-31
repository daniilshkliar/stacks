export type ListType = "cycled" | "default";

export interface List {
  id: string;
  title: string;
  type: ListType;
  items: Array<string>;
}

export interface ListItem {
  id: string;
  text: string;
  done: boolean;
}
