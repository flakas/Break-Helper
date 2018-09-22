import { Working } from './states/working.js'

export class App {
  constructor(settings) {
    this.settings = settings
    this.state = undefined
  }

  start() {
    this.changeState(new Working(this))
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
