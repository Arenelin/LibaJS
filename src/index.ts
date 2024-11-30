import {AppComponent} from "./App.component";
import {Liba} from "./LibaJS";

const rootElement = document.getElementById('root')
const appInstance = Liba.create({ComponentFunction: AppComponent})

if (rootElement) {
    rootElement.append(appInstance.element)
}
