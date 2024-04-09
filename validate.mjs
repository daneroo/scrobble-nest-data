await main();
async function main() {
  const NEST_PROJECT_ID = universalGetEnv("NEST_PROJECT_ID");
  const GCP_OAUTH2_CLIENT_ID = universalGetEnv("GCP_OAUTH2_CLIENT_ID");
  const GCP_OAUTH2_CLIENT_SECRET = universalGetEnv("GCP_OAUTH2_CLIENT_SECRET");
  const USER_OAUTH2_AUTHORIZATION_CODE = universalGetEnv(
    "USER_OAUTH2_AUTHORIZATION_CODE"
  );
  const USER_OAUTH2_ACCESS_TOKEN = universalGetEnv("USER_OAUTH2_ACCESS_TOKEN");
  const USER_OAUTH2_REFRESH_TOKEN = universalGetEnv(
    "USER_OAUTH2_REFRESH_TOKEN"
  );

  if (!NEST_PROJECT_ID || !GCP_OAUTH2_CLIENT_ID || !GCP_OAUTH2_CLIENT_SECRET) {
    console.error(
      "Missing NEST_PROJECT_ID or GCP_OAUTH2_CLIENT_ID or GCP_OAUTH2_CLIENT_SECRET environment variable"
    );
    console.info(
      "Perhaps you need to run:\nset -a && source secrets/NEST.env && set +a"
    );
    return;
  }

  if (USER_OAUTH2_REFRESH_TOKEN) {
    await makeACall(
      NEST_PROJECT_ID,
      GCP_OAUTH2_CLIENT_ID,
      GCP_OAUTH2_CLIENT_SECRET,
      USER_OAUTH2_REFRESH_TOKEN,
      USER_OAUTH2_ACCESS_TOKEN
    );
    return;
  }

  if (!USER_OAUTH2_AUTHORIZATION_CODE) {
    console.info(
      "Triggering OAuth2 authorization flow. Please visit the following URL to authorize the app:"
    );
    const webFlowURL = await oauth2WebFlowURL(
      NEST_PROJECT_ID,
      GCP_OAUTH2_CLIENT_ID,
      GCP_OAUTH2_CLIENT_SECRET
    );
    console.info(webFlowURL);
  } else {
    console.info(
      "Authorization code is set, fetching an access/refresh token:"
    );
    await getAccessTokenFromAuthorizationCode(
      GCP_OAUTH2_CLIENT_ID,
      GCP_OAUTH2_CLIENT_SECRET,
      USER_OAUTH2_AUTHORIZATION_CODE
    );
  }
}

// This function makes a call to the API
async function makeACall(
  nestProjectId,
  gcpOauth2ClientId,
  gcpOauth2ClientSecret,
  refreshToken,
  accessToken
) {
  console.info("Making a call to the API");
  const url = `https://smartdevicemanagement.googleapis.com/v1/enterprises/${nestProjectId}/devices`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await fetch(url, {
    headers,
  });
  // check if the response is ok
  if (!response.ok) {
    if (response.status === 401) {
      console.info("Access token expired, refreshing token...");
      await getAccessTokenFromRefreshToken(
        gcpOauth2ClientId,
        gcpOauth2ClientSecret,
        refreshToken
      );
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  const json = await response.json();
  console.info(JSON.stringify(json, null, 2));
}

// This function refreshes the access token from a refresh token
async function getAccessTokenFromRefreshToken(
  gcpOauth2ClientId,
  gcpOauth2ClientSecret,
  refreshToken
) {
  const baseUrl = "https://www.googleapis.com/oauth2/v4/token";
  const params = {
    client_id: gcpOauth2ClientId,
    client_secret: gcpOauth2ClientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };
  const paramsString = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const getAccessTokenURL = `${baseUrl}?${paramsString}`;
  console.debug({ getAccessTokenURL });

  const response = await fetch(getAccessTokenURL, {
    method: "POST",
  });
  // check if the response is ok
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  console.info(json);
}
// This function fetches the access token and refresh token
// with the authorization code returned by the OAuth2 authorization flow
async function getAccessTokenFromAuthorizationCode(
  gcpOauth2ClientId,
  gcpOauth2ClientSecret,
  userOauth2AuthorizationCode
) {
  // Post URL
  // https://www.googleapis.com/oauth2/v4/token?client_id=...&client_secret=...&code=...&grant_type=authorization_code&redirect_uri=https://www.google.com'
  const baseUrl = "https://www.googleapis.com/oauth2/v4/token";
  const params = {
    client_id: gcpOauth2ClientId,
    client_secret: gcpOauth2ClientSecret,
    code: userOauth2AuthorizationCode,
    grant_type: "authorization_code",
    redirect_uri: "https://www.google.com",
  };
  const paramsString = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const getAccessTokenURL = `${baseUrl}?${paramsString}`;
  console.debug({ getAccessTokenURL });

  const response = await fetch(getAccessTokenURL, {
    method: "POST",
  });
  // check if the response is ok
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  console.info(json);
}
// This function triggers the OAuth2 authorization flow
async function oauth2WebFlowURL(
  nestProjectId,
  gcpOauth2ClientId,
  gcpOauth2ClientSecret
) {
  const baseUrl = `https://nestservices.google.com/partnerconnections/${nestProjectId}/auth`;
  const params = {
    // should be local address, and be part of OAuth2 redirect URIs
    redirect_uri: "https://www.google.com",
    access_type: "offline", // 'offline' if your application needs to refresh access tokens when the user is not present at the browser.
    prompt: "consent",
    client_id: gcpOauth2ClientId,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/sdm.service",
  };
  const paramsString = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  // This is how we start the authorization (web) flow
  const authorizeURL = `${baseUrl}?${paramsString}`;
  return authorizeURL;
}

// This function will get an enviroment variable's value on node,deno and bun.
function universalGetEnv(key) {
  if (typeof process !== "undefined") {
    return process.env[key];
  } else if (typeof Deno !== "undefined") {
    return Deno.env.get(key);
  }
  throw new Error("Unsupported runtime");
}
