import * as sqlite3 from 'sqlite3';
import { ISqlite, open } from 'sqlite';

export class DataLayer {
    config: ISqlite.Config
    constructor() {
        this.config = { filename: 'server/db/main.db', driver: sqlite3.Database };
    }
    init(): Promise<void> {
        return new Promise((resolve, reject) => {
            open(this.config).then((db) => {
                db.exec(`CREATE TABLE IF NOT EXISTS User (id TEXT, name TEXT, created TEXT);`)
                    .then(() => { resolve() }).catch((err) => reject(err));
            }).catch((err) => reject(err));
        });
    }
    addUser(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            open(this.config).then((db) => {
                db.run(`INSERT INTO User (id, name, created) VALUES(?, ?, ?)`,
                    user.id, user.name, user.created.toISOString())
                    .then(() => { resolve() }).catch((err) => reject(err));
            }).catch((err) => reject(err));
        });
    }
    getUser(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            open(this.config).then((db) => {
                db.get(`SELECT id, name, created FROM User WHERE id = ?`, id)
                    .then((result) => { 
                        resolve(new User(result.id, result.name, result.created)) 
                    }).catch((err) => reject(err));
            }).catch((err) => reject(err));
        });
    }
}

export class User {
    id: string;
    name: string;
    created: Date;
    constructor(id: string, name: string, created?: string) {
        this.id = id;
        this.name = name;
        if (typeof(created) !== 'undefined') {            
            this.created = new Date(Date.parse(created))
        }
        this.created = new Date(Date.now())
    }
}

export class Game {
    id: string;
}