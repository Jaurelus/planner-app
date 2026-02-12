import { View, useColorScheme } from 'react-native';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '@/screens/home';
import Personal from '@/screens/personal';
import Daily from '@/screens/today';
import CalendarScreen from '@/screens/calendarScreen';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import { useState } from 'react';
import * as Device from 'expo-device';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState(false);

  //If system is is a simulator, then set the API URL to :

  const API_URL = Device.isDevice
    ? 'http://192.168.12.175:3000/api/'
    : 'http://localhost:3000/api/';

  const Stack = createNativeStackNavigator();

  //Function to format all marked dates
  const formatMarkedDates = () => {
    //Assign color based on type
  };
  //Function to get all marked dates
  const getMarkedDates = async () => {
    try {
      const response = await fetch(API_URL + 'dates', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', AuthToken: 'token' },
      });
      if (response.status == 200) {
        console.log('Success');
      } else {
        console.log('error retrieving marked dates');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex flex-1">
      <NavigationContainer>
        <Stack.Navigator>
          {!user && (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              initialParams={{ api: API_URL, onChange: setUser }}
            />
          )}
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen
            name="Goals"
            component={CalendarScreen}
            initialParams={{
              api: API_URL,
            }}
          />
          <Stack.Screen name="Personal" component={Personal} />
          <Stack.Screen name="Today" component={Daily} initialParams={{ api: API_URL }} />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            initialParams={{ api: API_URL }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
