import {
  describe,
  expect,
  test,
} from 'bun:test';

import { getEnv } from './env.mjs';

describe("getEnv", () => {
  test("should return the value from Environment variable", () => {
    process.env.TEST_KEY = "test value";
    expect(getEnv("TEST_KEY")).toEqual("test value");
  });
  test("should return undefined if the Environment variable is not set", () => {
    expect(getEnv("UNDEFINED_KEY")).toBeUndefined();
  });
});
