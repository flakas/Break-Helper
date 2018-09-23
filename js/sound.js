export class Sound {
  constructor() {
    this.url = 'notification.mp3'
  }

  play() {
    this._playSound(this.url)
  }

  _playSound(url) {
    (new Audio(url)).play();
  }
}
