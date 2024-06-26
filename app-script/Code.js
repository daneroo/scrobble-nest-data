/**
 * Custom menu to use tool from Sheet UI
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu("Smart Device Tool")
    .addItem("Smart Device Tool", "showSidebar")
    .addSeparator()
    .addItem("Log thermostat data", "logThermostatDataAllDevices")
    .addItem("Set temperature", "setTemperature")
    .addToUi();
}

/**
 * list devices to get thermostat IDs
 */
function listDevices() {
  // specify the endpoint
  const endpoint = "/enterprises/" + PROJECT_ID + "/devices";

  // blank array to hold device data
  let deviceArray = [];

  // make request to smart api
  const data = makeRequest(endpoint);
  const deviceData = data.devices;
  console.log(deviceData);

  deviceData.forEach((device) => {
    const name = device.name;
    const type = device.type;
    deviceArray.push([name, type]);
  });

  // get the Sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  // output the data
  sheet.getRange(2, 1, deviceArray.length, 2).setValues(deviceArray);
}

/**
 * function to make request to google smart api
 */
function makeRequest(endpoint) {
  // get the smart service
  const smartService = getSmartService();

  // get the access token
  const access_token = smartService.getAccessToken();
  console.log(access_token);

  // setup the SMD API url
  const url = "https://smartdevicemanagement.googleapis.com/v1";
  //const endpoint = '/enterprises/' + PROJECT_ID + '/devices';

  // setup the headers for the call
  const headers = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  };

  // set up params
  const params = {
    headers: headers,
    method: "get",
    muteHttpExceptions: true,
  };

  // try calling API
  try {
    const response = UrlFetchApp.fetch(url + endpoint, params);
    const responseBody = JSON.parse(response.getContentText());
    return responseBody;
  } catch (e) {
    console.log("Error: " + e);
  }
}

/**
 * function to make request to google smart api
 */
function logThermostatDataAllDevices() {
  // get the latest weather data
  const weatherDataArray = retrieveWeather();
  console.log(weatherDataArray);

  // get the smart service
  const smartService = getSmartService();

  // get the access token
  const access_token = smartService.getAccessToken();

  // setup the SMD API url
  const url = "https://smartdevicemanagement.googleapis.com/v1";
  const endpoint = "/enterprises/" + PROJECT_ID + "/devices";

  // setup the headers for the call
  const headers = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  };

  // setup the parameters for url fetch
  const params = {
    headers: headers,
    method: "get",
    muteHttpExceptions: true,
  };

  // empty array to hold device data
  let dataArray = [];
  //let smdWeatherArray = [];

  // try calling API
  try {
    // url fetch to call api
    const response = UrlFetchApp.fetch(url + endpoint, params);
    const responseCode = response.getResponseCode();
    const responseBody = JSON.parse(response.getContentText());

    // log responses
    console.log(responseCode);
    //console.log(responseBody);

    // get devices
    const devices = responseBody["devices"];
    //console.log(devices);

    // create timestamp for api call
    const d = new Date();

    devices.forEach((device) => {
      if (device["type"] === "sdm.devices.types.THERMOSTAT") {
        // get relevant info
        const name = device["name"];
        const type = device["type"];
        let location = "";
        const humidity =
          device["traits"]["sdm.devices.traits.Humidity"][
            "ambientHumidityPercent"
          ];
        const connectivity =
          device["traits"]["sdm.devices.traits.Connectivity"]["status"];
        const fan = device["traits"]["sdm.devices.traits.Fan"]["timerMode"];
        const mode =
          device["traits"]["sdm.devices.traits.ThermostatMode"]["mode"];
        const thermostatEcoMode =
          device["traits"]["sdm.devices.traits.ThermostatEco"]["mode"];
        const thermostatEcoHeatCelcius =
          device["traits"]["sdm.devices.traits.ThermostatEco"]["heatCelsius"];
        const thermostatEcoHeatFarenheit = convertCtoF(
          thermostatEcoHeatCelcius
        );
        const thermostatEcoCoolCelcius =
          device["traits"]["sdm.devices.traits.ThermostatEco"]["coolCelsius"];
        const thermostatEcoCoolFarenheit = convertCtoF(
          thermostatEcoCoolCelcius
        );
        const thermostatHvac =
          device["traits"]["sdm.devices.traits.ThermostatHvac"]["status"];
        const tempCelcius =
          device["traits"]["sdm.devices.traits.Temperature"][
            "ambientTemperatureCelsius"
          ];
        const tempFarenheit = convertCtoF(tempCelcius);

        if (
          name ===
          "enterprises/" + PROJECT_ID + "/devices/" + DOWNSTAIRS_THERMOSTAT
        ) {
          location = "Downstairs";
        } else {
          location = "Upstairs";
        }

        dataArray.push(
          [
            d,
            name,
            type,
            location,
            humidity,
            connectivity,
            fan,
            mode,
            thermostatEcoMode,
            thermostatEcoHeatCelcius,
            thermostatEcoHeatFarenheit,
            thermostatEcoCoolCelcius,
            thermostatEcoCoolFarenheit,
            thermostatHvac,
            tempCelcius,
            tempFarenheit,
          ].concat(weatherDataArray)
        );

        //dataArray = dataArray;
      }
    });

    console.log(dataArray);

    // get the Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("thermostatLogs");

    // output the data
    sheet
      .getRange(
        sheet.getLastRow() + 1,
        1,
        dataArray.length,
        dataArray[0].length
      )
      .setValues(dataArray);
  } catch (e) {
    console.log("Error: " + e);
  }
}

