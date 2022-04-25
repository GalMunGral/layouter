import { HStack } from "./HStack.js";
import { Rect } from "./Rect.js";
import { View } from "./View.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";

function init(): CanvasRenderingContext2D {
  document.body.style.margin = "0px";
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.append(canvas);
  return canvas.getContext("2d")!;
}

const ctx = init();

const test = new HStack(
  {
    dimensions: [10, 10],
    backgroundColor: "black",
  },
  [
    new View({
      margin: [5, 5, 5, 5],
      backgroundColor: "green",
    }),
    new VStack(
      {
        dimensions: [10, 10],
        margin: [0, 0, 0, 0],
        backgroundColor: "gray",
      },
      [
        new View({
          margin: [5, 5, 0, 5],
          weight: 2,
          backgroundColor: "white",
        }),
        new View({
          margin: [5, 5, 0, 5],
          weight: 2,
          backgroundColor: "white",
        }),
        new View({
          margin: [5, 5, 5, 5],
          weight: 10,
          backgroundColor: "white",
        }),
      ]
    ),
    new VScroll(
      {
        weight: 4,
        margin: [20, 20, 20, 20],
        backgroundColor: "blue",
      },
      Array(20)
        .fill(0)
        .flatMap(() => [
          new View({
            backgroundColor: "#9999ff",
            dimensions: [Infinity, 20],
            margin: [-1, 10, -1, 10],
          }),
          new View({
            backgroundColor: "#ff9999",
            dimensions: [Infinity, 20],
            margin: [-1, 10, -1, 10],
          }),
        ])
    ),
  ]
);

test.frame = new Rect(0, 0, 1000, 500);
test.layout();
test.draw(ctx);

console.log(test);
