import http from 'node:http';

/**
 * Starts an HTTP server that listens on a specified port and processes requests on a specified path.
 * The server automatically shuts down after handling a single request or when a timeout occurs.
 *
 * @template T The type of the result returned by the callbackHandler.
 * @param {Object} options - The configuration object for the server.
 * @param {number} options.port - The port number on which the server will listen.
 * @param {string} options.callbackPath - The URL path that the server will respond to.
 * @param {function(URLSearchParams): Promise<T>} options.callbackHandler - An async function that processes the incoming URLSearchParams. The function should handle the URLSearchParams object to perform necessary actions and return a promise that resolves with a result of type T.
 * @param {number} [options.timeout=30000] - The maximum time in milliseconds that the server will wait for a request before automatically shutting down due to timeout.
 * @returns {Promise<T>} A promise that resolves with the result of the callbackHandler if the request is successfully processed, or rejects with an error if the request fails or the server times out.
 */
export function singleCallbackServer({
  port,
  callbackPath,
  callbackHandler,
  timeout = 30000,
}) {
  console.debug(`Starting server on port ${port}`);
  return new Promise((resolve, reject) => {
    // Setup the HTTP server
    const server = http
      .createServer(async (req, res) => {
        try {
          // Use an explicitly dummy base URL to clarify its use only for satisfying the URL constructor
          const dummyURL = "http://dummy-url-makes-URL-constructor-happy";
          const incomingURL = new URL(req.url, dummyURL);
          if (callbackPath !== incomingURL.pathname) {
            console.warn(`Unexpected path: ${incomingURL.pathname}`);
            res.end("Path mismatch");
            server.close(() => {
              // server.closeAllConnections(); // Ensure all active connections are closed
              reject(new Error("Path mismatch"));
            });
            return;
          }

          // Extract the searchParams and use the passed handler function to process the request
          const searchParams = incomingURL.searchParams;
          const result = await callbackHandler(searchParams);
          res.end("Request processed successfully");
          server.close(() => resolve(result));
        } catch (error) {
          res.end("Error processing request");
          server.close(() => reject(error));
        }
      })
      .listen(port);

    // Set up a timeout to shut down the server
    const timeoutId = setTimeout(() => {
      server.close(() => reject(new Error("Server timeout")));
    }, timeout);

    // Cleanup on server close
    server.on("close", () => clearTimeout(timeoutId));
  });
}
