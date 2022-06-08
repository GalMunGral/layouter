import { HStack } from "../HStack.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
import { Menu } from "./Menu.js";

export function Main() {
  return (
    <HStack>
      <Menu />
      <VStack backgroundColor={[83, 83, 83, 1]}></VStack>
    </HStack>
  );
}
