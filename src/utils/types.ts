export type DirectionType = "left" | "right" | "up" | "down";

export interface Map<T> {
  [key: string]: T;
}

export interface NormalizedEntity<T> {
  byId: Map<T>;
  allIds: Array<string>;
}
