export class Badge {
  show(timeLeft) {
    this.updateBadgeClock(timeLeft)
  }

  tick(timeLeft) {
    this.updateBadgeClock(timeLeft)
  }

  updateBadgeClock(timeLeft) {
    this.setBadgeColor(timeLeft)
    this.setBadgeText(this.prettyPrintTime(timeLeft))
  }

  setBadgeColor(timeLeft) {
    let color
    if (timeLeft > 300) {
      color = [66, 134, 244, 255]
    } else if (timeLeft > 60) {
      color = [255, 140, 0, 255]
    } else {
      color = [255, 0, 0, 255]
    }
    chrome.browserAction.setBadgeBackgroundColor({color: color})
  }

  setBadgeText(text) {
    chrome.browserAction.setBadgeText({text: text});
  }

  prettyPrintTime(seconds) {
    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    if (seconds / week >= 1) return Math.floor(seconds / week) + 'w'
    if (seconds / day >= 1) return Math.floor(seconds / day) + 'd'
    if (seconds / hour >= 1) return Math.floor(seconds / hour) + 'h'
    if (seconds / minute >= 1) return Math.floor(seconds / minute) + 'm'
    return seconds + 's'
  }

  hide() {
    this.setBadgeText('')
  }
}
