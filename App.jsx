// In App.js in a new project

import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import googlelogin from './src/googlelogin.jsx';
import GoogleLogoutScreen from './src/logout.jsx';
import ChatListScreen from './src/chatlist.jsx';
import DeviceInfoScreen from './src/deviceinfo.jsx';
import FirebaseCrudScreen from './src/usersavefirbas.jsx';
import map from './src/map.jsx';
import Geolocation from '@react-native-community/geolocation';
import DirectoryPickerScreen from './src/docpicker.jsx';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignupScreen from './src/screen/SignupScreen.js';
import UuidScreen from './src/screen/SignupScreen.js';
import LoginScreen from './src/screen/LoginScreen.js';
import chatlist from './src/screen/chatlist.jsx';
import chatscreen from './src/screen/chatscreen.jsx';
navigator.geolocation = Geolocation;
function HomeScreen() {

  let navagation = useNavigation()
  return (
    <>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button onPress={() => navagation.navigate("googlelogin")} title='go loging'></Button>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button onPress={() => navagation.navigate("docpicker")} title='go logout'></Button>
      </View>
    </>
  );
}

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
         <Stack.Screen name="Home" component={SignupScreen} />
      <Stack.Screen name="chatlist" component={chatlist} />
            {/* <Stack.Screen name="Home" component={SignupScreen} /> */}
      <Stack.Screen name="logout" component={GoogleLogoutScreen} />
      {/* <Stack.Screen name="chatlist" component={ChatListScreen} /> */}
      <Stack.Screen name="deviceinfo" component={DeviceInfoScreen} />
      <Stack.Screen name="firbasesata" component={FirebaseCrudScreen} />
            <Stack.Screen name="docpicker" component={DirectoryPickerScreen} />
  <Stack.Screen name="loging" component={LoginScreen} />
      <Stack.Screen name="map" component={map} />
  <Stack.Screen name="chatroom" component={chatscreen} />
    </Stack.Navigator>
  );
}


function MyDrawer() {
  return (
    <Drawer.Navigator
    initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: 'green' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#e0e0e0', width: 240 },
        drawerActiveTintColor: '#6200ee',
        drawerLabelStyle: { fontSize: 16 },
      }}
    
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={DeviceInfoScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
<RootStack/>
    </NavigationContainer>
  );
}