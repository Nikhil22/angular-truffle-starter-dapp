export function canBeNumber(str: string): boolean {
  return !isNaN(+str);
}
