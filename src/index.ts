import { Display } from "./Display.js";
import { HScroll } from "./HScroll.js";
import { HStack } from "./HStack.js";
import { Text } from "./Text.js";
import { LayoutView } from "./View.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";
import { initFonts } from "./Font.js";

initFonts([
  { src: "fonts/NotoSans.svg", type: "svg", name: "Noto Sans" },
  { src: "fonts/ComputerModern.svg", type: "svg", name: "Computer Modern" },
  { src: "fonts/Trattatello.svg", type: "svg", name: "Trattatello" },
]).then(() => {
  const VList = (size: number) =>
    new VScroll(
      {
        weight: 100,
        margin: [20, 20, 20, 20],
        backgroundColor: "gray",
      },
      Array(size)
        .fill(0)
        .flatMap((_, i) => [
          new Text("Noto Sans " + 2 * i, {
            font: "Noto Sans",
            backgroundColor: "#ffcccc",
            dimension: [Infinity, 50],
            margin: [10, 10, 0, 10],
          }),
          new Text("Computer Modern " + (2 * i + 1), {
            font: "Computer Modern",
            backgroundColor: "#ccccff",
            dimension: [Infinity, 50],
            margin: [10, 10, 0, 10],
          }),
        ])
    );

  const HList = (size: number) =>
    new HScroll(
      {
        margin: [0, 0, 0, 0],
        backgroundColor: "gray",
        weight: 100,
      },
      Array(size)
        .fill(0)
        .map(
          (_, i) =>
            new VStack(
              {
                dimension: [200, Infinity],
                margin: [10, 0, 10, 10],
                backgroundColor: "black",
              },
              [
                new Text("Trattatello " + i, {
                  font: "Trattatello",
                  dimension: [Infinity, 40],
                  margin: [0, 0, 0, 0],
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
        weight: 200,
        margin: [0, 0, 0, 0],
        backgroundColor: "gray",
      },
      Array(size)
        .fill(0)
        .map(
          (_, i) =>
            new HScroll(
              {
                dimension: [Infinity, 300],
                margin: [10, 10, 10, 10],
                backgroundColor: "#dddddd",
              },
              Array(100)
                .fill(0)
                .map(
                  (_, i) =>
                    new VStack(
                      {
                        dimension: [400, Infinity],
                        margin: [10, 0, 10, 10],
                        backgroundColor: "#ffeeee",
                      },
                      [VList(size)]
                    )
                )
            )
        )
    );

  const fibonacciList = (width: number) => {
    const children = new Array<LayoutView<any>>();
    let a = 1;
    let b = 1;
    let brightness = 0;
    while (b < 100) {
      children.push(
        new Text(`Here is some text and the next fib number is ${b}`, {
          margin: [2, 40, 2, 40],
          weight: b,
          font: "Trattatello",
          color: `rgb(${255 - brightness}, ${255 - brightness}, ${
            255 - brightness
          })`,
          backgroundColor: `rgb(${brightness}, ${brightness}, ${brightness})`,
        })
      );
      [a, b] = [b, a + b];
      brightness = Math.min(255, brightness + b);
    }
    return new VStack(
      {
        dimension: [width, Infinity],
        weight: 20,
        margin: [0, 0, 0, 0],
        backgroundColor: "#ffaaaa",
      },
      children
    );
  };

  new Display(
    new HStack(
      {
        dimension: [10, 10],
        backgroundColor: "black",
      },
      [
        fibonacciList(200),
        new VStack(
          {
            weight: 200,
            margin: [0, 0, 0, 0],
          },
          [HList(100), VList2(10)]
        ),
      ]
    )
  );
});
