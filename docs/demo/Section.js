import { HScroll } from "../HScroll.js";
import { Text } from "../Text.js";
import { VStack } from "../VStack.js";
import { Card } from "./Card.js";
import { Observable } from "../Observable.js";
import { createElement } from "../util.js";
export function Section({ title }) {
    return (createElement(VStack, { dimension: [Infinity, 400] },
        createElement(Text, { dimension: [Infinity, 64], margin: [20, 20, 20, 20], textAlign: "start", fontSize: 24, fontWeight: 600, color: [255, 255, 255, 1] }, title),
        createElement(HScroll, { dimension: [Infinity, 300], data: loadAlbums(title), renderItem: ({ url, id }) => {
                return createElement(Card, { id: id, url: url });
            } })));
}
function loadAlbums(sectionId) {
    return new Observable((f) => {
        f([
            {
                id: sectionId + 1,
                url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default",
            },
            {
                id: sectionId + 2,
                url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
            },
            {
                id: sectionId + 3,
                url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default",
            },
            {
                id: sectionId + 4,
                url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
            },
            {
                id: sectionId + 5,
                url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default",
            },
            {
                id: sectionId + 6,
                url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
            },
            {
                id: sectionId + 7,
                url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default",
            },
            {
                id: sectionId + 8,
                url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
            },
        ]);
        return () => { };
    });
}
