export const getRandomNickname = (animalCode: number) => {
  const first = [
    '용감한 ',
    '졸린 ',
    '게으른 ',
    '열정적인 ',
    '지루한 ',
    '아픈 ',
    '행복한 ',
    '귀찮은 ',
    '즐거운 ',
    '슬픈 ',
    '나른한 ',
  ];
  const second = [
    '푸른 ',
    '붉은 ',
    '분홍 ',
    '초록 ',
    '흰색 ',
    '검은색 ',
    '노랑 ',
    '초콜릿색 ',
  ];
  const third = ['', '고양이', '소', '도마뱀', '강아지', '돼지', '토끼'];
  const randomCode = Math.random();
  return (
    first[Math.floor(randomCode * first.length)] +
    second[Math.floor(randomCode * second.length)] +
    third[animalCode]
  );
};
