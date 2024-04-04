# Scrobble Nest Data

## Setup

- Register in the Device Access Console (and pay the $5.75 fee)
  - Create a project (scrobble-nest-data)
  - project ID: 16de9570-1d6e-4b63-aed1-0eefe81fb73a
- Create a GCP Project (scrobble-nest-data-project)
  - Create an OAuth client ID
- Add the GCP CLient OAuth ID to the Device Access Console project

### Linking and Authorizing an Account

Replace the `project-id` and `oauth2-client-id` in this URL and visit the link.

This failed with the following error: `Error 400: redirect_uri_mismatch`

```bash
# https://nestservices.google.com/partnerconnections/project-id/auth?redirect_uri=https://www.google.com&access_type=offline&prompt=consent&client_id=oauth2-client-id&response_type=code&scope=https://www.googleapis.com/auth/sdm.service

```

## References

- [Device Access Console](https://console.nest.google.com/device-access/project-list)
  - [scrobble-nest-data](https://console.nest.google.com/device-access/project/16de9570-1d6e-4b63-aed1-0eefe81fb73a/information)
- [GCP Project (scrobble-nest-data-project)](https://console.cloud.google.com/apis/credentials?project=scrobble-nest-data-project)
- [Developer Guide](https://developers.google.com/nest/device-access/api/thermostat)
