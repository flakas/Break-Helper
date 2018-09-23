import { Timer } from '../timer.js'
import { Badge } from '../badge.js'
import {WhetherToGoOnBreak} from '../notifications/whetherToGoOnBreak.js'
import { Working } from './working.js'
import { Break } from './break.js'
import { Stopped } from './stopped.js'

export class Waiting {

  constructor(app) {
    this.app = app
    this.timer = new Timer(this.tick.bind(this))
    this.badge = new Badge()
    this.waitTimeout = 60 // seconds
    this.notification = new WhetherToGoOnBreak(this.waitTimeout, this.break.bind(this), this.work.bind(this))
    this.name = 'waiting'
  }

  start() {
    this.timer.start(this.waitTimeout)
    this.badge.show(this.waitTimeout)
    this.notification.show()
  }

  tick(timerState, timeLeft) {
    if (timerState === 'stopped') {
      // Default to going on a break if timeout ends
      this.break()
    } else {
      // handle tick, update interfaces
      this.badge.tick(timeLeft)
      this.notification.tick(timeLeft)
    }
  }

  work() {
    this.timer.stop()
    this.badge.hide()
    this.notification.hide()
    this.app.changeState(new Working(this.app))
  }

  break() {
    this.timer.stop()
    this.badge.hide()
    this.notification.hide()
    this.app.changeState(new Break(this.app))
  }

  stop() {
    this.timer.stop()
    this.badge.hide()
    this.notification.hide()
    this.app.changeState(new Stopped(this.app))
  }

  cleanup() {
    this.timer.stop()
    this.badge.hide()
    this.notification.hide()
    this.timer = undefined
    this.badge = undefined
    this.notification = undefined
  }

}
