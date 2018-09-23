export class Timer {

  constructor(callback) {
    if (typeof callback !== 'function') { throw 'Callback expected to be a function' }

    this.callback = callback
    this.timeLeft = 0
    this.timer = undefined
    this.status = 'stopped'
  }

  start(timeLeft) {
    if (this.status != 'stopped') {
      throw 'The timer needs to be stopped first, currently it is ' + this.status
    }

    if (typeof timeLeft !== 'number' || timeLeft <= 0) {
      throw 'The timer has to be a positive integer, received: ' + timeLeft
    }

    this.timeLeft = timeLeft
    this.status = 'started'
    this.timer = setInterval(this.tick.bind(this), 1000)
  }

  stop() {
    clearInterval(this.timer)
    this.timer = undefined
    this.timeLeft = 0
    this.status = 'stopped'
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1
    } else {
      this.stop()
    }
    this.callback(this.status, this.timeLeft)
  }

}
