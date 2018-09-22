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

    chrome.browserAction.setBadgeText({text: timeLeft.toString()})
    return

    if (left > 0) {
      h = Math.floor(left / 3600);
      tempLeft = left % 3600;
      s = tempLeft % 60;
      m = (tempLeft - s) / 60;
      if (left > 300) {
        chrome.browserAction.setBadgeBackgroundColor({color : [66, 134, 244, 255]});
      }

      if (left <= 300 && left > 60) {
        chrome.browserAction.setBadgeBackgroundColor({color : [255, 140, 0, 255]});
      }

      if (left <= 60) {
        chrome.browserAction.setBadgeBackgroundColor({color : [255, 0, 0, 255]});
      }
      chrome.browserAction.setBadgeText({text: m.pad(2) + ':' + s.pad(2)});

    } else {
      chrome.browserAction.setBadgeBackgroundColor({color : [255, 0, 0, 255]});
      chrome.browserAction.setBadgeText({text: '00:00'});
    }
  }

  hide() {
    chrome.browserAction.setBadgeText({text: ''})
  }
}
