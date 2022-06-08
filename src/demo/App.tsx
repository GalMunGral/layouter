import { State } from "../Observable.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
import { Main } from "./Main.js";
import { Player } from "./Player.js";

export function App() {
  return (
    <VStack backgroundColor={[0, 0, 0, 1]}>
      <Main />
      <Player />
    </VStack>
  );
}

export const appState = new State({
  selected: "",
});
