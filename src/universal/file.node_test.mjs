import { strict as assert } from 'node:assert';
// import assert from 'node:assert/strict';
import { unlink } from 'node:fs/promises';
import {
  describe,
  test,
} from 'node:test';

import {
  readFile,
  writeFile,
} from './file.mjs';

// const assert = require("node:assert/strict");

describe("writeFile then readFile", () => {
  test("writes text to a file, then reads it back", async () => {
    const path = "./test.txt";
    const text = "Hello World";

    await writeFile(path, text);

    const writtenText = await readFile(path);
    assert.equal(writtenText, text);
    // Clean up
    await unlink(path);
  });
});
