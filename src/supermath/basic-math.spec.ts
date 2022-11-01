import { BasicMath } from '#/supermath/basic-math';

describe('AdvancedMath', () => {
  const sut = new BasicMath();

  test('multiply', () => {
    expect(sut.sum(2, 2)).toBe(4);
  });

  test('divide', () => {
    expect(sut.subtract(70, 1)).toBe(69);
  });
});
