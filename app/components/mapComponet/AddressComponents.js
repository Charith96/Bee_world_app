import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAP_KEY } from "../../../environment";

const AddressComponents = ({ placheholderText, fetchAddress }) => {
  const onPressAddress = (data, details) => {

    let resLength = details.address_components;
    let zipCode = "";

    let filtersResCity = details.address_components.filter((val) => {
      if (val.types.includes("locality") || val.types.includes("sublocality")) {
        return val;
      }
      if (val.types.includes("postal_code")) {
        let postalCode = val.long_name;
        zipCode = postalCode;
      }
      return false;
    });

    let dataTextCityObj =
      filtersResCity.length > 0
        ? filtersResCity[0]
        : details.address_components[
            resLength > 1 ? resLength - 2 : resLength - 1
          ];

    let cityText =
      dataTextCityObj.long_name && dataTextCityObj.long_name.length > 17
        ? dataTextCityObj.short_name
        : dataTextCityObj.long_name;

    // console.log("zip cod found", zipCode)
    // console.log("city namte", cityText)

    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    const mapDetails = details.geometry.location;
    fetchAddress(lat, lng, zipCode, cityText);

  };

  return (
    <>
      <GooglePlacesAutocomplete
        styles={{
          textInput: styles.input,
          textInputContainer: styles.inputContainer,
        }}
        placeholder={placheholderText}
        // renderLeftButton={() => (
        //   <Image
        //     source={require('../../images/icon-search.png')}
        //     style={{ width: 25, height: 25, marginTop: 20 }}
        //   />
        // )}
        onPress={onPressAddress}
        fetchDetails={true}
        enablePoweredByContainer={false}
        query={{
          key: MAP_KEY,
          language: "en",
        }}
        enableHighAccuracyLocation={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#fff",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowColor: "#888888",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 7,
  },
  inputContainer: {
    width: "95%",
    color:'#8189B0',
  },
});

export default AddressComponents;
