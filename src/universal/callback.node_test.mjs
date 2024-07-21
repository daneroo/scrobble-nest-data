import { strict as assert } from 'node:assert';
import {
  describe,
  test,
} from 'node:test';

import { singleCallbackServer } from './callback.mjs';

/**
 * Mock handler for incoming URL search parameters and retrieves the 'code' parameter.
 * @param {URLSearchParams} incomingURLSearchParams - The search parameters from the URL.
 * @returns {Promise<string>} - A promise that resolves to the value of the 'code' parameter.
 * @throws {Error} - Throws an error if 'code' is not found.
 */
async function callbackHandler(incomingURLSearchParams) {
  const code = incomingURLSearchParams.get("code");
  console.log(`Code:`, code);
  if (!code) {
    throw new Error("Code not found");
  }
  return code; // Return the code directly
}

describe("singleCallbackServer", () => {
  test("should get a code from the callback server", async () => {
    // Start the callback server
    const serverPromise = singleCallbackServer({
      port: 9876,
      callbackPath: "/callback",
      callbackHandler: callbackHandler,
      timeout: 30000,
    });

    // Simulate a client request to the callback URL
    const response = await fetch(`http://localhost:9876/callback?code=1234`);
    const text = await response.text();

    // Assert the server responded as expected
    assert.equal(text, "Request processed successfully");

    // Assert that the promise resolves to the correct code
    const result = await serverPromise;
    assert.equal(result, "1234");
  });

  test("should detect if the wrong callback path is called", async () => {
    // Start the callback server with a specific callback path
    const serverPromise = singleCallbackServer({
      port: 9876,
      callbackPath: "/expected-callback",
      callbackHandler: async (incomingURLSearchParams) => {
        // This should not be called if the test is correct
        throw new Error("Handler should not have been called");
      },
      timeout: 30000,
    });

    // Simulate a client request to the wrong callback URL
    const response = await fetch(
      `http://localhost:9876/wrong-callback?code=1234`
    );
    const text = await response.text();

    // Assert the server responded with a path mismatch message
    assert.equal(text, "Path mismatch");

    // Assert that the server promise rejects due to the wrong path being called
    try {
      await serverPromise;
      assert.fail("Server should have rejected due to path mismatch");
    } catch (error) {
      assert.equal(
        error.message,
        "Path mismatch",
        "Server did not reject with the expected 'Path mismatch' error"
      );
    }
  });

  test("should timeout if route is not called within timeout (2 seconds)", async () => {
    const timeoutDuration = 2000; // 2 seconds timeout

    // Start the server with a 2-second timeout and no route calls
    const serverPromise = singleCallbackServer({
      port: 9876, // Ensure this port is free or dynamically assigned in a real test
      callbackPath: "/test-path",
      callbackHandler: async (incomingURLSearchParams) => {
        throw new Error("This handler should not be called");
      },
      timeout: timeoutDuration,
    });

    // Assert that the server promise rejects due to the timeout
    try {
      await serverPromise;
      assert.fail("Server should have rejected due to timeout");
    } catch (error) {
      assert.equal(
        error.message,
        "Server timeout",
        "Server did not reject with the expected 'Server timeout' error"
      );
    }
  });
});
