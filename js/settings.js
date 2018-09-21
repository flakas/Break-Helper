export class Settings {

  constructor(store) {
    this.store = store
  }

  get(key) {
    const settings = this._get_from_store()
    return settings[key]
  }

  set(key, value) {
    let settings = this._get_from_store()
    settings[key] = value
    this.store.set("settings", settings)
  }

  setMany(obj) {
    for (key in obj) {
      this.set(key, obj[key])
    }
  }

  _get_from_store() {
    return this.store.get("settings") || {}
  }

  _get_defaults() {
    return {
        "rule" : "pomodoro",
        "workTime" : 25 * 60, // 25 minutes
        "breakTime" : 5 * 60,
        "playSound" : 0
    };
  }
}
