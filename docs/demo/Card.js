import { Image } from "../Image.js";
import { Text } from "../Text.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
import { appState } from "./App.js";
export function Card({ id, url }) {
    const selected = appState.$(["selected"], (v) => v == id);
    return (createElement(VStack, { dimension: [206, 284], margin: [20, 20, 20, 20], backgroundColor: selected.$((v) => v ? [50, 50, 50, 1] : [24, 24, 24, 1]), borderRadius: [8, 8, 8, 8], shadowColor: selected.$((v) => (v ? [0, 0, 0, 0.5] : [0, 0, 0, 1])), shadowOffset: [2, 2], shadowBlur: 10, onClick: () => appState.set("selected", id) },
        createElement(Image, { dimension: [190, 190], margin: [16, 16, 16, 16], borderRadius: [4, 4, 4, 4], objectFit: "cover", url: url }),
        createElement(Text, { dimension: [Infinity, 28], margin: [6, 16, 6, 16], color: [255, 255, 255, 1], fontFamily: "Helvetica", fontSize: 16, textAlign: "start", fontWeight: 800 }, "Daily Mix 2"),
        createElement(Text, { dimension: [Infinity, 28], color: [179, 179, 179, 1], margin: [0, 16, -1, 16], fontFamily: "Helvetica", fontSize: 14, textAlign: "start", fontWeight: 500 }, "Some description here, etc, etc...")));
}
