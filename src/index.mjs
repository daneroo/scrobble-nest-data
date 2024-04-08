import { getEnv } from './universal/env.mjs';

await main();
async function main() {
  // use universalGetEnv(key) instead of process.env[key] to get environment variables
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
    return;
  }
  console.log("Validated environment variables");
  // const weather = await retrieveWeather(
  //   OPENWATHERMAP_KEY,
  //   OPENWATHERMAP_LAT,
  //   OPENWATHERMAP_LON
  // );
  // console.log(weather);
}

console.log("Hello, world!");