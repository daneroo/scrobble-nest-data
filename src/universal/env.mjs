// This function will get an environment variable's value on node,deno and bun.
export function getEnv(key) {
  if (typeof process !== "undefined") {
    return process.env[key];
  } else if (typeof Deno !== "undefined") {
    return Deno.env.get(key);
  }
  throw new Error("Unsupported runtime");
}
