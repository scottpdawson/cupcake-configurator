export function generateUniqueKey(pre) {
  return `${pre}_${new Date().getTime()}`;
}
