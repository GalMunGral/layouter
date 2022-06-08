import { HScroll } from "../HScroll.js";
import { Text } from "../Text.js";
import { VStack } from "../VStack.js";
import { Card } from "./Card.js";
import { Observable } from "../Observable.js";
import { createElement } from "../util.js";

export function Section({ title }: { title: string }) {
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
        dimension={[Infinity, 700]}
        data={loadAlbums()}
        renderItem={({ url }) => {
          return <Card url={url} />;
        }}
      />
    </VStack>
  );
}

function loadAlbums() {
  return new Observable<Array<{ id: string; url: string }>>((f) => {
    f([
      {
        id: "1",
        url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default",
      },
      {
        id: "2",
        url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
      },
      {
        id: "1",
        url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default",
      },
      {
        id: "2",
        url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
      },
      {
        id: "1",
        url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default",
      },
      {
        id: "2",
        url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
      },
      {
        id: "1",
        url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebd969cf117d0b0d4424bebdc5/2/en/default",
      },
      {
        id: "2",
        url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebb99713cdd2a68b0db306aad6/3/en/default",
      },
    ]);
    return () => {};
  });
}
