import { Message } from 'discord.js';
import ts from 'timestring';
import { Momo } from '../bot';
import { BotCommand } from '../interfaces/botCommand';

export default class RemindMeCommand implements BotCommand {
  public information: BotCommand['information'] = {
    id: 1,
    name: 'remindme',
    category: 'Reminder',
    description: 'Reminds you in a specific amount of time.',
    argsRequired: true,
    admin: false,
    aliases: ['rm'],
    usage: 'remindme {<duration>} {message}',
    examples: ['remindme <1h 30m> Go to sleep...']
  };

  constructor(private _momo: Momo) { }

  public async execute(msg: Message, args: string[], prefix: string) {
    const timeString = msg.content.substring(msg.content.indexOf('<') + 1, msg.content.indexOf('>'));
    let time: number;
    try {
      time = ts(timeString);
    } catch {
      msg.channel.send(':x: There was an error parsing your timestring. Make sure you wrap it with `<` and `>`.');
      return;
    }

    const date = new Date();
    date.setSeconds(date.getSeconds() + time);

    const reminderMsg = msg.content.substring(msg.content.indexOf('>') + 1);

    this._momo.scheduleHandler.createJob(date, `${msg.author.toString()}${reminderMsg}`);

    msg.channel.send(`:white_check_mark: I will remind you at \`${date.toLocaleString('de-CH')}\``);
  }
}
