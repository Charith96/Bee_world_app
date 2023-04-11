import axios from "axios";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const Home = ({ navigation }) => {
  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets[0].uri);

    setImage(result.assets[0].uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../images/Box02.png")}
        style={styles.background}
      >
        <View style={styles.main}></View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  background: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
  },
  main: {
    paddingTop: 250,
  },
  item: {
    backgroundColor: "white",
    padding: 25,
    borderLeftWidth: 10,
    borderLeftColor: "green",
    borderRadius: 10,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    paddingLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  touchableTextStyle: {
    color: "white",
    margin: 30,
    fontSize: 25,
  },
  accidentVideo: {
    // width: "100%",
    height: 80,
    backgroundColor: "white",
    margin: 0,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});

export default Home;
