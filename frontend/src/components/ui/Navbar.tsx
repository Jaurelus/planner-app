import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from './button';
import { LayoutList, CircleUserRound, Goal } from 'lucide-react-native';

function Navbar() {
  const navigator = useNavigation();
  return (
    //
    <View className="flex w-full flex-row justify-between bg-primary py-5 ">
      <Button
        variant="ghost"
        onPress={() => navigator.navigate('Goals')}
        textClassName="color-white"
        className="ml-10">
        <Goal color={'white'} />
      </Button>
      <Button
        variant="ghost"
        onPress={() => navigator.navigate('Today')}
        textClassName="color-white">
        <LayoutList color={'white'} />
      </Button>
      <Button
        variant="ghost"
        onPress={() => navigator.navigate('Personal')}
        className="mr-10"
        textClassName="color-white">
        <CircleUserRound color={'white'} />
      </Button>
    </View>
  );
}

export default Navbar;
