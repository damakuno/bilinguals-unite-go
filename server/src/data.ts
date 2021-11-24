export class DataLayer {
    constructor() {

    }
}

export class User {
    id: string;
    name: string;
    created: Date;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.created = new Date(Date.now())
    }
}