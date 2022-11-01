export class AdvancedMath {
  multiply = (a: number, b: number) => a * b;

  divide = (a: number, b: number) => {
    if (b === 0) {
      throw new Error('nope');
    }

    return a / b;
  };
}
