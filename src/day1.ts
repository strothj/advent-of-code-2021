import { fetchInput } from "./fetchInput";
import { strict as assert } from "assert";

function solvePart1(numbers: number[]) {
  let increases = 0;
  let previousNumber = Infinity;

  for (const number of numbers) {
    if (number > previousNumber) increases++;
    previousNumber = number;
  }

  return increases;
}

function solvePart2(numbers: number[]) {
  let increases = 0;

  for (let i = 0; i < numbers.length; i += 3) {
    let lastSum = Infinity;

    for (let x = 0; x < 4; x += 1) {
      let sum = 0;

      for (let y = 0; y < 3; y += 1) {
        sum += numbers[i + x + y] || 0;
      }

      if (sum > lastSum) increases++;
      lastSum = sum;
    }
  }

  return increases;
}

const example = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

export async function execute() {
  const input = await fetchInput(1);
  const numbers = input.split("\n").map((line) => parseInt(line, 10));

  assert.equal(solvePart1(example), 7);
  assert.equal(solvePart2(example), 5);

  console.log("Part 1:", solvePart1(numbers));
  console.log("Part 2:", solvePart2(numbers));
}
