import { HStack } from "../HStack.js";
import { Image } from "../Image.js";
import { Path } from "../Path.js";
import { Text } from "../Text.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
import { appState } from "./App.js";
export function Info() {
    return (createElement(HStack, { dimension: [300, Infinity], margin: [16, 16, 16, 16] },
        createElement(Image, { dimension: [56, 56], url: appState.get("url"), objectFit: "cover" }),
        createElement(VStack, { weight: 1, margin: [12, 16, 12, 16] },
            createElement(Text, { textAlign: "start", weight: 1, dimension: [Infinity, 12], fontSize: 12, fontWeight: 600, color: [255, 255, 255, 1] }, appState.get("title")),
            createElement(Text, { textAlign: "start", weight: 1, fontWeight: 300, dimension: [Infinity, 11], fontSize: 10, color: [255, 255, 255, 1] }, appState.get("description").$((v) => v.slice(0, 20)))),
        createElement(Path, { dimension: [16, 16], color: [255, 255, 255, 1], paths: [
                {
                    width: 16,
                    height: 16,
                    d: "M1.69 2A4.582 4.582 0 018 2.023 4.583 4.583 0 0111.88.817h.002a4.618 4.618 0 013.782 3.65v.003a4.543 4.543 0 01-1.011 3.84L9.35 14.629a1.765 1.765 0 01-2.093.464 1.762 1.762 0 01-.605-.463L1.348 8.309A4.582 4.582 0 011.689 2zm3.158.252A3.082 3.082 0 002.49 7.337l.005.005L7.8 13.664a.264.264 0 00.311.069.262.262 0 00.09-.069l5.312-6.33a3.043 3.043 0 00.68-2.573 3.118 3.118 0 00-2.551-2.463 3.079 3.079 0 00-2.612.816l-.007.007a1.501 1.501 0 01-2.045 0l-.009-.008a3.082 3.082 0 00-2.121-.861z",
                },
            ] })));
}
