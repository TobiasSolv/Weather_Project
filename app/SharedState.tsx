// context/SharedStateContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { EuropeanCapitals } from './Capitals';

const SharedStateContext = createContext<any>(null);


export const SharedStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [euCapitals, setEuCapitals] = useState(EuropeanCapitals.map((capital, index) => {
      return {...capital, index}
      }))
  const [weatherData, setWeatherData] = useState([]);

  return (
    <SharedStateContext.Provider value={{ euCapitals, setEuCapitals, weatherData, setWeatherData }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => useContext(SharedStateContext);