import { getRandomNickname } from './randomNickname';

export const randomData = () => {
  const ImgCode = Math.floor(Math.random() * 6) + 1;
  const code = {
    face: ImgCode,
    arm: ImgCode,
    body: ImgCode,
    ear: ImgCode,
    leg: ImgCode,
    tail: ImgCode,
    all: ImgCode,
  };
  const icons = {
    arrow: Math.floor(Math.random() * 6) + 1,
  };
  return {
    Nick: getRandomNickname(ImgCode),
    code,
    icons,
  };
};
