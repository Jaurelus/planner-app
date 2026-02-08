import { StatusBar } from 'expo-status-bar';
import * as Device from 'expo-device';
import { View, useColorScheme } from 'react-native';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '@/screens/home';
import Personal from '@/screens/personal';
import Daily from '@/screens/today';
import CalendarScreen from '@/screens/calendarScreen';
import { CalendarProvider } from 'react-native-calendars';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import { useState } from 'react';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  //If system is is a simulator, then set the API URL to :

  console.log(Device.isDevice);
  const API_URL = Device.isDevice
    ? 'http://192.168.12.175:3000/api/'
    : 'http://localhost:3000/api/';

  const Stack = createNativeStackNavigator();
  const [user, setUser] = useState({});
  console.log(user, 'k');

  return (
    <View className="flex flex-1">
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Goals" component={CalendarScreen} initialParams={{ api: API_URL }} />
          <Stack.Screen name="Personal" component={Personal} initialParams={{ userInfo: user }} />
          <Stack.Screen name="Today" component={Daily} initialParams={{ api: API_URL }} />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            initialParams={{ api: API_URL, onChange: setUser }}
          />
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
