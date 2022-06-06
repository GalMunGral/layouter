import { Display } from "./Display.js";
import { HScroll } from "./HScroll.js";
import { HStack } from "./HStack.js";
import { Text } from "./Text.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";
import { initFonts } from "./Font.js";
import { Observable } from "./Observable.js";
function Test(type, props, ...children) {
    return new type(Object.assign(Object.assign({}, props), { children }));
}
initFonts([
    { src: "fonts/PartyLET.svg", type: "svg", name: "PartyLET" },
    { src: "fonts/NotoSans.svg", type: "svg", name: "Noto Sans" },
    { src: "fonts/ComputerModern.svg", type: "svg", name: "Computer Modern" },
    { src: "fonts/Trattatello.svg", type: "svg", name: "Trattatello" },
]).then(() => {
    class VList extends VStack {
        constructor({ size }) {
            super({ weight: 100, margin: [20, 20, 20, 20] });
            this.children = [
                Test(VScroll, { margin: [0, 0, 0, 0], backgroundColor: [128, 128, 128, 1], data: Array(size)
                        .fill(0)
                        .flatMap((_, i) => [
                        { id: String(2 * i), color: [255, 204, 204, 1] },
                        {
                            id: String(2 * i + 1),
                            color: [204, 204, 255, 1],
                        },
                    ]), renderItem: (item) => (Test(VStack, { backgroundColor: item.color, dimension: [Infinity, 50], margin: [10, 10, 0, 10] })) }),
            ];
        }
    }
    class HList extends VStack {
        constructor({ size }) {
            super({ margin: [0, 0, 0, 0], weight: 100 });
            this.children = [
                Test(HScroll, { margin: [0, 0, 0, 0], backgroundColor: [128, 128, 128, 1], data: Array(size)
                        .fill(0)
                        .map((_, i) => ({ id: String(i) })), renderItem: (i) => (Test(VStack, { dimension: [200, Infinity], margin: [10, 0, 10, 10], backgroundColor: [0, 0, 0, 1] },
                        Test(Text, { font: "Computer Modern", dimension: [Infinity, 40], margin: [0, 0, 0, 0], backgroundColor: [255, 255, 255, 1], weight: 0 }, "Computer Modern " + i.id),
                        Test(VList, { size: size }))) }),
            ];
        }
    }
    class VList2 extends VStack {
        constructor({ size }) {
            super({ weight: 200, margin: [0, 0, 0, 0] });
            this.children = [
                Test(VScroll, { margin: [0, 0, 0, 0], backgroundColor: [128, 128, 128, 1], data: Array(size)
                        .fill(0)
                        .map((_, i) => ({ id: String(i) })), renderItem: () => (Test(HScroll, { dimension: [Infinity, 300], margin: [10, 10, 10, 10], backgroundColor: [187, 187, 187, 1], data: Array(100)
                            .fill(0)
                            .map((_, i) => ({ id: String(i) })), renderItem: () => (Test(VStack, { dimension: [400, Infinity], margin: [10, 0, 10, 10], backgroundColor: [255, 238, 238, 1] },
                            Test(VList, { size: size }))) })) }),
            ];
        }
    }
    const ipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    class FancyText extends Text {
        constructor(config) {
            super(Object.assign(Object.assign({}, config), { color: new Observable((f) => {
                    let i = 0;
                    setInterval(() => {
                        i++;
                        f([
                            Math.sin(0.05 * i) * 256,
                            Math.sin(0.06 * i) * 256,
                            Math.sin(0.07 * i) * 256,
                            1,
                        ]);
                    }, 16);
                }) }));
        }
    }
    class FibVStack extends VStack {
        constructor() {
            super(...arguments);
            this.children = [
                Test(VScroll, { data: new Observable((f) => {
                        let n = 1;
                        let a = 1;
                        let b = 1;
                        let brightness = 0;
                        let data = [];
                        let timer = setInterval(() => {
                            f((data = [
                                ...data,
                                { id: String(data.length), n: b, brightness },
                            ]));
                            [a, b] = [b, a + b];
                            brightness = Math.min(255, brightness + 4 * n * n);
                            if (n > 50)
                                clearInterval(timer);
                        }, 100);
                    }), renderItem: ({ n, brightness }) => (Test(Text, { margin: [4, 40, 4, 40], dimension: [Infinity, Math.sqrt(n)], 
                        // size={Math.sqrt(n) - 10}
                        font: "Noto Sans", color: [255 - brightness, 255 - brightness, 255 - brightness, 1], backgroundColor: [brightness, brightness, brightness, 1] },
                        "fibonacci number is ",
                        n)) }),
            ];
        }
    }
    new Display((Test(HStack, { dimension: [10, 10], backgroundColor: [0, 0, 0, 1] },
        Test(VStack, { weight: 50, margin: [0, 0, 0, 0] },
            Test(FancyText, { font: "PartyLET", size: 30, margin: [10, 10, 0, 10] }, ipsum),
            Test(Text, { font: "Trattatello", size: 30, margin: [10, 10, 0, 10], backgroundColor: [255, 255, 255, 1] }, ipsum),
            Test(Text, { font: "Noto Sans", size: 30, margin: [10, 10, 0, 10], backgroundColor: [255, 255, 255, 1] }, ipsum)),
        Test(FibVStack, { dimension: [200, Infinity], weight: 5, margin: [0, 0, 0, 0], backgroundColor: [255, 170, 170, 1] }),
        Test(VStack, { weight: 200, margin: [0, 0, 0, 0] },
            Test(HList, { size: 20 }),
            Test(VList2, { size: 10 })))));
});
