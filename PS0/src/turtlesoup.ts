import { Turtle, SimpleTurtle, Point, Color } from "./turtle";
import * as fs from "fs";
import { execSync } from "child_process";

/**
 * Draws a square of the given side length using the turtle.
 * @param turtle The turtle to use for drawing.
 * @param sideLength The length of each side of the square in pixels.
 */
export function drawSquare(turtle: Turtle, sideLength: number): void {
  for (let i = 0; i < 4; i++) {
    turtle.forward(sideLength);
    turtle.turn(90);
  }
}


/**
 * Calculates the length of a chord of a circle.
 * Read the specification comment above it carefully in the problem set description.
 * @param radius Radius of the circle.
 * @param angleInDegrees Angle subtended by the chord at the center of the circle (in degrees).
 * @returns The length of the chord.
 */
export function chordLength(radius: number, angleInDegrees: number): number {
  // TODO: Implement chordLength
    const angleInRadians = (Math.PI / 180) * angleInDegrees;
    return 2 * radius * Math.sin(angleInRadians / 2);
  }


/**
 * Draws an approximate circle using the turtle.
 * Use your implementation of chordLength.
 * @param turtle The turtle to use.
 * @param radius The radius of the circle.
 * @param numSides The number of sides to approximate the circle with (e.g., 360 for a close approximation).
 */
export function drawApproximateCircle(
  turtle: Turtle,
  radius: number,
  numSides: number
): void {
  // TODO: Implement drawApproximateCircle
  const angle = 360 / numSides;
  const sideLength = chordLength(radius, angle);

  for (let i = 0; i < numSides; i++) {
    turtle.forward(sideLength);
    turtle.turn(angle);
  }
}

/**
 * Calculates the distance between two points.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance between p1 and p2.
 */
export function distance(p1: Point, p2: Point): number {
  // TODO: Implement distance
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/**
 * Finds a path (sequence of turns and moves) for the turtle to visit a list of points in order.
 * You should use your distance method as appropriate.
 * @param turtle The turtle to move.
 * @param points An array of points to visit in order.
 * @returns An array of instructions (e.g., strings like "forward 10", "turn 90") representing the path.
 *          This is simplified for Problem Set 0 and we won't actually use these instructions to drive the turtle directly in this starter code.
 *          The function primarily needs to *calculate* the path conceptually.
 */
export function findPath(turtle: Turtle, points: Point[]): string[] {
  // TODO: Implement findPath (conceptually, you don't need to *execute* the path here)
  const instructions: string[] = [];

  for (const point of points) {
    const currentPos = turtle.getPosition();
    const dx = point.x - currentPos.x;
    const dy = point.y - currentPos.y;
    const distanceToMove = distance(currentPos, point);
    const angleToTurn = Math.atan2(dy, dx) * (180 / Math.PI);

    instructions.push(`turn ${angleToTurn - turtle.getHeading()}`);
    instructions.push(`forward ${distanceToMove}`);
  }

  return instructions;
}

/**
 * Draws your personal art using the turtle.
 * Be creative and implement something interesting!
 * Use at least 20 lines of non-repetitive code.
 * You may use helper methods, loops, etc., and the `color` method of the Turtle.
 * @param turtle The turtle to use.
 */
export function drawPersonalArt(turtle: Turtle): void {
  // TODO: Implement drawPersonalArt
  // Example - replace with your own art!
  turtle.color("green"); // Set turtle color to green
  for (let i = 0; i < 6; i++) {
    turtle.forward(50);
    turtle.turn(60);
  }
}

function generateHTML(
  pathData: { start: Point; end: Point; color: Color }[]
): string {
  const canvasWidth = 500;
  const canvasHeight = 500;
  const scale = 1; // Adjust scale as needed
  const offsetX = canvasWidth / 2; // Center the origin
  const offsetY = canvasHeight / 2; // Center the origin

  let pathStrings = "";
  for (const segment of pathData) {
    const x1 = segment.start.x * scale + offsetX;
    const y1 = segment.start.y * scale + offsetY;
    const x2 = segment.end.x * scale + offsetX;
    const y2 = segment.end.y * scale + offsetY;
    pathStrings += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${segment.color}" stroke-width="2"/>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
    <title>Turtle Graphics Output</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <svg width="${canvasWidth}" height="${canvasHeight}" style="background-color:#f0f0f0;">
        ${pathStrings}
    </svg>
</body>
</html>`;
}

function saveHTMLToFile(
  htmlContent: string,
  filename: string = "output.html"
): void {
  fs.writeFileSync(filename, htmlContent);
  console.log(`Drawing saved to ${filename}`);
}

function openHTML(filename: string = "output.html"): void {
  try {
    // For macOS
    execSync(`open ${filename}`);
  } catch {
    try {
      // For Windows
      execSync(`start ${filename}`);
    } catch {
      try {
        // For Linux
        execSync(`xdg-open ${filename}`);
      } catch {
        console.log("Could not open the file automatically");
      }
    }
  }
}

export function main(): void {
  const turtle = new SimpleTurtle();

  // Example Usage - Uncomment functions as you implement them

  // Draw a square
  drawSquare(turtle, 100);

  // Example chordLength calculation (for testing in console)
  console.log("Chord length for radius 5, angle 60 degrees:", chordLength(5, 60));

  // Draw an approximate circle
  drawApproximateCircle(turtle, 50, 360);

  // Example distance calculation (for testing in console)
  const p1: Point = {x: 1, y: 2};
  const p2: Point = {x: 4, y: 6};
  console.log("Distance between p1 and p2:", distance(p1, p2));

  // Example findPath (conceptual - prints path to console)
  const pointsToVisit: Point[] = [{x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}];
  const pathInstructions = findPath(turtle, pointsToVisit);
  console.log("Path instructions:", pathInstructions);

  // Draw personal art
  drawPersonalArt(turtle);

  const htmlContent = generateHTML((turtle as SimpleTurtle).getPath()); // Cast to access getPath
  saveHTMLToFile(htmlContent);
  openHTML();
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
