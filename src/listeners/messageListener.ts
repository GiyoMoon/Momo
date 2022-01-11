import { Message, Client } from 'discord.js';
import { Momo } from '../bot';

export default class MessageListener {

  private _client: Client;

  private _prefix: string;

  constructor(private _momo: Momo) {
    this._client = this._momo.client;

    // get prefix from config
    this._prefix = this._momo.prefix;
  }

  public async evalMessage(msg: Message) {

    // return if msg is from bot or not sent in a guild
    if (msg.author.bot || !msg.guild) return;

    if (msg.content.startsWith(`<@${this._client.user?.id}>`) || msg.content.startsWith(`<@!${this._client.user?.id}`)) {
      msg.channel.send(`My prefix on this server is \`${this._prefix}\`\nGet a list of commands with \`${this._prefix}help\``);
      return;
    }

    if (!msg.content.toLowerCase().startsWith(this._prefix.toLowerCase())) return;

    const args = msg.content.slice(this._prefix.length).split(/ +/);

    const commandName = args[0].toLowerCase();

    args.shift();

    const command = this._momo.commands.get(commandName) || this._momo.commands.find(cmd => cmd.information.aliases && cmd.information.aliases.includes(commandName));

    // return if no command was found.
    if (!command) return;

    if (command.information.argsRequired && !args.length) {
      let reply = `:no_entry_sign: No arguments were provided`;

      reply += `\n**Description**: ${command.information.description}`;

      reply += `\n**Usage**: \`${this._prefix}${command.information.usage}\``;

      reply += `\n**Example**:`;

      for (const example of command.information.examples) {
        reply += `\n\`${this._prefix}${example}\``;
      }

      msg.channel.send(reply);

      return;
    }

    try {
      command.execute(msg, args, this._prefix);
    } catch (error) {
      console.error(error);
      msg.channel.send(`Error...`);
    }
  }
}