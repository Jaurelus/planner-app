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

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  //If system is is a simulator, then set the API URL to :

  console.log(Device.isDevice);
  const API_URL = Device.isDevice
    ? 'http://192.168.12.175:3000/api/'
    : 'http://localhost:3000/api/';

  const Stack = createNativeStackNavigator();

  const prepareDate = () => {
    return (
      new Date().getFullYear() +
      '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '-' +
      String(new Date().getDate()).padStart(2, '0')
    );
  };

  const calendarTheme = {
    backgroundColor: isDark ? '#200524' : '#FFFFFF',
    calendarBackground: isDark ? '#200524' : '#FFFFFF',
    textSectionTitleColor: isDark ? '#F6DBFA' : '#754ABF',
    selectedDayBackgroundColor: isDark ? '#A77ED6' : '#F6DBFA',
    selectedDayTextColor: '#000000',
    todayTextColor: isDark ? '#E89B6E' : '#D48354',
    dayTextColor: isDark ? '#FFFFFF' : '#200524',
    textDisabledColor: isDark ? '#6B4A7A' : '#C4A8D4',
    monthTextColor: isDark ? '#F6DBFA' : '#200524',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
  };

  return (
    <View className="flex flex-1">
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Goals" component={CalendarScreen} initialParams={{ api: API_URL }} />
          <Stack.Screen name="Personal" component={Personal} />
          <Stack.Screen name="Today" component={Daily} initialParams={{ api: API_URL }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
