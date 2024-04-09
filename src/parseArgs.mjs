/**
 * Command options definition.
 * @typedef {Object} CmdOptions
 * @property {'validate'|'weather'|'scrape'} command - The command to run.
 * @property {number} verbosity - The verbosity level.
 */

/**
 * Parses command line arguments.
 * @param {string[]} args - The command line arguments.
 * @returns {CmdOptions} The parsed command options.
 */
export function parseCommandLineArgs(args) {
  /** @type {CmdOptions} */
  const options = {
    command: "validate", // default command
    verbosity: 0, // default verbosity
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-c":
      case "--command":
        const command = args[++i];
        if (["validate", "weather", "scrape"].includes(command)) {
          options.command = command;
        } else {
          throw new Error(`Invalid command: ${command}`);
        }
        break;
      case "-v":
        options.verbosity = 1;
        break;
      case "-vv":
        options.verbosity = 2;
        break;
      case "-vvv":
        options.verbosity = 3;
        break;
      case "-h":
      case "--help":
        console.log(`
          Usage:
            -c, --command      Program command to run ('validate', 'weather', 'scrape')
            -v, -vv, -vvv      Verbosity level (more 'v's for more verbose output)
            -h, --help         Show help information

          Examples:
            command --command weather -vv  Run 'weather' command with medium verbosity
            command --help                Show usage information
        `);
        process.exit(0);
    }
  }

  return options;
}
