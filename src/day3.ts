import { fetchInput } from "./fetchInput";
import { strict as assert } from "assert";

type Input = {
  bitCount: number;
  numbers: number[];
};

function parseInput(input: string): Input {
  const lines = input.trim().split("\n");

  const bitCount = lines[0]?.length || 0;
  const numbers = lines.map((line) => parseInt(line, 2));
  return { bitCount, numbers };
}

function getFrequencies(input: Input) {
  const frequencies: number[] = new Array(input.bitCount);

  for (const number of input.numbers) {
    for (let i = 0; i < input.bitCount; i += 1) {
      const bit = (number >> (input.bitCount - i - 1)) & 1;
      frequencies[i] ??= 0;
      frequencies[i] += bit === 1 ? 1 : 0;
    }
  }

  return frequencies;
}

function solvePart1(input: Input) {
  const frequencies = getFrequencies(input);

  const gamma = parseInt(
    frequencies.reduce((accumulator, frequency) => {
      return `${accumulator}${frequency >= input.numbers.length / 2 ? 1 : 0}`;
    }, ""),
    2
  );

  const epsilon = parseInt(
    frequencies.reduce((accumulator, frequency) => {
      return `${accumulator}${frequency >= input.numbers.length / 2 ? 0 : 1}`;
    }, ""),
    2
  );

  return gamma * epsilon;
}

function solvePart2(input: Input) {
  const ratings: [number, number] = [0, 0];

  for (let i = 0; i < 2; i += 1) {
    let numbers = [...input.numbers];

    for (let x = 0; x < input.bitCount; x += 1) {
      const frequencies = getFrequencies({ bitCount: input.bitCount, numbers });

      const bitMatch =
        i === 0
          ? frequencies[x]! >= numbers.length / 2
            ? 1
            : 0
          : frequencies[x]! < numbers.length / 2
          ? 1
          : 0;

      numbers = numbers.filter((number) => {
        const bit = (number >> (input.bitCount - x - 1)) & 1;
        return bit === bitMatch;
      });

      if (numbers.length === 1) break;
    }

    assert.notEqual(numbers[0], undefined);
    ratings[i] = numbers[0]!;
  }

  return ratings[0] * ratings[1];
}

const example = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`;

export async function execute() {
  const exampleInput = parseInput(example);

  assert.equal(solvePart1(exampleInput), 198);
  assert.equal(solvePart2(exampleInput), 230);

  const inputString = await fetchInput(3);
  const input = parseInput(inputString);
  console.log("Part 1:", solvePart1(input));
  console.log("Part 2:", solvePart2(input));
}
