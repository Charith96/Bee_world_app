import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import { FontAwesome, Entypo, MaterialIcons } from "@expo/vector-icons";
import AddressComponents from "./AddressComponents";
import RBSheet from "react-native-raw-bottom-sheet";
import { MAP_KEY } from "../../../environment";
import { BeeFarms } from "./beeFarms";

const { height, width } = Dimensions.get("window");

export default function BeeMap() {
  const [location, setLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinicationLocation, setdestinicationLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    pickupCords: {
      latitude: 6.1724812,
      longitude: 80.1779163,
    },
    destinationCords: {
      latitude: 6.140753,
      longitude: 80.1028181,
    },
  });
  const [newLocation, setNewLocation] = useState({
    pickupLocationCords: {},
    destinationLocationCords: {},
  });
  const mapRef = useRef("");
  const refRBSheet = useRef();
  const { pickupCords, destinationCords } = mapRegion;
  const [initialLocation, setInitialLocation] = useState("");
  const [isPickedAPlace, setIsPickedAPlace] = useState(false);
  const [isDerectionClicked, setIsDerectionClicked] = useState(false);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [farmName, setFarmName] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  const getCurrentLocation = () => {
    if (count === 0) {
      try {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            console.error("Location permission denied");
            return;
          }

          let { coords } = await Location.getCurrentPositionAsync({});
          console.log("coords ", coords);
          setLocation(coords);
          setCurrentLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, distanceInterval: 10 },
            ({ coords }) => {
              setLocation(coords);
              setCurrentLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
              });
            }
          );
        })();

        setCount(1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, [count, getCurrentLocation]);

  // console.log("location ", location);
  // console.log("count ", count);

  // useEffect(() => {
  //   if (count === 0) {
  //     const createScriptTag = () => {
  //       const script = document.createElement("script");
  //       script.type = "text/javascript";
  //       script.async = true;
  //       script.onload = () => {
  //         const map = new window.google.maps.Map(
  //           document.getElementById("map"),
  //           {
  //             center: { lat: location.latitude, lng: location.longitude },
  //             zoom: 15,
  //             mapTypeId: "roadmap",
  //             disableDefaultUI: true,
  //           }
  //         );
  //         const trafficLayer = new window.google.maps.TrafficLayer();
  //         trafficLayer.setMap(map);
  //         setTrafficLayer(trafficLayer);
  //       };
  //       script.onerror = () => {
  //         console.error("Failed to load Google Maps API script");
  //       };
  //       script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&v=3.exp&libraries=geometry,drawing,places&callback=initMap&libraries=visualization`;
  //       document.head.appendChild(script);
  //     };

  //     if (location && isConnected) {
  //       if (window.google && window.google.maps) {
  //         createScriptTag();
  //       } else {
  //         window.initMap = createScriptTag;
  //       }
  //     }
  //   }
  //   setCount(1);
  // }, [location, isConnected, count]);

  // useEffect(() => {
  //   if (count === 0) {
  //     if (trafficLayer) {
  //       trafficLayer.setMap(isConnected ? trafficLayer.getMap() : null);
  //     }
  //   }
  // }, [isConnected, trafficLayer]);

  useEffect(() => {
    if (count === 0) {
      const unsubscribe = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected);
      });

      return () => {
        unsubscribe();
      };
    }
    setCount(1);
  }, []);

  const fetchOrginData = (lat, lng, zipCode, cityText) => {
    console.log("city ", cityText);
    // console.log("Orinelat ", lat);
    // console.log("Orine lng ", lng);
    setEndLocation(cityText);
    setIsPickedAPlace(true);
    setLocation({
      ...location,
      latitude: lat,
      longitude: lng,
    });

    mapRef.current.fitToCoordinates(location, {
      edgePadding: {
        right: 30,
        bottom: 300,
        left: 30,
        top: 300,
      },
    });
  };

  const filterFarms = isPickedAPlace
    ? BeeFarms.filter((item) => item.city === endLocation)
    : [];

  const locateBeeFarms = () => {
    // mapRef.current.fitToCoordinates(location, 20 * 1000);
  };

  const onNavigate = () => {
    refRBSheet.current.close();
    setIsDerectionClicked(true);
  };

  const locateMe = () => {
    setIsDerectionClicked(false);
    // setIsPickedAPlace(false);
  };

  const closeBottomSheet = () => {
    refRBSheet.current.close();
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          showsScale={true}
          zoomTapEnabled={true}
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          {isDerectionClicked && (
            <MapViewDirections
              origin={currentLocation}
              destination={destinicationLocation}
              apikey={MAP_KEY}
              strokeWidth={4}
              strokeColor="#0057e7"
              optimizeWaypoints={true}
              onReady={(result) => {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: 30,
                    bottom: 300,
                    left: 30,
                    top: 200,
                  },
                });
              }}
            />
          )}

          {isDerectionClicked && (
            <View>
              <Marker
                coordinate={currentLocation}
                title="Marker"
                image={require("../../images/locationPin.png")}
              />

              <Marker
                coordinate={destinicationLocation}
                image={require("../../images/honeypot.png")}
              />
            </View>
          )}

          {!isPickedAPlace && <Marker coordinate={location} />}
          {/* {isPickedAPlace && (
            <Polygon
              coordinates={filterFarms.map(
                (farm, index) => (
                  { latitude: farm.latitude, longitude: farm.longitude },
                  { latitude: farm.latitude, longitude: farm.longitude }
                )
              )}
              strokeWidth={1} // The width of the outline of the shape
              strokeColor="#4099FF" // Color of the outline
              strokeOpacity="0.8"
            />
          )} */}

          {isPickedAPlace && !isDerectionClicked && filterFarms.length > 0
            ? filterFarms.map((farm, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: farm.latitude,
                      longitude: farm.longitude,
                    }}
                    title={farm.farmName}
                    image={require("../../images/honeypot.png")}
                    onPress={() => {
                      refRBSheet.current.open();
                      console.log("id ", farm.id);
                      setFarmName(farm.farmName);
                      setDescription(farm.description);
                      setdestinicationLocation({
                        latitude: farm.latitude,
                        longitude: farm.longitude,
                      });
                    }}
                  ></Marker>
                );
              })
            : []}
        </MapView>
      )}

      <View style={styles.searchField}>
        <AddressComponents
          placheholderText="Search"
          fetchAddress={(lat, lng, zipCode, cityText) =>
            fetchOrginData(lat, lng, zipCode, cityText)
          }
        />
        <TouchableOpacity style={styles.searchButton} onPress={locateBeeFarms}>
          <FontAwesome name={"sliders"} size={30} color={"#8189B0"} />
        </TouchableOpacity>
      </View>

      {isDerectionClicked && (
        <View style={styles.endButtonView}>
          <TouchableOpacity style={styles.endButton} onPress={locateMe}>
            <MaterialIcons name={"gps-fixed"} size={30} color={"#000"} />
          </TouchableOpacity>
        </View>
      )}

      <View>
        <RBSheet
          ref={refRBSheet}
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}
        >
          <View style={{ height: 300 }}>
            <View style={styles.bottomTogleContainer}>
              <TouchableOpacity
                onPress={closeBottomSheet}
                style={styles.bottomSheetToggle}
              ></TouchableOpacity>
            </View>
            <Text style={styles.bottomSheetHeader}>{farmName}</Text>
            <Text style={styles.bottomSheetData}>{description}</Text>
            <View style={styles.derectionButtonContainer}>
              <TouchableOpacity
                onPress={onNavigate}
                style={styles.derectionButton}
              >
                <Entypo
                  name={"direction"}
                  size={20}
                  color={"#00000"}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Direction</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapContainer: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {},
  searchField: {
    flexDirection: "row",
    position: "absolute",
    backgroundColor: "white",
    width: "100%",
    paddingTop: height / 12,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchButton: {
    height: 45,
    width: 45,
    marginLeft: 0,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    shadowOffset: { width: 0, height: 8 },
    shadowColor: "#888888",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 7,
  },
  bottomTogleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  bottomSheetToggle: {
    display: "flex",
    justifyContent: "center",
    width: 50,
    height: 10,
    borderRadius: 20,
    backgroundColor: "#bcbcbc",
  },
  bottomSheetHeader: {
    textAlign: "center",
    color: "#000",
    marginTop: 10,
    paddingLeft: 40,
    paddingRight: 20,
    fontWeight: "900",
    fontSize: 20,
  },
  bottomSheetData: {
    textAlign: "justify",
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  derectionButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  derectionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 40,
    backgroundColor: "#ffffff",
    borderColor: "#FFAE00",
    borderWidth: 2,
    borderRadius: 10,
    color: "#00000",
    shadowOffset: { width: 0, height: 8 },
    shadowColor: "#ffd966",
    shadowOpacity: 0.25,
    shadowRadius: 0.35,
    elevation: 7,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "800",
  },
  endButtonView: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  endButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    width: 100,
    position: "relative",
    bottom: 600,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 9,
  },
});
