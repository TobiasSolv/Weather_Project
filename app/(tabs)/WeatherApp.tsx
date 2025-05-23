import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Switch } from 'react-native';
import { EuropeanCapitals } from '../Capitals';

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMetric, setIsMetric] = useState(true); // true = metric (°C, m/s), false = imperial (°F, mph)

  // Replace with your actual API key from OpenWeatherMap
  const API_KEY = '2f47cc0e4801dcde25d10f28bc331fba';

  useEffect(() => {
    // Function to fetch weather data for a single capital
    const fetchWeatherForCapital = async (capital) => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${capital.latitude}&lon=${capital.longitude}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod && data.cod !== 200) {
          throw new Error(data.message || 'Error fetching weather data');
        }

        return {
          country: capital.country,
          capital: capital.capital,
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          weatherId: data.weather[0].id,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed
        };
      } catch (error) {
        console.error(`Error fetching weather for ${capital.capital}:`, error);
        return {
          country: capital.country,
          capital: capital.capital,
          error: true
        };
      }
    };

    // Fetch weather data for all capitals (limit to first 5 to avoid API rate limits)
    const fetchAllWeather = async () => {
      setLoading(true);
      try {
        // Using only the first 5 capitals to avoid API rate limits
        // For a production app, you might want to handle all capitals with proper rate limiting
        const sampleCapitals = EuropeanCapitals.slice(0, 11);

        const weatherPromises = sampleCapitals.map(capital =>
          fetchWeatherForCapital(capital)
        );

        const results = await Promise.all(weatherPromises);
        setWeatherData(results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
        console.error('Error fetching weather data:', err);
      }
    };

    fetchAllWeather();
  }, []);

  // Convert Wind speed between m/s and mph
  const convertWindSpeed = (windSpeed) => {
    if (isMetric) {
      return windSpeed; // Return m/s
    } else {
      return windSpeed * 2.23694; // Convert to mph
    }
  };

  // Format wind speed with the correct unit
  const formatWindSpeed = (wind) => {
    const convertedWind = convertWindSpeed(wind);
    const roundedWind = Math.round(convertedWind * 10) / 10; // round to 1 decimal place
    return `${roundedWind} ${isMetric ? 'm/s' : 'mph'}`;
  };

  // Convert temperature between Celsius and Fahrenheit
  const convertTemperature = (celsius) => {
    if (isMetric) {
      return celsius;
    } else {
      return (celsius * 9/5) + 32;
    }
  };

  // Format temperature with the correct unit
  const formatTemperature = (temp) => {
    const convertedTemp = convertTemperature(temp);
    const roundedTemp = Math.round(convertedTemp * 10) / 10; // Round to 1 decimal place
    return `${roundedTemp}°${isMetric ? 'C' : 'F'}`;
  };

  // Map OpenWeatherMap weather condition codes to emojis
  const getWeatherEmoji = (weatherId, isDay = true) => {
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

  // Render a single weather item
  const renderWeatherItem = ({ item }) => {
    if (item.error) {
      return (
        <View style={styles.weatherItem}>
          <Text style={styles.capitalName}>{item.capital}, {item.country}</Text>
          <Text style={styles.errorText}>Failed to load weather data</Text>
        </View>
      );
    }

    return (
      <View style={styles.weatherItem}>
        <View style={styles.header}>
          <Text style={styles.capitalName}>{item.capital}, {item.country}</Text>
          <Text style={styles.weatherEmoji}>{getWeatherEmoji(item.weatherId, item.isDay)}</Text>
        </View>
        <Text style={styles.temperature}>{formatTemperature(item.temperature)}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text>Humidity: {item.humidity}%</Text>
        <Text>Wind: {formatWindSpeed(item.windSpeed)}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Weather in European Capitals</Text>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Weather in European Capitals</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather in European Capitals</Text>

      {/* Unit Toggle - Metric vs Imperial */}
      <View style={styles.unitToggle}>
        <Text style={styles.unitLabel}>°C</Text>
        <Switch
          value={!isMetric}
          onValueChange={() => setIsMetric(!isMetric)}
          thumbColor={isMetric ? "#f4f3f4" : "#007AFF"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
        <Text style={styles.unitLabel}>°F</Text>
      </View>

      <Text style={styles.subtitle}>Showing data for {weatherData.length} of {EuropeanCapitals.length} capitals</Text>

      <FlatList
        data={weatherData}
        renderItem={renderWeatherItem}
        keyExtractor={(item) => item.capital}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 40,
    textAlign: 'center',
    color: '#666',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  unitToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  weatherItem: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  capitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  weatherEmoji: {
    fontSize: 32,
    marginLeft: 10,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});