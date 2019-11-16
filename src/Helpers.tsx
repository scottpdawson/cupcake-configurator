export function generateUniqueKey(pre: string) {
  return `${pre}_${new Date().getTime()}`;
}
