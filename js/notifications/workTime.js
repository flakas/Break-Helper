import { Notification } from './notification.js'

export class WorkTime extends Notification {

  constructor() {
    super('bh-notification-work')
  }

  getText() {
    return {
      type: 'basic',
      title: 'Break Helper',
      message: "Break time's up. Let's get back to work!",
      iconUrl: 'icon128.png',
      requireInteraction: false,
    }
  }

}
