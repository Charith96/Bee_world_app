import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import TabBar from "../components/TabBar";
import Home from "../components/Home";
import BeeMap from "../components/mapComponet/BeeMap";


//invoke navigation function. it will return a component
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ icon: require("../images/Farm(1).png") }}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Report"
        component={Home}
        initialParams={{ icon: require("../images/Catalogue.png") }}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Prescription"
        component={Home}
        initialParams={{ icon: require("../images/Layer2.png") }}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="a"
        component={Home}
        initialParams={{ icon: require("../images/Store.png") }}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="b"
        component={BeeMap}
        initialParams={{ icon: require("../images/Frame.png") }}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
