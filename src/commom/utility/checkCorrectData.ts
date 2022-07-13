export function checkCorrectData(userList: number[]):boolean {
    const set: Set<number> = new Set<number>(userList);
    const kind: number = set.size;

    // 이미지 종류가 1때 또는 2개일 때 무조건 true 리턴
    if(kind == 1 || kind == 2){
        return true;
    }
    // 3개 이상일 땐 3, 5, 6번 째 요소가 증가 수열인지 확인
    else{
        if(userList[2] < userList[4] && userList[4] < userList[5]){
            return true;
        }
    }

    return false;
}