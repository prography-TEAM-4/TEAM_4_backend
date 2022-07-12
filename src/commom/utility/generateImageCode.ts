export function generateImageCode(userList: number[]): string {
  const len: number = userList.length;
  const set: Set<number> = new Set<number>(userList.sort());
  const kindOfImg: number[] = Array.from(set);

  // 한명이거나 한종류일 때
  if(len==1 || set.size==1){
    return `${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}`;  
  }

  while(userList.length !== 6){
    const randomNum: number = Math.floor(Math.random() * len);
    userList.push(userList[randomNum]);
  }

  userList.sort(() => Math.random() - 0.5);

  // 종류가 두개일 땐 랜덤
  if(len==2 || set.size==2){
    return `${userList[0]}_${userList[1]}_${userList[2]}_${userList[3]}_${userList[4]}_${userList[5]}`;
  }

  // 종류가 세개일 땐 3, 5, 6번 자리에 세 종류 오름차순으로 삽입
  else if(set.size == 3){
    return `${userList[0]}_${userList[1]}_${kindOfImg[0]}_${userList[3]}_${kindOfImg[1]}_${kindOfImg[2]}`;
  }
  
  // 종류가 네개 이상일 때
  else{
    const picks: Set<number> = new Set<number>();

    // 중복되지 않게 n개의 종류 중 3개 pick
    while(picks.size != 3){
      picks.add(Math.floor(Math.random() * kindOfImg.length));
    }

    // 오름차순으로 넣어야하기 때문에 sort
    const seq: number[] = Array.from(picks);
    seq.sort();

    return `${userList[0]}_${userList[1]}_${kindOfImg[seq[0]]}_${userList[3]}_${kindOfImg[seq[1]]}_${kindOfImg[seq[2]]}`
  }
}