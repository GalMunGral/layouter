var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HScroll } from "../HScroll.js";
import { Text } from "../Text.js";
import { VStack } from "../VStack.js";
import { Card } from "./Card.js";
import { Observable } from "../Observable.js";
import { createElement } from "../util.js";
export function Section({ async, title }) {
    return (createElement(VStack, { dimension: [Infinity, 400] },
        createElement(Text, { dimension: [Infinity, 64], margin: [20, 20, 20, 20], textAlign: "start", fontSize: 24, fontWeight: 600, color: [255, 255, 255, 1] }, title),
        createElement(HScroll, { dimension: [Infinity, 300], data: async ? loadAlbumsAsync(title) : loadAlbums(title), renderItem: ({ url, id, title, description }) => {
                return (createElement(Card, { id: id, url: url, title: title, description: description }));
            } })));
}
function loadAlbumsAsync(sectionId) {
    function timeout(n) {
        return new Promise((res) => {
            setTimeout(() => res(), n);
        });
    }
    return new Observable((f) => {
        (() => __awaiter(this, void 0, void 0, function* () {
            for (let n = 1; n <= 10; ++n) {
                f(Array(n)
                    .fill(0)
                    .map((_, i) => ({
                    id: sectionId + i,
                    url: i % 2
                        ? "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default"
                        : "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
                    title: `Daily Mix ${i + 1}`,
                    description: `This is playlist #${i + 1}`,
                }))
                    .reverse());
                yield timeout(1000);
            }
        }))();
        return () => { };
    });
}
function loadAlbums(sectionId) {
    return new Observable((f) => {
        f(Array(10)
            .fill(0)
            .map((_, i) => ({
            id: sectionId + i,
            url: i % 2
                ? "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default"
                : "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
            title: `Daily Mix ${i + 1}`,
            description: `This is playlist #${i + 1}`,
        })));
        return () => { };
    });
}
