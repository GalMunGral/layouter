import { State } from "../Observable.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
import { Main } from "./Main.js";
import { Player } from "./Player.js";
export function App() {
    return (createElement(VStack, { backgroundColor: [0, 0, 0, 1] },
        createElement(Main, null),
        createElement(Player, null)));
}
export const appState = new State({
    selected: "",
});
