import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { ScheduleHandler } from './handlers/scheduleHandler';
import { BotCommand } from './interfaces/botCommand';
import MessageListener from './listeners/messageListener';

export class Momo {
    private _client: Client;

    private _prefix = '!';

    // All available commands (in folder 'commands')
    private _commands: Collection<string, BotCommand>;

    private _scheduleHandler: ScheduleHandler;

    private _messageListener: MessageListener;

    public get client() {
        return this._client;
    }

    public get commands() {
        return this._commands;
    }

    public get scheduleHandler() {
        return this._scheduleHandler;
    }

    public get prefix() {
        return this._prefix;
    }

    constructor() {
        this._start();
    }

    private async _start(): Promise<void> {
        if (process.env.BOT_PREFIX) {
            this._prefix = process.env.BOT_PREFIX;
        }

        this._client = new Client({ intents: ['GUILD_MESSAGES'] });

        this._messageListener = new MessageListener(this);

        // load all commands
        this.loadCommands();

        this._listenToEvents();

        this._client.login(process.env.BOT_TOKEN);
    }

    private _listenToEvents() {
        this._client.once('ready', () => this._botReady());
        this._client.on('messageCreate', (msg) => this._messageListener.evalMessage(msg));
    }

    private _botReady() {
        this._scheduleHandler = new ScheduleHandler(this);
        console.log(`Logged in as ${this._client.user?.tag}`);
    }

    // load all commands
    private loadCommands() {
        this._commands = new Collection();
        const COMMANDFILES = readdirSync(`./commands`).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of COMMANDFILES) {
            const COMMAND = require(`./commands/${file}`).default;
            const commandInstance = new COMMAND(this);
            this._commands.set(commandInstance.information.name.toLowerCase(), commandInstance);
        }
    }

}
