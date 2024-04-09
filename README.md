# Scrobble Nest Data

## TODO

- [x] Get the access token locally
  - [ ] refine the local lifecycle
    - [ ] Move source to `src/` directory
    - [ ] Move all configs to secrets/JSON files - AND - env vars
    - [ ] store the refresh/access tokens in a separate file - including the expiration time, and add issue timestamp
    - [ ] callback server (node.js, then bun, then Deno)
- [ ] Run from GH Actions
- [ ] Make the code runtime agnostic

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

```bash
node src/index.mjs
bun run src/index.mjs
deno run --allow-net --allow-env src/index.mjs

node validate.mjs
bun run validate.mjs
deno run --allow-net --allow-env validate.mjs

node weather.mjs
bun run weather.mjs
deno run --allow-net --allow-env weather.mjs
```

## References

- [OpenWeatherMap Current Weather API](https://openweathermap.org/current)
  - [OpenWeatherMap API keys](https://home.openweathermap.org/api_keys)
- [Device Access Getting Started](https://developers.google.com/nest/device-access/get-started)
- [Google WorkSpace app-script-oauth2](https://github.com/googleworkspace/apps-script-oauth2)
- [Device Access Console](https://console.nest.google.com/device-access/project-list)
  - [scrobble-nest-data](https://console.nest.google.com/device-access/project/16de9570-1d6e-4b63-aed1-0eefe81fb73a/information)
- [GCP Project (scrobble-nest-data-project)](https://console.cloud.google.com/apis/credentials?project=scrobble-nest-data-project)
- [Nest Developer Guide](https://developers.google.com/nest/device-access/api/thermostat)
