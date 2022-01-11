import { Message } from 'discord.js';

export interface BotCommand {
  information: {
      id: number,
      name: string,
      category: string,
      description: string,
      argsRequired: boolean,
      admin: boolean,
      aliases: string[],
      usage: string,
      examples: string[]
  },
  afterInit?(): void,
  execute(msg: Message, args: string[], prefix: string): void
}
