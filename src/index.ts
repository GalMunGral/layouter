import { Display } from "./Display.js";
import { HScroll } from "./HScroll.js";
import { HStack } from "./HStack.js";
import { Text } from "./Text.js";
import { LayoutView } from "./View.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";
import { initFonts } from "./Font.js";

initFonts([
  { src: "fonts/PartyLET.svg", type: "svg", name: "PartyLET" },
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
          new VStack({
            backgroundColor: "#ffcccc",
            dimension: [Infinity, 50],
            margin: [10, 10, 0, 10],
          }),
          new VStack({
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
                new Text("Computer Modern " + i, {
                  font: "Computer Modern",
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

  const fibonacciList = () => {
    const children = new Array<LayoutView<any>>();
    let n = 1;
    let a = 1;
    let b = 1;
    let brightness = 0;
    while (b < 100) {
      children.push(
        new Text(`the ${n}-th fibonacci number is ${b}`, {
          margin: [2, 40, 2, 40],
          weight: b,
          size: 0.25 * n ** 2,
          font: "Noto Sans",
          color: `rgb(${255 - brightness}, ${255 - brightness}, ${
            255 - brightness
          })`,
          backgroundColor: `rgb(${brightness}, ${brightness}, ${brightness})`,
        })
      );
      [a, b] = [b, a + b];
      ++n;
      brightness = Math.min(255, brightness + b);
    }
    return new VStack(
      {
        dimension: [200, Infinity],
        weight: 5,
        margin: [0, 0, 0, 0],
        backgroundColor: "#ffaaaa",
      },
      children
    );
  };

  const ipsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  new Display(
    new HStack(
      {
        dimension: [10, 10],
        backgroundColor: "black",
      },
      [
        new VStack(
          {
            weight: 50,
            margin: [0, 0, 0, 0],
          },
          [
            new Text(ipsum, {
              font: "PartyLET",
              size: 30,
              margin: [10, 10, 0, 10],
            }),
            new Text(ipsum, {
              font: "Trattatello",
              size: 30,
              margin: [10, 10, 0, 10],
            }),
            new Text(ipsum, {
              size: 30,
              font: "Noto Sans",
              margin: [10, 10, 0, 10],
            }),
          ]
        ),
        fibonacciList(),
        new VStack(
          {
            weight: 200,
            margin: [0, 0, 0, 0],
          },
          [HList(20), VList2(10)]
        ),
      ]
    )
  );
});
