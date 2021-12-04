import https from "https";
import { FetchError } from "./FetchError";
import fs from "fs/promises";
import path from "path";

export async function fetchInput(day: number) {
  try {
    const puzzleInput = await fs.readFile(
      path.resolve(__dirname, `../cache/${day}.txt`),
      "utf8"
    );
    console.log("Retrieved puzzle input from cache.");
    return puzzleInput;
  } catch {}

  let cookie: string;
  try {
    cookie = (
      await fs.readFile(path.resolve(__dirname, "../session.txt"), "utf8")
    ).trim();
  } catch (error) {
    throw new FetchError({
      innerError: error,
      message:
        'Unable to read "session.txt" in the project root. This must be supplied to provide the credentials necessary for accessing puzzle inputs.',
    });
  }

  return new Promise<string>((resolve, reject) => {
    const req = https.get(
      {
        headers: { cookie },
        host: "adventofcode.com",
        path: `/2021/day/${day}/input`,
      },
      (res) => {
        const chunks: Buffer[] = [];

        res.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        res.on("end", async () => {
          let response;

          try {
            const chunk = Buffer.concat(chunks);
            response = chunk.toString("utf8");
          } catch (error) {
            reject(
              new FetchError({
                innerError: error,
                message: "Failed to decode response chunks.",
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
              })
            );
            return;
          }

          if (
            res.statusCode &&
            (res.statusCode < 200 || res.statusCode > 299)
          ) {
            reject(
              new FetchError({
                message: response,
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
              })
            );
            return;
          }

          await fs.mkdir(path.resolve(__dirname, "../cache"), {
            recursive: true,
          });
          await fs.writeFile(
            path.resolve(__dirname, `../cache/${day}.txt`),
            response,
            "utf8"
          );

          resolve(response);
        });
      }
    );

    req.on("error", (error) => {
      reject(
        new FetchError({
          innerError: error,
        })
      );
    });

    req.end();
  });
}
