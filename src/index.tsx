import { Display } from "./Display.js";
import { HScroll } from "./HScroll.js";
import { HStack } from "./HStack.js";
import { Text, StyleConfig } from "./Text.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";
import { initFonts } from "./Font.js";
import { ViewConfig } from "./View.js";
import { Observable } from "./Observable.js";

function Test<T>(type: new (p: T) => any, props: T, ...children: any[]) {
  return new type({ ...props, children });
}

initFonts([
  { src: "fonts/PartyLET.svg", type: "svg", name: "PartyLET" },
  { src: "fonts/NotoSans.svg", type: "svg", name: "Noto Sans" },
  { src: "fonts/ComputerModern.svg", type: "svg", name: "Computer Modern" },
  { src: "fonts/Trattatello.svg", type: "svg", name: "Trattatello" },
]).then(() => {
  class VList extends VStack {
    public children;
    constructor({ size }: { size: number }) {
      super({ weight: 100, margin: [20, 20, 20, 20] });
      this.children = [
        <VScroll margin={[0, 0, 0, 0]} backgroundColor="gray">
          {...Array(size)
            .fill(0)
            .flatMap(() => [
              <VStack
                backgroundColor="#ffcccc"
                dimension={[Infinity, 50]}
                margin={[10, 10, 0, 10]}
              />,
              <VStack
                backgroundColor="#ccccff"
                dimension={[Infinity, 50]}
                margin={[10, 10, 0, 10]}
              />,
            ])}
        </VScroll>,
      ];
    }
  }

  class HList extends VStack {
    public children;
    constructor({ size }: { size: number }) {
      super({ margin: [0, 0, 0, 0], weight: 100 });
      this.children = [
        <HScroll margin={[0, 0, 0, 0]} backgroundColor="gray">
          {...Array(size)
            .fill(0)
            .map((_, i) => (
              <VStack
                dimension={[200, Infinity]}
                margin={[10, 0, 10, 10]}
                backgroundColor="black"
              >
                <Text
                  font="Computer Modern"
                  dimension={[Infinity, 40]}
                  margin={[0, 0, 0, 0]}
                  backgroundColor="white"
                  weight={0}
                >
                  {"Computer Modern " + i}
                </Text>
                <VList size={size} />
              </VStack>
            ))}
        </HScroll>,
      ];
    }
  }

  class VList2 extends VStack {
    public children;
    constructor({ size }: { size: number }) {
      super({ weight: 200, margin: [0, 0, 0, 0] });
      this.children = [
        <VScroll margin={[0, 0, 0, 0]} backgroundColor="gray">
          {...Array(size)
            .fill(0)
            .map((_) => (
              <HScroll
                dimension={[Infinity, 300]}
                margin={[10, 10, 10, 10]}
                backgroundColor="#dddddd"
              >
                {...Array(100)
                  .fill(0)
                  .map((_, i) => (
                    <VStack
                      dimension={[400, Infinity]}
                      margin={[10, 0, 10, 10]}
                      backgroundColor="#ffeeee"
                    >
                      <VList size={size} />
                    </VStack>
                  ))}
              </HScroll>
            ))}
        </VScroll>,
      ];
    }
  }

  const ipsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  class FancyText extends Text {
    constructor(config: ViewConfig) {
      super({
        ...config,
        color: new Observable((f) => {
          let i = 0;
          setInterval(() => {
            i++;
            f(
              `rgb(${Math.sin(0.05 * i) * 256}, ${Math.sin(0.06 * i) * 256}, ${
                Math.sin(0.07 * i) * 256
              })`
            );
          }, 16);
        }),
      });
    }
  }

  class FibVStack extends VStack {
    constructor(config: ViewConfig) {
      super(config);
      this.init();
    }
    private init() {
      let n = 1;
      let a = 1;
      let b = 1;
      let brightness = 0;
      let timer = setInterval(() => {
        this.children.push(
          <Text
            margin={[2, 40, 2, 40]}
            weight={b}
            size={0.01 * n}
            font="Noto Sans"
            color={`rgb(${255 - brightness}, ${255 - brightness}, ${
              255 - brightness
            }`}
            backgroundColor={`rgb(${brightness}, ${brightness}, ${brightness})`}
          >
            the {n}-th fibonacci number is {b}
          </Text>
        );
        [a, b] = [b, a + b];
        ++n;
        brightness = Math.min(255, brightness + b);
        if (b > 100) clearInterval(timer);
      }, 100);
    }
  }

  new Display(
    (
      <HStack dimension={[10, 10]} backgroundColor="black">
        <VStack weight={50} margin={[0, 0, 0, 0]}>
          <FancyText font="PartyLET" size={30} margin={[10, 10, 0, 10]}>
            {ipsum}
          </FancyText>
          <Text font="Trattatello" size={30} margin={[10, 10, 0, 10]}>
            {ipsum}
          </Text>
          <Text font="Noto Sans" size={30} margin={[10, 10, 0, 10]}>
            {ipsum}
          </Text>
        </VStack>
        <FibVStack
          dimension={[200, Infinity]}
          weight={5}
          margin={[0, 0, 0, 0]}
          backgroundColor="#ffaaaa"
        />
        <VStack weight={200} margin={[0, 0, 0, 0]}>
          <HList size={20} />
          <VList2 size={10} />
        </VStack>
      </HStack>
    )
  );
});
