import { NormalizedEntity } from "./types";

export const createNormalizedObject = <T>(
  entity: NormalizedEntity<T>,
  id: string,
  obj: T
): void => {
  entity.byId[id] = obj;
  entity.allIds.push(id);
};

export const deleteNormalizedObjects = <T>(
  entity: NormalizedEntity<T>,
  ids: Array<string>
): void => {
  for (const id of ids) {
    delete entity.byId[id];
  }

  entity.allIds = entity.allIds.filter((id) => !ids.includes(id));
};
