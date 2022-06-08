import { App } from "./demo/App.js";
import { Display } from "./Display.js";
import { createElement } from "./util.js";
const root = createElement(App, null);
new Display(root);
