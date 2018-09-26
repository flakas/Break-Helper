import { Notification } from './notification.js'

export class BreakTime extends Notification {

  constructor() {
    super('bh-notification-break')
  }

  getText() {
    return {
      type: 'basic',
      title: 'Break Helper',
      message: "You're on a break",
      iconUrl: 'icon128.png',
      requireInteraction: false,
    }
  }

}
