import { Image } from "../Image.js";
import { Text } from "../Text.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
export function Card({ url }) {
    return (createElement(VStack, { dimension: [160, 240], margin: [20, 20, 20, 20], backgroundColor: [24, 24, 24, 1], borderRadius: [8, 8, 8, 8], shadowColor: [0, 0, 0, 1], shadowOffset: [2, 2], shadowBlur: 10 },
        createElement(Image, { dimension: [150, 150], margin: [16, 16, 16, 16], borderRadius: [4, 4, 4, 4], objectFit: "cover", url: url }),
        createElement(Text, { dimension: [Infinity, 28], margin: [6, 16, 6, 16], color: [255, 255, 255, 1], fontFamily: "Helvetica", fontSize: 16, textAlign: "start", fontWeight: 800 }, "Daily Mix 2"),
        createElement(Text, { dimension: [Infinity, 28], color: [179, 179, 179, 1], margin: [0, 16, -1, 16], fontFamily: "Helvetica", fontSize: 14, textAlign: "start", fontWeight: 500 }, "Some description here, etc, etc...")));
}
