await main();
async function main() {
  const OPENWATHERMAP_KEY = process.env.OPENWATHERMAP_KEY;
  const OPENWATHERMAP_LAT = process.env.OPENWATHERMAP_LAT;
  const OPENWATHERMAP_LON = process.env.OPENWATHERMAP_LON;

  if (!OPENWATHERMAP_KEY || !OPENWATHERMAP_LAT || !OPENWATHERMAP_LON) {
    console.error(
      "Missing OPENWATHERMAP_KEY or OPENWATHERMAP_LAT or OPENWATHERMAP_LON environment variable"
    );
    console.info(
      "Perhaps you need to run:\nset -a && source secrets/OPENWATHERMAP.env && set +a"
    );
    return;
  }

  const weather = await retrieveWeather(
    OPENWATHERMAP_KEY,
    OPENWATHERMAP_LAT,
    OPENWATHERMAP_LON
  );
  console.log(weather);
}

// This function will retrieve the weather data from the OpenWeatherMap API
async function retrieveWeather(appid, lat, lon) {
  const weatherArray = [];
  try {
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
    const params = {
      lat: lat,
      lon: lon,
      units: "metric",
      appid: appid,
    };
    const paramsString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const weatherUrl = `${baseUrl}?${paramsString}`;

    const response = await fetch(weatherUrl);
    const weatherData = await response.json();

    console.log(weatherData);

    const weather = weatherData?.weather[0];
    const weather_main = weather?.main;
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
      weather_main,
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
  return weatherArray;
}

/*
  Example weather data from OpenWeatherMap API
{
  "coord": {
    "lon": -75.755,
    "lat": 45.4661
  },
  "weather": [
    {
      "id": 803,
      "main": "Clouds",
      "description": "broken clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 10.25,
    "feels_like": 8.51,
    "temp_min": 9.05,
    "temp_max": 11.32,
    "pressure": 1014,
    "humidity": 45
  },
  "visibility": 10000,
  "wind": {
    "speed": 5.14,
    "deg": 340
  },
  "clouds": {
    "all": 75
  },
  "dt": 1712438976,
  "sys": {
    "type": 2,
    "id": 2036988,
    "country": "CA",
    "sunrise": 1712399571,
    "sunset": 1712446637
  },
  "timezone": -14400,
  "id": 5978353,
  "name": "Hull",
  "cod": 200
}
*/
