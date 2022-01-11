import { Message, Collection, MessageEmbed, Client } from 'discord.js';
import { Momo } from '../bot';
import { BotCommand } from '../interfaces/botCommand';

export default class HelpCommand implements BotCommand {
  public information: BotCommand['information'] = {
    id: 0,
    name: 'help',
    category: 'Information',
    description: 'Displays all available commands.',
    argsRequired: false,
    admin: false,
    aliases: ['h'],
    usage: 'help',
    examples: ['help', 'help remindme']
  };

  private _client: Client;

  private _commands: Collection<string, BotCommand>;

  constructor(momo: Momo) {
    this._client = momo.client;
    this._commands = momo.commands;
  }

  public execute(msg: Message, args: string[], prefix: string) {
    // set up embed
    const embed = new MessageEmbed();
    embed.setColor(0xFF72EF);
    embed.setAuthor({ name: `${this._client.user?.username}`, iconURL: `${this._client.user?.avatarURL()}` });
    embed.setFooter({ text: '🌺' });

    // search for a command to display help for
    const command = this._commands.get(args[0]) || this._commands.find(cmd => cmd.information.aliases && cmd.information.aliases.includes(args[0]));

    // if a command was found, set up help message for it
    if (command) {
      embed.setTitle(`Commandinfo \`${command.information.name}\``);
      embed.addField(`Description`, `${command.information.description}`);
      embed.addField(`Category`, `${command.information.category}`);
      if (command.information.aliases.length > 0) {
        const aliases = command.information.aliases.map(a => `\`${a}\``).join(', ');
        embed.addField(`Aliases`, `${aliases}`);
      }
      embed.addField(`Usage`, `\`${prefix}${command.information.usage}\``);
      if (command.information.examples) {
        const examples = command.information.examples.map(e => `\`${e}\``).join('\n');
        embed.addField(`Example`, `${examples}`);
      }

      msg.channel.send({ embeds: [embed] });
    } else if (args[0]) {
      // if no command was found, send error message
      msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, the command \`${args[0]}\` was not found.`);
    } else {
      // set up general help message
      embed.setTitle(`Commands`);
      embed.setDescription(`To get detailed information about a command, type \`${prefix}help {command}\``);
      const fields: {
        [key: string]: string;
      } = {};
      for (const cmd of this._commands) {
        if (fields[`${cmd[1].information.category}`]) {
          fields[`${cmd[1].information.category}`] += `\n**${prefix}${cmd[1].information.name}**\n${cmd[1].information.description}`;
        } else {
          fields[`${cmd[1].information.category}`] = `**${prefix}${cmd[1].information.name}**\n${cmd[1].information.description}`;
        }
      }

      for (const key of Object.keys(fields)) {
        embed.addField(`►${key}◄`, fields[key]);
      }

      msg.channel.send({ embeds: [embed] });
    }
  }
}
