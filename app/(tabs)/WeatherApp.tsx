import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Switch } from 'react-native';
import { EuropeanCapitals } from '../Capitals';
import { useSharedState } from '../SharedState';
import { formatWindSpeed, formatTemperature, getWeatherEmoji} from '../WeatherHelpers';
import { PanGestureHandler, GestureHandlerRootView} from 'react-native-gesture-handler'

export default function WeatherApp() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMetric, setIsMetric] = useState(true); // true = metric (°C, m/s), false = imperial (°F, mph)
  const { euCapitals, setEuCapitals, weatherData, setWeatherData } = useSharedState();



  const API_KEY = '2f47cc0e4801dcde25d10f28bc331fba'; // deaktiveret

    // en hook, som syncronisere komponenten med resten af react, startknap
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
          euCapitalsIndex: capital.index,
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

    // Fetch weather data for all capitals
    const fetchAllWeather = async () => {
      setLoading(true);
      try {
          // computed property
        const selectedCapitals = euCapitals.filter(capital => capital.display);

        const weatherPromises = selectedCapitals.map(capital =>
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
    // weather app subscriber på dependencies
  }, [euCapitals]);

  function onGestureEvent(event, index){
      const{translationX, translationY} = event.nativeEvent
      let deleteIndex = weatherData[index].euCapitalsIndex

      setEuCapitals(prevCapitals =>
                    prevCapitals.map((capital, i) =>
                      i === deleteIndex
                        ? { ...capital, display: false }
                        : capital
                    )
                  );
      }

  // Render a single weather item
  const renderWeatherItem = ({ item, index }) => {
    if (item.error) {
      return (
        <View style={styles.weatherItem}>
          <Text style={styles.capitalName}>{item.capital}, {item.country}</Text>
          <Text style={styles.errorText}>Failed to load weather data</Text>
        </View>
      );
    }

    // index her er weatherData index
    return (
    <PanGestureHandler onGestureEvent={(event) => onGestureEvent(event, index)}>
      <View style={styles.weatherItem}>
        <View style={styles.header}>
          <Text style={styles.capitalName}>{item.capital}, {item.country}</Text>
          <Text style={styles.weatherEmoji}>{getWeatherEmoji(item.weatherId, item.isDay)}</Text>
        </View>
        <Text style={styles.temperature}>{formatTemperature(item.temperature, isMetric)}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text>Humidity: {item.humidity}%</Text>
        <Text>Wind: {formatWindSpeed(item.windSpeed, isMetric)}</Text>
      </View>
    </PanGestureHandler>
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
    <GestureHandlerRootView>
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
    </GestureHandlerRootView>
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