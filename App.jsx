// In App.js in a new project

import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import googlelogin from './src/googlelogin.jsx';
import GoogleLogoutScreen from './src/logout.jsx';
import ChatListScreen from './src/chatlist.jsx';

function HomeScreen() {

  let navagation= useNavigation()
  return (
  <>
  
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={()=>navagation.navigate("googlelogin")} title='go loging'></Button>
    </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={()=>navagation.navigate("logout")} title='go logout'></Button>
    </View>
  </>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={googlelogin} />
        <Stack.Screen name="logout" component={GoogleLogoutScreen} />
         <Stack.Screen name="chatlist" component={ChatListScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}