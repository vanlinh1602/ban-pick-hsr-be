import _ from 'lodash';

export const validParams = (
  params: CustomObject<any>,
  required: string[],
  options?: { relax?: string[] }
): boolean => {
  const missing: string[] = [];
  required.forEach((param) => {
    const isRelax = options?.relax?.includes(param) || false;
    if ((isRelax && _.isNil(params?.[param])) || (!isRelax && !params?.[param])) {
      missing.push(param);
    }
  });
  if (missing.length) {
    throw new Error(`Missing fields: ${missing.join(', ')}`);
  }
  return true;
};
