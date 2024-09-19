import { nanoid } from 'nanoid';

export const generateID = (
  ids: string[] = [],
  size = 10,
  options: { prefix?: string } = {}
): string => {
  const id = `${options?.prefix ?? ''}${nanoid(size)}`;
  if (ids.includes(id)) return generateID(ids, size);
  return id;
};
