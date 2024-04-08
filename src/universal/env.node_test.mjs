import { strict as assert } from 'node:assert';
import {
  describe,
  test,
} from 'node:test';

import { getEnv } from './env.mjs';

describe("getEnv", () => {
  test("should return the value from Environment variable", () => {
    process.env.TEST_KEY = "test value";

    assert.equal(getEnv("TEST_KEY"), "test value");
  });
  test("should return undefined if the Environment variable is not set", () => {
    assert.equal(getEnv("UNDEFINED_KEY"), undefined);
  });
});
