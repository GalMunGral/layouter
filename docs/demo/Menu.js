import { HStack } from "../HStack.js";
import { State } from "../Observable.js";
import { Path } from "../Path.js";
import { Text } from "../Text.js";
import { createElement } from "../util.js";
import { VStack } from "../VStack.js";
import { Logo } from "./Logo.js";
export function Menu() {
    const state = new State({
        active: 0,
    });
    function HomeButton() {
        return (createElement(MenuButton, { color: state.$(["active"], (v) => v == 0 ? [255, 255, 255, 1] : [179, 179, 179, 1]), title: "Home", icon: {
                width: 24,
                height: 24,
                d: "M13.5 1.515a3 3 0 00-3 0L3 5.845a2 2 0 00-1 1.732V21a1 1 0 001 1h6a1 1 0 001-1v-6h4v6a1 1 0 001 1h6a1 1 0 001-1V7.577a2 2 0 00-1-1.732l-7.5-4.33z",
            }, onClick: () => state.set("active", 0) }));
    }
    function SearchButton() {
        return (createElement(MenuButton, { color: state.$(["active"], (v) => v == 1 ? [255, 255, 255, 1] : [179, 179, 179, 1]), title: "Search", icon: {
                width: 24,
                height: 24,
                d: "M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z",
            }, onClick: () => state.set("active", 1) }));
    }
    function LibraryButton() {
        return (createElement(MenuButton, { color: state.$(["active"], (v) => v == 2 ? [255, 255, 255, 1] : [179, 179, 179, 1]), title: "Your Library", icon: {
                width: 24,
                height: 24,
                d: "M14.5 2.134a1 1 0 011 0l6 3.464a1 1 0 01.5.866V21a1 1 0 01-1 1h-6a1 1 0 01-1-1V3a1 1 0 01.5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zm6 0a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1z",
            }, onClick: () => state.set("active", 2) }));
    }
    return (createElement(VStack, { weight: 0, dimension: [255, Infinity] },
        createElement(Logo, null),
        createElement(HomeButton, null),
        createElement(SearchButton, null),
        createElement(LibraryButton, null)));
}
function MenuButton({ icon, title, color, onClick }) {
    return (createElement(HStack, { weight: 0, dimension: [Infinity, 40], margin: [0, 24, 0, 24], onClick: onClick },
        createElement(Path, { weight: 0, dimension: [24, 24], margin: [-1, -1, -1, -1], color: color, paths: [icon] }),
        createElement(Text, { margin: [-1, 0, -1, 16], fontFamily: "Helvetica", fontWeight: 600, textAlign: "start", fontSize: 14, color: color, dimension: [0, 14] }, title)));
}
