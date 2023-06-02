export type DirectionType = "left" | "right" | "up" | "down";

export interface NormalizedEntity<T> {
  byId: Record<string, T>;
  allIds: Array<string>;
}

export interface Size {
  width: number;
  height: number;
}
