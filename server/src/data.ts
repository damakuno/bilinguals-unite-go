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
                db.exec(`
                CREATE TABLE IF NOT EXISTS User (id TEXT, name TEXT, created TEXT);
                CREATE TABLE IF NOT EXISTS Game (id TEXT, round INT, createdBy TEXT, settings TEXT, status TEXT, created TEXT);
                `)
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
    addGame(game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            open(this.config).then((db) => {
                db.run(`INSERT INTO Game (id, round, createdBy, settings, status, created) VALUES(?, ?, ?, ?, ?, ?)`,
                    game.id, game.round, game.createdBy.id, JSON.stringify(game.settings), game.status, game.created.toISOString())
                    .then(() => { resolve() }).catch((err) => reject(err));
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
        if (typeof (created) !== 'undefined') {
            this.created = new Date(Date.parse(created));
        } else { this.created = new Date(Date.now()); }
    }
}

enum TimerSettings {
    Seconds30 = "Seconds30",
    Seconds60 = "Seconds60",
    Unlimited = "Unlimited"
}

export class Settings {
    timer: TimerSettings;
    mode: string;
    constructor(timer: TimerSettings, mode: string) {
        this.timer = timer;
        this.mode = mode;
    }
}

enum GameStatus {
    Created = "Created",
    InProgress = "InProgress",
    Completed = "Completed",
}

export class Game {
    id: string;
    round: number;
    createdBy: User;
    settings: Settings;
    status: GameStatus;
    created: Date;
    constructor(id: string, settings: string, createdBy: User, status?: GameStatus, round?: number, created?: string) {
        this.id = id;
        this.settings = new Settings(TimerSettings[settings as keyof typeof TimerSettings], 'freeform');
        this.createdBy = createdBy;
        if (typeof (status) !== 'undefined') { this.status = status; }
        else { this.status = GameStatus.Created; }
        if (typeof (status) !== 'undefined') { this.round = round; }
        else { this.round = 1; }
        if (typeof (created) !== 'undefined') {
            this.created = new Date(Date.parse(created));
        } else { this.created = new Date(Date.now()); }
    }
}