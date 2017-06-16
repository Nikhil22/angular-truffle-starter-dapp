import { canBeNumber } from './validation';

describe('Validation of string; check if it can be a number', () => {
  it('should return true', () => {
    const str = '12';
    const result = canBeNumber(str);
    expect(result).toBe(true);
  });

  it('should return false', () => {
    const str = '1q';
    const result = canBeNumber(str);
    expect(result).toBe(false);
  });

  it('should return false', () => {
    const str = '';
    const result = canBeNumber(str);
    expect(result).toBe(false);
  });
});
