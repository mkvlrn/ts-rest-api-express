import { Envs } from '#/server/Envs';

jest.mock('dotenv', () => ({
  config: jest.fn().mockReturnValue({ parsed: { PORT: '4002' } }),
}));

describe('Envs.ts', () => {
  test('works', () => {
    expect(Envs).toBeDefined();
    expect(Envs.PORT).toBe('4002');
  });
});
