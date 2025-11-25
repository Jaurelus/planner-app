import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from 'components/ui/button';

import CalendarView from '../../screens/calendarview';
import Profile from '../../screens/home';
import App from '../../App';

function Navbar() {
  const navigator = useNavigation();
  return (
    //
    <View className="bg-dark flex w-full flex-row justify-between py-5">
      <Button variant="ghost" onPress={() => navigator.navigate('Calendar')} className="ml-10">
        Calendar
      </Button>
      <Button variant="ghost" onPress={() => navigator.navigate('Today')}>
        Today
      </Button>
      <Button variant="ghost" onPress={() => navigator.navigate('Personal')} className="mr-10">
        Personal
      </Button>
    </View>
  );
}

export default Navbar;
