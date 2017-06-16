export function canBeNumber(str: string): boolean {
  if (!str) {
    return false;
  }
  return !isNaN(+str);
}
