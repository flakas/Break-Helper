export class LocalStorage {
  get(key) {
    const result = localStorage[key]
    if (typeof result === 'string') {
      return JSON.parse(result)
    } else {
      return undefined
    }
  }

  set(key, value) {
    localStorage[key] = JSON.stringify(value)
  }
}
