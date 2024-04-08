// Assuming writeFile and readFile are compatible with Deno's API.
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import {
  readFile,
  writeFile,
} from './file.mjs';

Deno.test("writeFile then readFile", async () => {
  const path = "./test.txt";
  const text = "Hello World";

  await writeFile(path, text);

  const writtenText = await readFile(path);
  assertEquals(writtenText, text);

  // Clean up
  await Deno.remove(path);
});
