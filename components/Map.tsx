import { Text, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        tintColor="black"
        mapType="mutedStandard"
        //initialRegion={Region}
        showsUserLocation={true}
        userInterfaceStyle="light"
      >
        <Text>Map</Text>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