function retrieveWeather() {
  const weatherArray = [];

  try {
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
    const params = {
      lat: OPENWATHERMAP_LAT,
      lon: OPENWATHERMAP_LON,
      units: "metric",
      appid: OPENWATHERMAP_KEY,
    };
    const paramsString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const weatherUrl = `${baseUrl}?${paramsString}`;

    const response = UrlFetchApp.fetch(weatherUrl);
    const weatherData = JSON.parse(response.getContentText());

    // parse the data
    console.log(weatherData.properties);
    const weather = weatherData?.weather[0];
    const main = weather?.main;
    const description = weather?.description;

    const temp = weatherData?.main?.temp;
    const feels_like = weatherData?.main?.feels_like;
    const pressure = weatherData?.main?.pressure;
    const humidity = weatherData?.main?.humidity;
    const clouds = weatherData?.clouds?.all;
    const visibility = weatherData?.visibility;
    const wind_speed = weatherData?.wind?.speed;
    const wind_deg = weatherData?.wind?.deg;

    // add to array
    weatherArray.push(
      main,
      description,
      temp,
      feels_like,
      pressure,
      humidity,
      clouds,
      visibility,
      wind_speed,
      wind_deg
    );
  } catch (e) {
    console.log("Error: " + e);
  }
  console.log(weatherArray);

  return weatherArray;
}

/**
 * function to change temperature to value in the Google Sheet
 */
function setTemperature() {
  // get temperature from Sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tempSheet = ss.getSheetByName("sheetNest");
  const tempF = tempSheet.getRange("A1").getValue(); // Change this cell reference to match the temperature input cell of your Google Sheet
  const tempC = convertFtoC(tempF);

  console.log(tempC.toFixed(1));
  console.log(typeof tempC);

  // get the smart service
  const smartService = getSmartService();

  // get the access token
  const access_token = smartService.getAccessToken();
  console.log(access_token);

  // setup the SMD API url
  const url = "https://smartdevicemanagement.googleapis.com/v1";

  // set the endpoint
  const endpoint =
    "/enterprises/" +
    PROJECT_ID +
    "/devices/" +
    DOWNSTAIRS_THERMOSTAT +
    ":executeCommand";

  // setup the headers for the call
  const headers = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  };

  const data = {
    command: "sdm.devices.commands.ThermostatTemperatureSetpoint.SetHeat",
    params: {
      heatCelsius: tempC,
    },
  };

  const options = {
    headers: headers,
    method: "post",
    payload: JSON.stringify(data),
  };

  try {
    // try calling API
    const response = UrlFetchApp.fetch(url + endpoint, options);
  } catch (e) {
    console.log("Error: " + e);
  }
}
