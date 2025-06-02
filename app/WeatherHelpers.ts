
 // Convert Wind speed between m/s and mph
  export const convertWindSpeed = (windSpeed, isMetric) => {
    if (isMetric) {
      return windSpeed; // Return m/s
    } else {
      return windSpeed * 2.23694; // Convert to mph
    }
  };

  // Format wind speed with the correct unit
  export const formatWindSpeed = (wind, isMetric) => {
    const convertedWind = convertWindSpeed(wind, isMetric);
    const roundedWind = Math.round(convertedWind * 10) / 10; // round to 1 decimal place
    return `${roundedWind} ${isMetric ? 'm/s' : 'mph'}`;
  };

  // Convert temperature between Celsius and Fahrenheit
  export const convertTemperature = (celsius, isMetric) => {
    if (isMetric) {
      return celsius;
    } else {
      return (celsius * 9/5) + 32;
    }
  };

  // Format temperature with the correct unit
  export const formatTemperature = (temp, isMetric) => {
    const convertedTemp = convertTemperature(temp, isMetric);
    const roundedTemp = Math.round(convertedTemp * 10) / 10; // Round to 1 decimal place
    return `${roundedTemp}°${isMetric ? 'C' : 'F'}`;
  };

  // Map OpenWeatherMap weather condition codes to emojis
  export const getWeatherEmoji = (weatherId, isDay = true) => {
    // Thunderstorm conditions (200-299)
    if (weatherId >= 200 && weatherId < 300) {
      if (weatherId === 200 || weatherId === 230) return '🌩️'; // thunderstorm with light rain
      if (weatherId === 201 || weatherId === 231) return '⛈️'; // thunderstorm with rain
      if (weatherId === 202 || weatherId === 232) return '⛈️🌊'; // thunderstorm with heavy rain
      if (weatherId === 210) return '🌩️'; // light thunderstorm
      if (weatherId === 211) return '⚡'; // thunderstorm
      if (weatherId === 212) return '⚡⚡'; // heavy thunderstorm
      if (weatherId === 221) return '⚡☔'; // ragged thunderstorm
      return '⛈️'; // default thunderstorm
    }

    // Drizzle conditions (300-399)
    else if (weatherId >= 300 && weatherId < 400) {
      if (weatherId === 300) return '🌦️'; // light intensity drizzle
      if (weatherId === 301) return '🌧️'; // drizzle
      if (weatherId === 302) return '🌧️'; // heavy intensity drizzle
      if (weatherId === 310) return '🌦️'; // light intensity drizzle rain
      if (weatherId === 311) return '🌧️'; // drizzle rain
      if (weatherId === 312 || weatherId === 314) return '🌧️'; // heavy drizzle rain
      if (weatherId === 313) return '🌧️'; // shower rain and drizzle
      if (weatherId === 321) return '🌧️'; // shower drizzle
      return '🌧️'; // default drizzle
    }

    // Rain conditions (500-599)
    else if (weatherId >= 500 && weatherId < 600) {
      if (weatherId === 500) return '🌦️'; // light rain
      if (weatherId === 501) return '🌧️'; // moderate rain
      if (weatherId === 502) return '🌧️🌧️'; // heavy intensity rain
      if (weatherId === 503 || weatherId === 504) return '🌧️🌊'; // very heavy/extreme rain
      if (weatherId === 511) return '❄️🌧️'; // freezing rain
      if (weatherId === 520) return '🌦️'; // light intensity shower rain
      if (weatherId === 521) return '🌧️'; // shower rain
      if (weatherId === 522) return '🌧️🌧️'; // heavy intensity shower rain
      if (weatherId === 531) return '🌧️☔'; // ragged shower rain
      return '🌧️'; // default rain
    }

    // Snow conditions (600-699)
    else if (weatherId >= 600 && weatherId < 700) {
      if (weatherId === 600) return '❄️'; // light snow
      if (weatherId === 601) return '🌨️'; // snow
      if (weatherId === 602) return '❄️❄️'; // heavy snow
      if (weatherId === 611) return '🌨️🌧️'; // sleet
      if (weatherId === 612) return '🌨️🌧️'; // light shower sleet
      if (weatherId === 613) return '🌨️🌧️'; // shower sleet
      if (weatherId === 615) return '❄️🌧️'; // light rain and snow
      if (weatherId === 616) return '🌨️🌧️'; // rain and snow
      if (weatherId === 620) return '❄️'; // light shower snow
      if (weatherId === 621) return '🌨️'; // shower snow
      if (weatherId === 622) return '❄️❄️'; // heavy shower snow
      return '🌨️'; // default snow
    }

    // Atmosphere conditions (700-799)
    else if (weatherId >= 700 && weatherId < 800) {
      if (weatherId === 701) return '🌫️'; // mist
      if (weatherId === 711) return '💨'; // smoke
      if (weatherId === 721) return '🌫️'; // haze
      if (weatherId === 731) return '🌪️'; // sand/dust whirls
      if (weatherId === 741) return '🌁'; // fog
      if (weatherId === 751) return '💨'; // sand
      if (weatherId === 761) return '💨'; // dust
      if (weatherId === 762) return '🌋'; // volcanic ash
      if (weatherId === 771) return '💨💨'; // squalls
      if (weatherId === 781) return '🌪️'; // tornado
      return '🌫️'; // default atmosphere
    }

    // Clear sky (800)
    else if (weatherId === 800) {
      return isDay ? '☀️' : '🌙'; // clear sky (day/night)
    }

    // Cloud conditions (801-899)
    else if (weatherId > 800 && weatherId < 900) {
      if (weatherId === 801) return isDay ? '🌤️' : '☁️🌙'; // few clouds
      if (weatherId === 802) return isDay ? '⛅' : '☁️🌙'; // scattered clouds
      if (weatherId === 803) return '☁️'; // broken clouds
      if (weatherId === 804) return '☁️☁️'; // overcast clouds
      return '☁️'; // default clouds
    }

    // Extreme conditions
    else {
      return '⚠️'; // extreme or unknown weather
    }
  };