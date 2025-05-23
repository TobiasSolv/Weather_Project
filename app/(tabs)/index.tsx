import { Text, View, StyleSheet } from "react-native";
import { EuropeanCapitals } from "../Capitals";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { useSharedState } from '../SharedState';

export default function Index() {
    const { sharedValue, setSharedValue } = useSharedState();
  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {EuropeanCapitals.map((capital, index) => {
            if (sharedValue) {
                return(
                    <Marker
                            key={index}
                            coordinate={capital}
                            title={capital.capital}
                            description={capital.country}
                          />
                )
            }

        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%'
  },
});