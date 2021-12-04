import { fetchInput } from "./fetchInput";
import { strict as assert } from "assert";

type Command = {
  delta: number;
  direction: typeof directions[number];
};

function solvePart1(commands: Command[]) {
  let horizontal = 0;
  let depth = 0;

  for (const command of commands) {
    switch (command.direction) {
      case "down": {
        depth += command.delta;
        break;
      }

      case "forward": {
        horizontal += command.delta;
        break;
      }

      case "up": {
        depth -= command.delta;
        break;
      }
    }
  }

  return horizontal * depth;
}

function solvePart2(commands: Command[]) {
  let aim = 0;
  let depth = 0;
  let horizontal = 0;

  for (const command of commands) {
    switch (command.direction) {
      case "down": {
        aim += command.delta;
        break;
      }

      case "forward": {
        depth += aim * command.delta;
        horizontal += command.delta;
        break;
      }

      case "up": {
        aim -= command.delta;
        break;
      }
    }
  }

  return depth * horizontal;
}

function isDirection(
  direction: string | undefined
): direction is Command["direction"] {
  return !!(
    direction && (directions as ReadonlyArray<string>).includes(direction)
  );
}

function parseCommands(input: string): Command[] {
  const directionRegex = /^(down|forward|up) (\d+)$/;

  const commands = input
    .split("\n")
    .map((line): Command | null => {
      const result = directionRegex.exec(line);
      if (!result) return null;

      const direction = result[1];
      if (!isDirection(direction)) return null;

      const deltaString = result[2];
      if (!deltaString) return null;
      try {
        const delta = parseInt(deltaString, 10);
        return isNaN(delta) ? null : { delta, direction };
      } catch {
        return null;
      }
    })
    .filter((command): command is Command => !!command);
  return commands;
}

const directions = ["down", "forward", "up"] as const;

const example = `forward 5
down 5
forward 8
up 3
down 8
forward 2
`;

export async function execute() {
  const input = await fetchInput(2);

  const exampleCommands = parseCommands(example);

  assert.equal(solvePart1(exampleCommands), 150);
  assert.equal(solvePart2(exampleCommands), 900);

  const commands = parseCommands(input);
  console.log("Part 1:", solvePart1(commands));
  console.log("Part 2:", solvePart2(commands));
}
