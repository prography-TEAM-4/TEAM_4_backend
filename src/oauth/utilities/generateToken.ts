import { sign } from 'jsonwebtoken';

export const generateToken = (
  id: string,
  provider: string,
  secret: string,
): string => {
  return sign(
    {
      id,
      provider,
      iss: 'pomo',
      sub: 'pomo jwt',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    secret,
  );
};
