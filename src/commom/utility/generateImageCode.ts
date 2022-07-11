export function generateImageCode(userList: number[]): string {
  const len: number = userList.length;

  // 한명일 때는 그냥 리턴
  if(len==1){
    return `${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}_${userList[0]}`;  
  }

  // 2명 이상일 때
  const imgList: UserImage[] = [];

  userList.forEach((imgCode)=> {
    imgList.push(new UserImage(imgCode, Math.round(Math.random() * (100-1) + 1)));
  });

  while(imgList.length !== 6){
    const randomNum: number = Math.round(Math.random() * (len-1) + 1);
    imgList.push(new UserImage(userList[randomNum-1], Math.round(Math.random() * (100-1) + 1)));
  }

  const randomSort: any = (x: UserImage, y: UserImage) => {
    const result: number = x.priority - y.priority;

    if(result == 0){
      return Math.round(Math.random() * (100-1) + 1) - Math.round(Math.random() * (100-1) + 1);
    }
    return result;
  }

  imgList.sort(randomSort);

  let mixImg: string = '';

  imgList.forEach((img) => {
    mixImg += (img.data + '_');
  })

  return mixImg.substring(0, 11);
}

class UserImage {
  data: number;
  priority: number;

  constructor(data: number, priority:number){
    this.data = data;
    this.priority = priority;
  }
}