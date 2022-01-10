import { Client } from 'discord.js';
import { ScheduleHandler } from './handlers/scheduleHandler';

export class Momo {
    private _client: Client;

    private _scheduleHandler: ScheduleHandler;

    public get client() {
        return this._client;
    }

    constructor() {
        this._start();
    }

    private async _start(): Promise<void> {
        this._client = new Client({ intents: [] });

        this._listenToEvents();


        this._client.login(process.env.BOT_TOKEN);
    }

    private _listenToEvents() {
        this._client.once('ready', () => this._botReady());
    }

    private _botReady() {
        this._scheduleHandler = new ScheduleHandler(this);
        console.log(`Logged in as ${this._client.user?.tag}`);
    }

}