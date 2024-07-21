# Scrobble Nest Data

## TODO

- [x] Get the access token locally
  - [ ] refine the local lifecycle
    - [x] Move source to `src/` directory
    - [x] Move all configs to secrets/JSON files
    - [ ] allow env vars
      - [ ] store the refresh/access tokens in a separate file - including the expiration time, and add issue timestamp
    - [ ] one-callback-server (node.js, then bun, then Deno)
- [ ] Universal test runner
- [ ] Run from GH Actions
- [ ] Make the code runtime agnostic

## Universal Test harness/runner

```txt
In the file: packages/universal-file/index.mjs we use dynamic ESM imports So that this file can be imported by multiple run-times (bun, deno,node) CAn we write a similarly useful test file that will work: "scripts": { "test": "pnpm test:node && pnpm test:bun && pnpm test:deno", "test:node": "node --test src/**/*.node_test.mjs", "test:bun": "bun test src/**/*.bun_test.mjs", "test:deno": "deno test --allow-write --allow-read --allow-env src/**/*.deno_test.mjs" }, But combine all three test files, to work with each test runner above Actually it would be best if we could extract a single universal test module that could be used in all my test files import { test, assert, (perhaps describe)} from 'universal/test.mjs'

Make sure you consider where the underlying test,describe and assert comefrom, and that their signatures will be compatible.
We should declare the JSDOc for our common test,describe,assert methods/modules
```

## Setup

- Register in the Device Access Console (and pay the $CAD5.75 fee)
  - Create a project (scrobble-nest-data)
  - project ID: 16de9570-1d6e-4b63-aed1-0eefe81fb73a
- Create a GCP Project (scrobble-nest-data-project)
  - Create an OAuth client ID
- Add the GCP Client OAuth ID to the Device Access Console project

### Linking and Authorizing an Account

See <https://developers.google.com/nest/device-access/authorize>

Replace the `project-id` and `oauth2-client-id` in this URL and visit the link.

This failed with the following error: `Error 400: redirect_uri_mismatch`

```bash
# https://nestservices.google.com/partnerconnections/project-id/auth?redirect_uri=https://www.google.com&access_type=offline&prompt=consent&client_id=oauth2-client-id&response_type=code&scope=https://www.googleapis.com/auth/sdm.service
```

## Runtime agnostic

### adding dependencies

````bash
# from jsr (adds an entry into .npmrc)
pnpm dlx jsr add @std/jsonc
deno add @std/jsonc

# from npm
pnpm add zod
deno add npm:zod

```bash
./runAll.sh
# or
node src/index.mjs
bun run src/index.mjs
deno run --allow-net --allow-env src/index.mjs
````

## References

- [OpenWeatherMap Current Weather API](https://openweathermap.org/current)
  - [OpenWeatherMap API keys](https://home.openweathermap.org/api_keys)
- [Device Access Getting Started](https://developers.google.com/nest/device-access/get-started)
- [Google WorkSpace app-script-oauth2](https://github.com/googleworkspace/apps-script-oauth2)
- [Device Access Console](https://console.nest.google.com/device-access/project-list)
  - [scrobble-nest-data](https://console.nest.google.com/device-access/project/16de9570-1d6e-4b63-aed1-0eefe81fb73a/information)
- [GCP Project (scrobble-nest-data-project)](https://console.cloud.google.com/apis/credentials?project=scrobble-nest-data-project)
- [Nest Developer Guide](https://developers.google.com/nest/device-access/api/thermostat)
