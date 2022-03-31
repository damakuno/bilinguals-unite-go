import * as pgPromise from 'pg-promise';
import { IInitOptions, IDatabase, IMain } from 'pg-promise';
import * as dotenv from "dotenv";
import { IConnectionParameters, IClient } from 'pg-promise/typescript/pg-subset';
dotenv.config();

const pgp: IMain = pgPromise();

export class DataLayer {
    config: IConnectionParameters<IClient>;
    db: pgPromise.IDatabase<{}, IClient>;
    constructor() {
        this.config = {
	    connectionString: process.env.DATABASE_URL,
	    ssl: { rejectUnauthorized: false }
        };
        this.db = pgp(this.config);
    }
    init(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.none(`
                CREATE TABLE IF NOT EXISTS public.user (id TEXT, name TEXT, created TIMESTAMP);
                CREATE TABLE IF NOT EXISTS public.game (id TEXT, round INT, createdby TEXT, settings JSON, status TEXT, created TIMESTAMP);
                `)
                .then(() => { resolve() }).catch((err) => reject(err));
        });
    }
    addUser(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.none(`INSERT INTO public.user (id, name, created) VALUES($1, $2, $3)`,
                [user.id, user.name, user.created.toISOString()])
                .then(() => { resolve() }).catch((err) => reject(err));
        });
    }
    getUser(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.db.one(`SELECT id, name, created FROM public.user WHERE id = $1`, id)
                .then((result) => {
                    resolve(new User(result.id, result.name, result.created));
                }).catch((err) => reject(err));
        });
    }
    addGame(game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.none(`INSERT INTO public.game (id, round, createdby, settings, status, created) VALUES($1, $2, $3, $4, $5, $6)`,
                [game.id, game.round, game.createdBy.id, JSON.stringify(game.settings), game.status, game.created.toISOString()])
                .then(() => { resolve() }).catch((err) => reject(err));
        });
    }
    getGame(id: string): Promise<Game> {
        return new Promise((resolve, reject) => {
            this.db.one(`SELECT id, round, createdby, settings, status, created FROM public.game WHERE id = $1`, id)
                .then((result) => {
                    this.getUser(result.createdby).then(user => {
                        resolve(new Game(result.id, result.settings, user, result.status, result.round, result.created));
                    });                    
                }).catch((err) => reject(err));
        });
    }
    // TODO: getUserList(gameId: string)
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
