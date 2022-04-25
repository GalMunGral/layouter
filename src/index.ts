import { Display } from "./Display.js";
import { HScroll } from "./HScroll.js";
import { HStack } from "./HStack.js";
import { Text } from "./Text.js";
import { View } from "./View.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";

const VList = (size: number) =>
  new VScroll(
    {
      margin: [10, 10, 10, 10],
      backgroundColor: "gray",
    },
    Array(size)
      .fill(0)
      .flatMap((_, i) => [
        new Text("ITEM " + 2 * i, {
          backgroundColor: "#ffdddd",
          dimensions: [Infinity, 50],
          margin: [10, 10, 0, 10],
        }),
        new Text("ITEM " + (2 * i + 1), {
          backgroundColor: "#ddddff",
          dimensions: [Infinity, 50],
          margin: [10, 10, 0, 10],
        }),
      ])
  );

const HList = (size: number) =>
  new HScroll(
    {
      margin: [10, 10, 10, 10],
      backgroundColor: "gray",
    },
    Array(size)
      .fill(0)
      .map(
        (_, i) =>
          new VStack(
            {
              dimensions: [200, Infinity],
              margin: [10, 0, 10, 10],
              backgroundColor: "black",
            },
            [
              new Text("TEST-" + i, {
                dimensions: [Infinity, 20],
                backgroundColor: "white",
                weight: 0,
              }),
              VList(size),
            ]
          )
      )
  );

const VList2 = (size: number) =>
  new VScroll(
    {
      weight: 2,
      margin: [10, 10, 10, 10],
      backgroundColor: "gray",
    },
    Array(size)
      .fill(0)
      .map(
        (_, i) =>
          new HStack(
            {
              dimensions: [Infinity, 200],
              margin: [10, 0, 10, 10],
              backgroundColor: "#ffffff",
            },
            [
              new HScroll(
                {
                  margin: [10, 10, 10, 10],
                  backgroundColor: "#dddddd",
                },
                Array(100)
                  .fill(0)
                  .map(
                    (_, i) =>
                      new VStack(
                        {
                          dimensions: [150, Infinity],
                          margin: [10, 0, 10, 10],
                          backgroundColor: "#bbbbbb",
                        },
                        [VList(size)]
                      )
                  )
              ),
            ]
          )
      )
  );

const fibonacciList = (width: number) => {
  const children: Array<View> = [];
  let a = 1;
  let b = 1;
  let brightness = 0;
  while (b < 100) {
    children.push(
      new View({
        margin: [2, 2, 0, 2],
        weight: b,
        backgroundColor: `rgb(${brightness}, ${brightness}, ${brightness})`,
      })
    );
    [a, b] = [b, a + b];
    brightness = Math.min(255, brightness + b);
  }
  return new VStack(
    {
      dimensions: [width, Infinity],
      margin: [0, 0, 0, 0],
      backgroundColor: "gray",
    },
    children
  );
};

new Display(
  new HStack(
    {
      dimensions: [10, 10],
      backgroundColor: "black",
    },
    [
      fibonacciList(200),
      new VStack(
        {
          weight: 10,
          margin: [0, 0, 0, 0],
        },
        [HList(100), VList2(10)]
      ),
    ]
  )
);
