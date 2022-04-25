import { Display } from "./Display.js";
import { HScroll } from "./HScroll.js";
import { HStack } from "./HStack.js";
import { Text } from "./Text.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";
const VList = (size) => new VScroll({
    weight: 100,
    margin: [20, 20, 20, 20],
    backgroundColor: "gray",
}, Array(size)
    .fill(0)
    .flatMap((_, i) => [
    new Text("ITEM " + 2 * i, {
        backgroundColor: "#ffcccc",
        dimension: [Infinity, 50],
        margin: [10, 10, 0, 10],
    }),
    new Text("ITEM " + (2 * i + 1), {
        backgroundColor: "#ccccff",
        dimension: [Infinity, 50],
        margin: [10, 10, 0, 10],
    }),
]));
const HList = (size) => new HScroll({
    margin: [0, 0, 0, 0],
    backgroundColor: "gray",
    weight: 100,
}, Array(size)
    .fill(0)
    .map((_, i) => new VStack({
    dimension: [200, Infinity],
    margin: [10, 0, 10, 10],
    backgroundColor: "black",
}, [
    new Text("TEST-" + i, {
        dimension: [Infinity, 20],
        margin: [0, 0, 0, 0],
        backgroundColor: "white",
        weight: 0,
    }),
    VList(size),
])));
const VList2 = (size) => new VScroll({
    weight: 200,
    margin: [0, 0, 0, 0],
    backgroundColor: "gray",
}, Array(size)
    .fill(0)
    .map((_, i) => new HScroll({
    dimension: [Infinity, 300],
    margin: [10, 10, 10, 10],
    backgroundColor: "#dddddd",
}, Array(100)
    .fill(0)
    .map((_, i) => new VStack({
    dimension: [400, Infinity],
    margin: [10, 0, 10, 10],
    backgroundColor: "#ffeeee",
}, [VList(size)])))));
const fibonacciList = (width) => {
    const children = [];
    let a = 1;
    let b = 1;
    let brightness = 0;
    while (b < 100) {
        children.push(new Text(String(b), {
            margin: [2, 40, 2, 40],
            weight: b,
            backgroundColor: `rgb(${brightness}, ${brightness}, ${brightness})`,
        }));
        [a, b] = [b, a + b];
        brightness = Math.min(255, brightness + b);
    }
    return new VStack({
        dimension: [width, Infinity],
        weight: 20,
        margin: [0, 0, 0, 0],
        backgroundColor: "#ffaaaa",
    }, children);
};
new Display(new HStack({
    dimension: [10, 10],
    backgroundColor: "black",
}, [
    fibonacciList(200),
    new VStack({
        weight: 200,
        margin: [0, 0, 0, 0],
    }, [HList(100), VList2(10)]),
]));
