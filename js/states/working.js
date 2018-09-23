import { Timer } from '../timer.js'
import { Badge } from '../badge.js'
import { Waiting } from './waiting.js'
import { Stopped } from './stopped.js'

export class Working {

  constructor(app) {
    this.app = app
    this.timer = new Timer(this.tick.bind(this))
    this.badge = new Badge()
    this.name = 'working'
  }

  start() {
    const timeLeft = parseInt(this.app.settings.getActiveRule().workTime, 10)
    this.timer.start(timeLeft)
    this.badge.show(timeLeft)
  }

  tick(timerState, timeLeft) {
    this.badge.tick(timeLeft)
    if (timerState === "stopped") {
      this.wait()
    } else {
      // handle tick, update interfaces
    }
  }

  wait() {
    this.timer.stop()
    this.badge.hide()
    this.app.changeState(new Waiting(this.app))
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

}
