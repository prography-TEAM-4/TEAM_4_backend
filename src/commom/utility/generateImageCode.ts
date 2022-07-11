export function generateImageCode(userList: number[]): string {
  const len: number = userList.length;

  // 한명일 때는 그냥 리턴
  if(len==1){
    return `${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}`;  
  }

  while(userList.length !== 6){
    const randomNum: number = Math.round(Math.random() * (len-1) + 1);
    userList.push(userList[randomNum-1]);
  }

  userList.sort(() => Math.random() - 0.5);

  let mixImg: string = '';

  userList.forEach((img) => {
    mixImg += (img + '_');
  })

  return mixImg.substring(0, 11);
}