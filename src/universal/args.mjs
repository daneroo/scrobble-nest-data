/**
 * This function abstracts the retrieval of command-line arguments across different JavaScript runtimes.
 * It ensures compatibility with Node.js, Deno, and Bun.
 * @returns {string[]} An array of command-line arguments (excluding the runtime and script path arguments).
 */
export function getCommandLineArgs() {
  if (typeof process !== "undefined") {
    // Node.js and potentially Bun
    return process.argv.slice(2);
  } else if (typeof Deno !== "undefined") {
    // Deno
    return Deno.args;
  }
  throw new Error("Unsupported runtime");
}
