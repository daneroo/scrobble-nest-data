# Secrets and Credentials

The .env files can be brought into shell scope with `source` or `.`

```bash
set -a && source secrets/<file>.env && set +a
```

## OPENWATHERMAP.env

```bash
set -a && source secrets/OPENWATHERMAP.env && set +a
```

```bash
# frm https://home.openweathermap.org/api_keys
OPENWATHERMAP_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# EXAMPLE FOR HULL, QC
OPENWATHERMAP_LAT=45.466077
OPENWATHERMAP_LON=-75.754981
```
