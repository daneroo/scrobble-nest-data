// Our configuration will be sourced from a JSON file (if present)
// and (overridden by) environment variables.
// This is to allow for easier configuration management in a CI/CD pipeline.

import { getEnv } from "./universal/env.mjs";
import { readFile } from "./universal/file.mjs";

export async function getConfig() {
  // relative to repo root (where program is run from)
  // could later be configured by command line argument
  const jsonAppConfigFilename = "./secrets/app-credentials.json";

  const configFromJSON = await readJSONFile(jsonAppConfigFilename);
  console.log({ configFromJSON });
  function overrideWithEnv(keyName, jsonValue, envValue) {
    if (envValue) {
      if (jsonValue) {
        console.log(
          `Overriding JSON value for ${keyName} key with environment value: ${envValue}`
        );
      }
      return envValue;
    }
    if (!jsonValue) {
      console.error("Missing value for key: " + keyName);
      return "";
    }
    return jsonValue;
  }
  const config = {
    openWeatherMap: {
      key: overrideWithEnv(
        "openWeatherMap.key",
        configFromJSON.openWeatherMap?.key,
        getEnv("OPENWATHERMAP_KEY")
      ),
      lat: "",
      lon: "",
    },
    nestDeviceAccess: {
      // from https://console.nest.google.com/device-access/project-list
      projectId: "",
    },
    gcpOAuth2: {
      // From GCP / APIs & Services / Credentials / OAuth 2.0 Client IDs (Web Application)
      // GCP_OAUTH2_CLIENT_ID=XXX.apps.googleusercontent.com
      // GCP_OAUTH2_CLIENT_SECRET=GOCSPX-YYYY
      clientId: "",
      clientSecret: "",
      refreshToken: "",
    },
  };
  return config;

  const OPENWATHERMAP_KEY = getEnv("OPENWATHERMAP_KEY");
  const OPENWATHERMAP_LAT = getEnv("OPENWATHERMAP_LAT");
  const OPENWATHERMAP_LON = getEnv("OPENWATHERMAP_LON");

  if (!OPENWATHERMAP_KEY || !OPENWATHERMAP_LAT || !OPENWATHERMAP_LON) {
    console.error(
      "Missing OPENWATHERMAP_KEY or OPENWATHERMAP_LAT or OPENWATHERMAP_LON environment variable"
    );
    console.info(
      "Perhaps you need to run:\nset -a && source secrets/OPENWATHERMAP.env && set +a"
    );
    // return;
  }
  console.log("Validated environment variables");
  return {
    OPENWATHERMAP_KEY,
    OPENWATHERMAP_LAT,
    OPENWATHERMAP_LON,
  };
}

// Parse a JSON file and return its contents as an object
// return empty object if any error occurs
// send error messages to console.error (stderr)
async function readJSONFile(filename) {
  try {
    console.log(`Loading JSON file: ${filename}`);
    const txt = await readFile(filename);
    try {
      return JSON.parse(txt);
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
