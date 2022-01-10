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
    this._events = JSON.parse(process.env.EVENT_JSON);

    this._momo.client.channels.fetch(process.env.NOTIFICATION_CHANNEL_ID).then(channel => {
      this._notificationChannel = channel as TextChannel;
    });

    this._startSchedules();
  }

  private _startSchedules() {
    for (const event of this._events) {
      ns.scheduleJob(event.cron, () => {
        this._notificationChannel.send(event.msg.join('\n'));
      });
    }
  }
}
