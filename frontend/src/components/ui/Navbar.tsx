import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from './button';
import { LayoutList, CircleUserRound, Goal, Landmark } from 'lucide-react-native';

function Navbar() {
  const navigator = useNavigation();
  return (
    //
    <View className="flex w-full flex-row justify-between bg-primary px-4 py-5">
      <Button
        variant="ghost"
        onPress={() => navigator.navigate('Goals')}
        textClassName="color-white">
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
        onPress={() => navigator.navigate('Finance')}
        textClassName="color-white">
        <Landmark color={'white'} />
      </Button>
      <Button
        variant="ghost"
        onPress={() => navigator.navigate('Personal')}
        textClassName="color-white">
        <CircleUserRound color={'white'} />
      </Button>
    </View>
  );
}

export default Navbar;
