// Assuming writeFile and readFile are compatible with Deno's API.
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import { getEnv } from './env.mjs';

Deno.test("getEnv - should return the value from Environment variable", () => {
  Deno.env.set("TEST_KEY", "test value");
  assertEquals(getEnv("TEST_KEY"), "test value");
});
Deno.test(
  "getEnv - should return undefined if the Environment variable is not set",
  () => {
    assertEquals(getEnv("UNDEFINED_KEY"), undefined);
  }
);
