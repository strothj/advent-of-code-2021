type FetchErrorOptions = {
  innerError?: unknown;
  message?: string;
  statusCode?: number | undefined;
  statusMessage?: string | undefined;
};

// https://stackoverflow.com/a/42755876
export class FetchError extends Error {
  readonly innerError: unknown;

  constructor({
    innerError,
    message,
    statusCode,
    statusMessage,
  }: FetchErrorOptions) {
    const composedMessage = `Fetch failed: ${[
      statusCode,
      statusMessage,
      message,
    ]
      .filter((messageSegment) => !!messageSegment)
      .join(": ")}`;
    super(composedMessage);

    this.name = this.constructor.name;
    this.innerError = innerError;

    if (!(innerError instanceof Error) || !innerError.stack) return;

    const messageLineCount = (this.message.match(/\n/g) || []).length + 1;
    this.stack = (this.stack || "")
      .split("\n")
      .slice(0, messageLineCount + 1)
      .join("\n")
      .concat("\n", innerError.stack);
  }
}
