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
import { useState, useEffect } from 'react';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userDates, setUserDates] = useState<any>(null);
  const [formattedHolidays, setFormattedHolidays] = useState({});
  const [formattedUserDates, setFormattedUserDates] = useState({});

  useEffect(() => {
    console.log(userDates, 'App User dates');
  }, [userDates]);

  //If system is is a simulator, then set the API URL to :

  const API_URL = Device.isDevice
    ? 'http://192.168.12.175:3000/api/'
    : 'http://localhost:3000/api/';

  const Stack = createNativeStackNavigator();

  //Function to merge  marked dates and holidays
  const mergeDates = (object1: any, object2: any) => {
    if (!object1 && !object2) return;
    console.log('-------Keys-----\n', Object.keys(object1));
    let dateKeys = Object.keys(object1);
    let dateKey = 0;

    dateKeys.forEach((obj) => {
      //If date from 2 in 1 add it into dots
      if (Object.keys(object2).includes(obj)) {
        console.log(obj, 'obj IF');

        object2[obj].dots = [object1[obj].dots, ...object2[obj].dots];
        console.log(object2[obj].dots);
      } else {
        let line = { [obj]: object1[obj] };
        if (Object.keys(object2).includes(obj)) {
          return;
        }

        console.log(line, 'line');
        Object.assign(object2, line);
        //console.log(object2);
      }

      dateKey += 1;

      return object2;
    });
    console.log(object2);
    console.log(Object.keys(object2));
    setFormattedUserDates(object2);
    return object2;
  };

  //--------- API CALLS -------------

  //Function to get all marked dates
  const getMarkedDates = async () => {
    if (!userToken || !userInfo._id) return;
    console.log('getting dates');
    try {
      const response = await fetch(API_URL + 'dates', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', AuthToken: userToken, userid: userInfo._id },
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Success!!');
        console.log(data);
        let formattedDates;
        if (data.userDates.length >= 0) {
          formattedDates = data.userDates.reduce((acc, currVal) => {
            acc[currVal.date.slice(0, 10)] = {
              dots: [{ key: currVal.name, color: currVal.category.color || currVal.color }],
              ...currVal,
            };

            return acc;
          }, {});
        }

        setUserDates(formattedDates);
      } else {
        console.log('error retrieving marked dates', data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Function to get all holidays
  const getHolidays = async () => {
    console.log('Top');

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
            ...currHoliday,
          };
          return acc;
        }, {});
        setFormattedHolidays(reducedHolidays);
      } else console.log(String(response.status), data.message);
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
    console.log('Holidays\n\n ', formattedHolidays);
  }, []);
  useEffect(() => {
    getMarkedDates();
  }, [userToken, userInfo]);
  useEffect(() => {
    getHolidays();
  }, []);
  useEffect(() => {
    if (userDates != null && formattedHolidays != null) {
      mergeDates(userDates, formattedHolidays);
    }
  }, [userDates, formattedHolidays]);
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
          {formattedUserDates && (
            <Stack.Screen
              name="Goals"
              component={CalendarScreen}
              initialParams={{
                api: API_URL,
                dates: formattedUserDates,
              }}
            />
          )}
          <Stack.Screen name="Personal" component={Personal} />
          {formattedUserDates && (
            <Stack.Screen
              name="Today"
              component={Daily}
              initialParams={{ api: API_URL, dates: formattedUserDates }}
            />
          )}

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
