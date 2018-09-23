import { Timer } from '../timer.js'
import { Badge } from '../badge.js'
import { Working } from './working.js'
import { Stopped } from './stopped.js'
import { Sound } from '../sound.js'

export class Break {

  constructor(app) {
    this.app = app
    this.timer = new Timer(this.tick.bind(this))
    this.badge = new Badge()
    this.name = 'break'
  }

  start() {
    const timeLeft = parseInt(this.app.settings.getActiveRule().breakTime, 10)
    this.timer.start(timeLeft)
    this.badge.show(timeLeft)
  }

  tick(timerState, timeLeft) {
    if (timerState === "stopped") {
      this._playSoundNotification()
      this.work()
    } else {
      // handle tick, update interfaces
      this.badge.tick(timeLeft)
    }
  }

  work() {
    this.timer.stop()
    this.badge.hide()
    this.app.changeState(new Working(this.app))
  }

  stop() {
    this.timer.stop()
    this.badge.hide()
    this.app.changeState(new Stopped(this.app))
  }

  cleanup() {
    this.timer.stop()
    this.badge.hide()
    this.timer = undefined
    this.badge = undefined
  }

  _playSoundNotification() {
    if (parseInt(this.app.settings.get('playSound'), 10)) {
      (new Sound()).play()
    }
  }
}
