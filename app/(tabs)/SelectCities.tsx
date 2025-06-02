import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Switch } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useSharedState } from '../SharedState';


export default function WeatherApp() {
    //useSharedState bliver aktiveret i app/_layout.tsx
    const { euCapitals, setEuCapitals } = useSharedState();

  // Render a single weather item
    const renderSelectItem = ({ item, index }) => {
        const handleCheckboxChange = (newValue) => {
            // euCapitals[index].display = newValue;

            // setEuCapitals(prevCapitals => prevCapitals)
            // setEuCapitals(prevCapitals => prevCapitals.map((capital, i) => capital))
            // setEuCapitals(prevCapitals => prevCapitals.map((capital, i) => {
            //      if (i === index) {
            //          return { ...capital, display: newValue };
            //      } else {
            //          return capital;
            //      }
            // }))
            // === sammenligner også´typen


            // sende det til git hub

            setEuCapitals(prevCapitals =>
              prevCapitals.map((capital, i) =>
                i === index
                  ? { ...capital, display: newValue }
                  : capital
              )
            );
          };

      return (
        <View style={styles.weatherItem}>
          <View style={styles.header}>
            <Checkbox
                      value={item.display}
                      onValueChange={handleCheckboxChange}
                    />
            <Text style={styles.capitalName}> {item.capital}, {item.country}</Text>
          </View>

        </View>
      );
    };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select cities</Text>

      <FlatList
        data={euCapitals}
        renderItem={renderSelectItem}
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