import { Working } from './states/working.js'
import { Stopped } from './states/stopped.js'

export class App {
  constructor(settings) {
    this.settings = settings
    this.state = undefined
  }

  start() {
    this.changeState(new Working(this))
  }

  restart() {
    this.changeState(new Working(this))
  }

  stop() {
    this.changeState(new Stopped(this))
  }

  changeState(newState) {
    console.log('Switching state to', newState.constructor.name)
    if (typeof this.state === 'object') {
      this.state.cleanup()
    }
    this.state = newState
    this.state.start()
  }
}
