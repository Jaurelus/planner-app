import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from './button';

function Navbar() {
  const navigator = useNavigation();
  return (
    //
    <View className="flex w-full flex-row justify-between bg-secondary py-5">
      <Button variant="ghost" onPress={() => navigator.navigate('Goals')} className="ml-10">
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
