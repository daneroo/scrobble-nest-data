# Secrets and Credentials

The .env files can be brought into shell scope with `source` or `.`

Using the `set -a` command will automatically export the variables to the shell environment,
and `set +a` will stop exporting the variables.

```bash
set -a && source secrets/<file>.env && set +a
```

## NEST.env

```bash
set -a && source secrets/NEST.env && set +a
```

```bash
# Nest Device Access Project ID
# from https://console.nest.google.com/device-access/project-list
NEST_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# From GCP / APIs & Services / Credentials / OAuth 2.0 Client IDs (Web Application)
GCP_OAUTH2_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GCP_OAUTH2_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# This is the Authorization Code from the the OAuth2 web flow
# https://www.google.com/?code=4/0AeaYSHCM80YnWrNj-LF5lYnNhfYgbf3GIeb283gmtAebDxhYYIo_tWAVVYkGfh9ulp7aQg&scope=https://www.googleapis.com/auth/sdm.service
USER_OAUTH2_AUTHORIZATION_CODE=xxxxxxxxxxxxxxxxxxxxxxxx
USER_OAUTH2_ACCESS_TOKEN=yyyy.xxxxxxxxxxxxxxxx
USER_OAUTH2_REFRESH_TOKEN=zzzzzzzzzzzzzzzzzzzzzzz
```

## OPENWATHERMAP.env

```bash
set -a && source secrets/OPENWATHERMAP.env && set +a
```

```bash
# form https://home.openweathermap.org/api_keys
OPENWATHERMAP_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# EXAMPLE FOR HULL, QC
OPENWATHERMAP_LAT=45.466077
OPENWATHERMAP_LON=-75.754981
```
