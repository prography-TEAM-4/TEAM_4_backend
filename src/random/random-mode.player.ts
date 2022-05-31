export class Player {
    id: number;
    Nick: string;
    all: string;
    point: number;
    logined: boolean;

    constructor(id: number, Nick: string, all: string, point: number, logined: boolean){
        this.id = id;
        this.Nick = Nick;
        this.all = all;
        this.point = point;
        this.logined = logined;
    }
}