import { Timer } from '../timer.js'
import { Badge } from '../badge.js'
import { Working } from './working.js'

export class Stopped {

  constructor(app) {
    this.app = app
    this.timer = new Timer(null)
    this.badge = new Badge()
    this.name = 'stopped'
  }

  start() {
    // do nothing
    const timeLeft = 0
    this.badge.show(timeLeft)
  }

  work() {
    this.badge.hide()
    this.app.changeState(new Working(this.app))
  }

  cleanup() {
    this.timer.stop()
    this.badge.hide()
    this.timer = undefined
    this.badge = undefined
  }

}
