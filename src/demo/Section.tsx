import { HScroll } from "../HScroll.js";
import { Text } from "../Text.js";
import { VStack } from "../VStack.js";
import { Card } from "./Card.js";
import { Observable } from "../Observable.js";
import { createElement } from "../util.js";

type SectionConfig = {
  title: string;
  async?: boolean;
};
export function Section({ async, title }: SectionConfig) {
  return (
    <VStack dimension={[Infinity, 400]}>
      <Text
        dimension={[Infinity, 64]}
        margin={[20, 20, 20, 20]}
        textAlign="start"
        fontSize={24}
        fontWeight={600}
        color={[255, 255, 255, 1]}
      >
        {title}
      </Text>
      <HScroll
        dimension={[Infinity, 300]}
        data={async ? loadAlbumsAsync(title) : loadAlbums(title)}
        renderItem={({ url, id, title, description }) => {
          return (
            <Card id={id} url={url} title={title} description={description} />
          );
        }}
      />
    </VStack>
  );
}

function loadAlbumsAsync(sectionId: string) {
  function timeout(n: number) {
    return new Promise<void>((res) => {
      setTimeout(() => res(), n);
    });
  }
  return new Observable<
    Array<{ id: string; url: string; title: string; description: string }>
  >((f) => {
    (async () => {
      for (let n = 1; n <= 10; ++n) {
        f(
          Array(n)
            .fill(0)
            .map((_, i) => ({
              id: sectionId + i,
              url:
                i % 2
                  ? "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default"
                  : "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",

              title: `Daily Mix ${i + 1}`,
              description: `This is playlist #${i + 1}`,
            }))
            .reverse()
        );
        await timeout(1000);
      }
    })();
    return () => {};
  });
}

function loadAlbums(sectionId: string) {
  return new Observable<
    Array<{ id: string; url: string; title: string; description: string }>
  >((f) => {
    f(
      Array(10)
        .fill(0)
        .map((_, i) => ({
          id: sectionId + i,
          url:
            i % 2
              ? "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default"
              : "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",

          title: `Daily Mix ${i + 1}`,
          description: `This is playlist #${i + 1}`,
        }))
    );
    return () => {};
  });
}
