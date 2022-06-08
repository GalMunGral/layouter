import { HStack } from "../HStack.js";
import { createElement } from "../util.js";
import { VScroll } from "../VScroll.js";
import { VStack } from "../VStack.js";
import { Menu } from "./Menu.js";
import { Section } from "./Section.js";

export function Main() {
  return (
    <HStack margin={[0, 0, 0, 0]} weight={1}>
      <Menu />
      <VScroll
        weight={1}
        margin={[0, 0, 0, 0]}
        backgroundColor={[40, 40, 40, 1]}
        data={[
          { id: "1", title: "Recently played" },
          { id: "1", title: "Uniquely yours" },
          { id: "1", title: "Fresh new music" },
        ]}
        renderItem={({ title }) => {
          return <Section title={title} />;
        }}
      />
    </HStack>
  );
}
