import { fetchInput } from "./fetchInput";

export async function execute() {
  const input = await fetchInput(1);

  const numbers = input.split("\n").map((line) => parseInt(line, 10));

  let increases = 0;
  let previousNumber = Infinity;
  for (const number of numbers) {
    if (number > previousNumber) increases++;
    previousNumber = number;
  }

  console.log("Part 1:", increases);
}
