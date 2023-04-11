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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Foundation } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
const DATA = [
  {
    id: 1,
    title: "ESR",
    rName: "ESR",
    date: "2023/01/10",
    data: ["Ticket No:#50001"],
  },
  {
    id: 2,
    title: "CRP",
    rName: "CRP",
    date: "2023/01/10",
    data: ["Ticket No:#50001"],
  },
  {
    id: 3,
    title: "X-Ray",
    rName: "ESR",
    date: "2023/01/10",
    data: ["Ticket No:#50001"],
  },
  {
    id: 4,
    title: "FBS",
    rName: "ESR",
    date: "2023/01/10",
    data: ["Ticket No:#50001"],
  },
  {
    id: 5,
    title: "FBC",
    rName: "ESR",
    date: "2023/01/10",
    data: ["Ticket No:#50001"],
  },
  {
    id: 5,
    title: "FBC",
    rName: "ESR",
    date: "2023/01/10",
    data: ["Ticket No:#50001"],
  },
];

const Reports = ({ navigation }) => {
  const [fines, setFines] = React.useState([]);
  const [image, setImage] = useState(null);

  const handleReportViolation = (id) => {
    navigation.navigate("reportDetails", {
      fineId: id,
    });
  };

  console.log(fines.fines);

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
      <Text style={styles.title}>{fines.message}</Text>
      <View>
        <TouchableOpacity style={styles.accidentVideo} onPress={uploadImage}>
          {image === null ? (
            <>
              {/* <AntDesign name="addvideo" size={30} color="black" /> */}
              <AntDesign name="addfile" size={24} color="black" />
              <Text>Add Report</Text>
            </>
          ) : (
            <Image source={{ uri: image }} style={styles.defaultImage} />
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={DATA}
        keyExtractor={(item, index) => item.id + index.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.item}>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text>Date {item.date}</Text>
                <Text>Reference No {item.id}</Text>
              </View>

              <TouchableOpacity
                mode="contained"
                onPress={() => handleReportViolation(item._id)}
                style={{
                  backgroundColor: "green",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={styles.touchableTextStyle}>Report</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
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

export default Reports;
