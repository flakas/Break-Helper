import { Notification } from './notification.js'

export class WhetherToGoOnBreak extends Notification {

  constructor(timeout, breakCallback, skipCallback) {
    super('bh-notification-wait')

    this.timeout = timeout
    this.timeLeft = timeout
    this.breakCallback = breakCallback
    this.skipCallback = skipCallback
  }

  tick(timeLeft) {
    this.timeLeft = timeLeft
    //this.update()
  }

  getText() {
    return {
      type: 'progress',
      title: 'Break Helper',
      message: "You've been working for quite a while, please take a break.",
      iconUrl: 'icon128.png',
      buttons: [
        { title: "Take a break" },
        { title: "Skip this break" }
      ],
      requireInteraction: true,
      progress: this.getProgress()
    }
  }

  getProgress() {
    return Math.round(this.timeLeft / this.timeout * 100)
  }

  firstButtonClick() {
    this.breakCallback()
  }

  secondButtonClick() {
    this.skipCallback()
  }

  closedByUser() {
    this.breakCallback()
  }

}
