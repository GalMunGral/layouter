import { HStack } from "../HStack.js";
import { Text } from "../Text.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
import { Controls } from "./Controls.js";
import { Icon } from "./Icon.js";
import { Info } from "./Info.js";
export function Player() {
    return (createElement(HStack, { backgroundColor: [24, 24, 24, 1], dimension: [Infinity, 90] },
        createElement(Info, null),
        createElement(Progress, null),
        createElement(Controls, null)));
}
function ProgreeBar() {
    return (createElement(HStack, { weight: 0, dimension: [Infinity, 36], margin: [8, -1, 16, -1] },
        createElement(Text, { color: [106, 106, 106, 1], margin: [-1, -1, -1, -1], dimension: [20, 10], fontSize: 10, fontFamily: "Helvetica" }, "3:08"),
        createElement(HStack, { weight: 1, borderRadius: [2, 2, 2, 2], dimension: [304, 6], margin: [-1, -1, -1, -1] },
            createElement(VStack, { weight: 1, margin: [0, 0, 0, 0], backgroundColor: [29, 185, 84, 1] }),
            createElement(VStack, { weight: 3, margin: [1, 0, 1, 0], backgroundColor: [255, 255, 255, 1] })),
        createElement(Text, { color: [106, 106, 106, 1], margin: [-1, -1, -1, -1], dimension: [20, 10], fontSize: 10, fontFamily: "Helvetica" }, "3:08")));
}
function Progress() {
    return (createElement(VStack, { weight: 1, dimension: [380, Infinity], margin: [0, -1, 0, -1] },
        createElement(Buttons, null),
        createElement(ProgreeBar, null)));
}
function Buttons() {
    return (createElement(HStack, { weight: 1, margin: [16, 80, 8, 80] },
        createElement(Icon, { paths: [
                {
                    width: 16,
                    height: 16,
                    d: "M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356a2.25 2.25 0 011.724-.804h1.947l-1.017 1.018a.75.75 0 001.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 00.39 3.5z",
                },
                {
                    width: 16,
                    height: 16,
                    d: "M7.5 10.723l.98-1.167.957 1.14a2.25 2.25 0 001.724.804h1.947l-1.017-1.018a.75.75 0 111.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 11-1.06-1.06L13.109 13H11.16a3.75 3.75 0 01-2.873-1.34l-.787-.938z",
                },
            ] }),
        createElement(Icon, { paths: [
                {
                    width: 16,
                    height: 16,
                    d: "M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z",
                },
            ] }),
        createElement(Icon, { paths: [
                {
                    width: 16,
                    height: 16,
                    d: "M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z",
                },
            ] }),
        createElement(Icon, { paths: [
                {
                    width: 16,
                    height: 16,
                    d: "M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z",
                },
            ] }),
        createElement(Icon, { paths: [
                {
                    width: 16,
                    height: 16,
                    d: "M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z",
                },
            ] })));
}
