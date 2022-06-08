import { HStack } from "../HStack.js";
import { Text } from "../Text.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
export function Player() {
    return (createElement(HStack, { backgroundColor: [24, 24, 24, 1], dimension: [Infinity, 90], weight: 0 },
        createElement(HStack, { dimension: [300, Infinity], margin: [16, 16, 16, 16], backgroundColor: [128, 128, 128, 1], weight: 0 }),
        createElement(VStack, { dimension: [380, Infinity], margin: [16, -1, 16, -1] },
            createElement(HStack, { dimension: [Infinity, 12], margin: [-1, -1, 4, -1] },
                createElement(Text, { color: [106, 106, 106, 1], margin: [-1, -1, -1, -1], dimension: [20, 10], fontSize: 10, fontFamily: "Helvetica" }, "3:08"),
                createElement(VStack, { borderRadius: [2, 2, 2, 2], dimension: [304, 4], margin: [-1, -1, -1, -1], backgroundColor: [255, 255, 255, 1] }),
                createElement(Text, { color: [106, 106, 106, 1], margin: [-1, -1, -1, -1], dimension: [20, 10], fontSize: 10, fontFamily: "Helvetica" }, "3:08"))),
        createElement(HStack, { dimension: [300, Infinity], margin: [16, 16, 16, 16], backgroundColor: [128, 128, 128, 1], weight: 0 })));
}
