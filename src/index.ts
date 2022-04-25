import { Rect } from "./Rect.js";
import { View } from "./View.js";

function init(): CanvasRenderingContext2D {
  document.body.style.margin = "0px";
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.append(canvas);
  return canvas.getContext("2d")!;
}

const ctx = init();

const test = new View(
  {
    type: "stack",
    direction: "horizontal",
    dimensions: [10, 10],
    backgroundColor: "black",
  },
  [
    new View({
      margin: [20, 10, 20, 10],
      backgroundColor: "green",
    }),
    new View(
      {
        type: "stack",
        dimensions: [10, 10],
        margin: [0, 0, 0, 0],
        backgroundColor: "red",
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
    new View({
      margin: [10, 10, 10, 10],
      backgroundColor: "blue",
    }),
  ]
);

test.frame = new Rect(0, 0, 300, 300);
test.layout();
test.draw(ctx);

console.log(test);
