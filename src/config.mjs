// Our configuration will be sourced from a JSON file (if present)
// and (overridden by) environment variables.
// This is to allow for easier configuration management in a CI/CD pipeline.

import { z } from "zod";

import { parse } from "@std/jsonc";

import { readFile } from "./universal/file.mjs";

export async function getAppConfig() {
  return getConfigFromFileWithSchema(
    "./secrets/app-credentials.json",
    appConfigSchema
  );
}

export async function getUserRefreshToken() {
  return getConfigFromFileWithSchema(
    "./secrets/user-refresh-token.json",
    userRefreshTokenSchema
  );
}

export async function getUserAccessToken() {
  return getConfigFromFileWithSchema(
    "./secrets/user-access-token.json",
    userAccessTokenSchema
  );
}

// re-used schema definitions
const numericStringSchema = z
  .string()
  .refine((value) => !isNaN(Number(value)), {
    message: "Must be a string containing a valid number",
  });

const trimmedNonEmptyStringSchema = z
  .string()
  // Check that the string is not empty
  .min(1, { message: "String must not be empty." })
  // Ensure no leading or trailing whitespace
  .refine((value) => value === value.trim(), {
    message: "String must not contain leading or trailing whitespace.",
  });

const appConfigSchema = z.object({
  openWeatherMap: z.object({
    key: trimmedNonEmptyStringSchema,
    lat: numericStringSchema,
    lon: numericStringSchema,
  }),
  nestDeviceAccess: z.object({
    projectId: trimmedNonEmptyStringSchema,
  }),
  gcpOAuth2: z.object({
    clientId: trimmedNonEmptyStringSchema,
    clientSecret: trimmedNonEmptyStringSchema,
    refreshToken: trimmedNonEmptyStringSchema,
  }),
});

const userRefreshTokenSchema = z.object({
  refreshToken: trimmedNonEmptyStringSchema,
});
const userAccessTokenSchema = z.object({
  accessToken: trimmedNonEmptyStringSchema,
  expiresAt: z.string().datetime(), //enforces ISO 8601
});

async function getConfigFromFileWithSchema(jsonConfigFilename, schema) {
  const configFromJSON = await readJSONCFile(jsonConfigFilename);
  const result = schema.safeParse(configFromJSON);
  if (result.success) {
    return result.data;
  } else {
    // console.error(result.error);
    console.error(
      `Failed to validate app config JSON file: ${jsonConfigFilename}\n${result.error}`
    );
    return {};
  }
}

// Parse a JSON(C) file and return its contents as an object
// return empty object if any error occurs
// send error messages to console.error (stderr)
async function readJSONCFile(filename) {
  try {
    const txt = await readFile(filename);
    try {
      return parse(txt);
    } catch (err) {
      console.error(`Failed to parse JSON file (${filename}): ${err}`);
    }
  } catch (err) {
    if (err?.code === "ENOENT") {
      console.error(`App config JSON file not found: (${filename})`);
    } else if (err?.code === "EACCES") {
      console.error(`App config JSON read permission denied: (${filename})`);
    } else {
      console.error(`Failed to load JSON file (${filename}): ${err}`);
    }
  }
  // if any error occurs, return an empty object
  return {};
}
