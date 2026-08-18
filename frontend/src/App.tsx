import { View, useColorScheme, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import './global.css';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '@/screens/homeScreen/home';
import ToastProvider from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import Personal from '@/screens/personalScreen/personal';
import Daily from '@/screens/todayScreen/today';
import CalendarScreen from '@/screens/calendarScreen/calendarScreen';
import LoginScreen from './screens/loginScreen/loginScreen';
import RegisterScreen from './screens/registerScreen/registerScreen';
import FinanceScreen from './screens/financeScreen/financeScreen';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userDates, setUserDates] = useState<[]>();
  const [formattedHolidays, setFormattedHolidays] = useState<Record<string, any>>();
  const [mergedDates, setmergedDates] = useState<{}>({});
  const [refreshDates, setRefreshDates] = useState(false);
  const [notiToken, setNotiToken] = useState('');

  //If system is is a simulator, then set the API URL to :

  const API_URL = Device.isDevice
    ? 'http://192.168.12.153:3000/api/'
    : 'http://localhost:3000/api/';
  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      await validateToken(token);
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
      if (token) setUser(true);
      console.log(API_URL);
      console.log(token, user);
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

  useEffect(() => {
    getMarkedDates();
  }, [refreshDates]);
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
      } else {
        console.log(String(response.status));
        setFormattedHolidays({});
      }
    } catch (error) {
      console.log(error);
      setFormattedHolidays({});
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
    if (userDates != null && formattedHolidays != null) {
      mergeDates();
    }
  }, [userDates, formattedHolidays]);

  const getNotiToken = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      console.log('Project ID not found');
      return;
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      setNotiToken(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      console.log(`${e}`);
    }
  };

  const addToken = async () => {
    if (!userToken || !notiToken || !userInfo) return;
    const response = await fetch(API_URL + 'user/' + userInfo._id, {
      headers: { AuthToken: userToken, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({ userNotiToken: notiToken }),
    });
    const data = await response.json();
    if (response.status == 200) {
      console.log('Success saving token to server' + data);
    } else {
      console.log('Error saving token to server' + data);
    }
  };

  const logoutUser = async () => {
    console.log('Log out function');
    const response = await fetch(API_URL + 'user/logout', {
      headers: { AuthToken: userToken },
      method: 'POST',
    });
    //Destroy token
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('userInfo');
    setUserInfo(null);
    setUserToken('');
    setUser(false);
    console.log('User Info cleared');
    console.log('Redirect');
    //Navigate to login screen
  };

  const validateToken = async (token) => {
    const response = await fetch(API_URL + 'validate', {
      headers: { AuthToken: token, 'Content-Type': 'application/json' },
    });
    if (response.status == 200) {
      return;
    } else {
      await logoutUser();
    }
  };
  // Ask the device for a push token once we know who the user is
  useEffect(() => {
    if (!userInfo) return;
    getNotiToken();
  }, [userInfo]);

  useEffect(() => {
    //Save the token to the user model in backend
    if (!notiToken || !userInfo || !userToken) return;
    addToken();
  }, [notiToken, userInfo, userToken]);

  return (
    <ErrorBoundary>
      <ToastProvider>
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
                  <Stack.Screen name="Home" component={HomePage} initialParams={{ api: API_URL }} />
                  {mergedDates && (
                    <Stack.Screen
                      name="Goals"
                      component={CalendarScreen}
                      initialParams={{
                        api: API_URL,
                        dates: mergedDates,
                        refreshDates: setRefreshDates,
                      }}
                    />
                  )}
                  <Stack.Screen
                    name="Personal"
                    component={Personal}
                    initialParams={{ api: API_URL, onChange: setUserInfo }}
                  />
                  {mergedDates && (
                    <Stack.Screen
                      name="Today"
                      component={Daily}
                      initialParams={{
                        api: API_URL,
                        dates: mergedDates,
                        refreshDates: setRefreshDates,
                      }}
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
      </ToastProvider>
    </ErrorBoundary>
  );
}
