import {Liba} from './node_modules/@it-incubator/libajs/liba/Liba.js'
import {AppComponent} from "./App.component.js";

const rootElement = document.getElementById('root')
const appInstance = Liba.create(AppComponent)

rootElement.append(appInstance.element)
