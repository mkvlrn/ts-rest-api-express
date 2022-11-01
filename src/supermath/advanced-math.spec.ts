import { AdvancedMath } from '#/supermath/advanced-math';

describe('AdvancedMath', () => {
  const sut = new AdvancedMath();

  test('multiply', () => {
    expect(sut.multiply(2, 3)).toBe(6);
  });

  test('divide', () => {
    expect(sut.divide(6, 3)).toBe(2);
  });

  test('divide by zero throws', () => {
    expect(() => sut.divide(2, 0)).toThrow('nope');
  });
});
