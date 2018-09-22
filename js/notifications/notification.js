export class Notification {

  constructor(notificationId) {
    this.notificationId = notificationId || 'bh-notification'
    this.shown = false

    chrome.notifications.onButtonClicked.addListener(this.handleNotificationInteraction.bind(this));
    chrome.notifications.onClosed.addListener(this.handleNotificationClosed.bind(this));
  }

  show() {
    this.notification = chrome.notifications.create(this.notificationId, this.getText())
    this.shown = true
  }

  getText() {
    return {
      type: 'basic',
      title: 'Break Helper',
      message: "Something went wrong in Break Helper!",
      iconUrl: 'icon128.png',
      buttons: [
      ],
      requireInteraction: false,
    }
  }

  update() {
    chrome.notifications.update(this.notificationId, this.getText())
  }

  hide() {
    chrome.notifications.clear(this.notificationId);
    this.shown = false
    this.notification = undefined;
    chrome.notifications.onButtonClicked.removeListener(this.handleNotificationInteraction)
    chrome.notifications.onClosed.removeListener(this.handleNotificationClosed);
  }

  handleNotificationInteraction(notificationId, buttonIndex) {
    if (!this.shown) return false

    if (notificationId === this.notificationId) {
      if (buttonIndex === 0) {
        this.firstButtonClick()
      } else if (buttonIndex === 1) {
        this.secondButtonClick()
      }
    }
    this.hide()
  }

  handleNotificationClosed(notificationId, byUser) {
    if (!this.shown) return false
    this.shown = false
    if (notificationId === this.notificationId && byUser) {
      this.closedByUser()
    }
  }

  firstButtonClick() {
    // noop
  }

  secondButtonClick() {
    // noop
  }

  closedByUser() {
    // noop
  }

}
