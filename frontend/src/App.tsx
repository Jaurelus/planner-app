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
import FinanceScreen from './screens/financeScreen';

import { useState, useEffect } from 'react';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import Button from 'components/ui/button';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userDates, setUserDates] = useState<[]>();
  const [formattedHolidays, setFormattedHolidays] = useState<Record<string, any>>();
  const [mergedDates, setmergedDates] = useState<{}>({});

  //If system is is a simulator, then set the API URL to :

  const API_URL = Device.isDevice
    ? 'http://192.168.12.175:3000/api/'
    : 'http://localhost:3000/api/';
  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
  }, []);
  const Stack = createNativeStackNavigator();

  //Function to merge  marked dates and holidays
  const mergeDates = () => {
    if (!formattedHolidays || !userDates) return;
    const merged = { ...formattedHolidays };
    userDates?.forEach((date) => {
      let key = date.date;
      key = key.slice(0, 10);
      if (Object.keys(formattedHolidays).includes(key)) {
        //dots
        merged[key].dots.push(date.category);
        merged[key].events.push(date);

        console.log('Info for this date');
        console.log(formattedHolidays[key]);
        console.log(formattedHolidays);
      } else {
        console.log('date', date);
        merged[key] = {
          dots: [date.category],
          events: [date],
        };
      }
    });
    setmergedDates(merged);
  };

  //--------- API CALLS -------------

  //Function to get all marked dates
  const getMarkedDates = async () => {
    if (!userToken || !userInfo._id) return;
    try {
      const response = await fetch(API_URL + 'dates', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', AuthToken: userToken, userid: userInfo._id },
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Success getting user dates');
        setUserDates(data.userDates);
      } else {
        console.log('error retrieving marked dates', data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Function to get all holidays
  const getHolidays = async () => {
    try {
      const response = await fetch(API_URL + 'holidays');
      const data = await response.json();
      if (response.status == 200) {
        const reducedHolidays = data.holidays.reduce((acc, currHoliday) => {
          let dateH = currHoliday.date.slice(0, 10);
          acc[dateH] = {
            dots: [
              {
                key: currHoliday.name,
                color: currHoliday.color || 'red',
                selectedColor: currHoliday.color || 'red',
              },
            ],
            events: [currHoliday],
          };
          return acc;
        }, {});
        setFormattedHolidays(reducedHolidays);
      } else console.log(String(response.status));
    } catch (error) {
      console.log(error);
    }
  };

  //Use Effects to initiliaze data
  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
    getHolidays();
  }, []);
  useEffect(() => {
    getMarkedDates();
  }, [userToken, userInfo]);
  useEffect(() => {
    getHolidays();
  }, []);
  useEffect(() => {
    if (userDates != null && formattedHolidays != null) {
      mergeDates();
    }
  }, [userDates, formattedHolidays]);
  return (
    <View className="flex flex-1">
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            <>
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
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomePage} />
              {mergedDates && (
                <Stack.Screen
                  name="Goals"
                  component={CalendarScreen}
                  initialParams={{
                    api: API_URL,
                    dates: mergedDates,
                  }}
                />
              )}
              <Stack.Screen
                name="Personal"
                component={Personal}
                initialParams={{ api: API_URL, dates: mergedDates, onChange: setUser }}
              />
              {mergedDates && (
                <Stack.Screen
                  name="Today"
                  component={Daily}
                  initialParams={{ api: API_URL, dates: mergedDates }}
                />
              )}
              {mergedDates && (
                <Stack.Screen
                  name="Finance"
                  component={FinanceScreen}
                  initialParams={{ api: API_URL, dates: mergedDates }}
                />
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
