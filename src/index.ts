import {AppComponent} from "./App.component";
import {Liba} from "./LibaJS";

const rootElement = document.getElementById('root')
const appInstance = Liba.create({ComponentFunction: AppComponent}) // no element error

if (rootElement && appInstance.element) {
    rootElement.append(appInstance.element)
}
