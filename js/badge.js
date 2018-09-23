export class Badge {
  show(timeLeft) {
    this.updateBadgeClock(timeLeft)
  }

  tick(timeLeft) {
    this.updateBadgeClock(timeLeft)
  }

  updateBadgeClock(timeLeft) {
    var left = timeLeft,
      tempLeft,
      h,
      m,
      s;

    this.setBadgeColor(left)
    this.setBadgeText(this.prettyPrintTime(left))
  }

  setBadgeColor(timeLeft) {
    if (timeLeft > 300) {
      chrome.browserAction.setBadgeBackgroundColor({color : [66, 134, 244, 255]});
    } else if (timeLeft > 60) {
      chrome.browserAction.setBadgeBackgroundColor({color : [255, 140, 0, 255]});
    } else {
      chrome.browserAction.setBadgeBackgroundColor({color : [255, 0, 0, 255]});
    }
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
