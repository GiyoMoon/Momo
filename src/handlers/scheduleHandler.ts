import { TextChannel } from 'discord.js';
import ns from 'node-schedule';
import { Momo } from '../bot';

export class ScheduleHandler {
  private _events: { cron: string, msg: string[]; }[];

  private _notificationChannel: TextChannel;

  constructor(private _momo: Momo) {
    if (!process.env.EVENT_JSON) {
      console.error(`Couldn't get events from the environment`);
      return;
    }
    if (!process.env.NOTIFICATION_CHANNEL_ID) {
      console.error(`No notification channel configured`);
      return;
    }
    this._events = JSON.parse(process.env.EVENT_JSON);

    this._momo.client.channels.fetch(process.env.NOTIFICATION_CHANNEL_ID).then(channel => {
      this._notificationChannel = channel as TextChannel;
    });

    this._startSchedules();
  }

  public createJob(date: Date, msg: string) {
    ns.scheduleJob(date, async () => {
      this._notificationChannel.send(msg);
    });
  }

  private _startSchedules() {
    for (const event of this._events) {
      ns.scheduleJob(event.cron, async () => {
        const notificationMessage = await this._notificationChannel.send(event.msg.join('\n'));
        await notificationMessage.react('✅');
      });
    }
  }
}
