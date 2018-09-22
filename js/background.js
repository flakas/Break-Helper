import { LocalStorage } from './storage_engines/localStorage.js'
import { Store } from './store.js'
import { Settings } from './settings.js'
import { App } from './app.js'

const store = new Store(new LocalStorage())
const settings = new Settings(store)

export const app = new App(settings)

app.start()
window.app = app
