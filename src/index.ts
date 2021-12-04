/**
 * @returns Which day to solve.
 */
function getDayArgument() {
  const dayArgumentString = process.argv[2];
  if (!dayArgumentString) throw new Error("No <day> argument was supplied.");

  try {
    const dayArgument = parseInt(dayArgumentString, 10);
    if (isNaN(dayArgument)) throw new Error();
    return dayArgument;
  } catch {
    throw new Error("Could not parse the <day> argument.");
  }
}

async function main() {
  let dayArgument;
  try {
    dayArgument = getDayArgument();
  } catch (error) {
    console.error("Usage: yarn start <day>");
    console.error(error);
    process.exit(1);
  }

  let daySolver: { execute: () => Promise<void> };
  try {
    daySolver = await import(`./day${dayArgument}.ts`);
  } catch (error) {
    console.error(
      `Unable to load solver for the specified day: ${dayArgument}:`,
      error
    );
    process.exit(1);
  }

  console.log(`Solving for day ${dayArgument}.`);
  try {
    await daySolver.execute();
  } catch (error) {
    console.error(`Failed to solve day: ${dayArgument}:`, error);
    process.exit(1);
  }
}

main();
