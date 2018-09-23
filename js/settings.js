export class Settings {

  constructor(store) {
    this.store = store
  }

  get(key) {
    const settings = this._getFromStore()
    return settings[key]
  }

  set(key, value) {
    let settings = this._getFromStore()
    settings[key] = value
    this.store.set('settings', settings)
  }

  setMany(obj) {
    for (key in obj) {
      this.set(key, obj[key])
    }
  }

  getActiveRule() {
    const activeRuleName = this.get('rule')
    const allRules = this._getRules()
    const activeRule = allRules[activeRuleName]

    if (activeRuleName === 'custom') {
      // overwrite custom rule defaults with ones set by user
      activeRule.workTime = this.get('workTime')
      activeRule.breakTime = this.get('breakTime')
    }
    return activeRule
  }

  _getFromStore() {
    return this.store.get('settings') || this._getDefaults()
  }

  _getDefaults() {
    return {
        'rule' : 'pomodoro',
        'workTime' : 25 * 60, // 25 minutes
        'breakTime' : 5 * 60,
        'playSound' : 0
    };
  }
  _getRules() {
    return {
      '20-20-20': {
        'name' : '20-20-20',
        'workTime' : 20 * 60, // 20 minutes
        'breakTime' : 20      // 20 seconds
      },
        '50-10': {
          'name' : '50-10',
          'workTime' : 50 * 60, // 50 minutes
          'breakTime' : 10 * 60 // 10 minutes
        },
        'pomodoro': {
          'name' : 'Pomodoro',
          'workTime' : 25 * 60, // 25 minutes
          'breakTime' : 5 * 60  // 5 minutes
        },
        'custom': {
          'name' : 'Custom',
          'workTime' : 20 * 60, // Default 20 minutes
          'breakTime' : 20  // Default 20 seconds
        }
    }
  }
}
