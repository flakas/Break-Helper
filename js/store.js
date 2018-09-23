export class Store {

  constructor(engine) {
    this.engine = engine
  }

  get(key) {
    return this.engine.get(key)
  }

  set(key, value) {
    return this.engine.set(key, value)
  }
}
