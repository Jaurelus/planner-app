import SettingsCard from '@/components/settings';
import UserCard from '@/components/usercard';
import { useSafeAreaEnv } from 'nativewind';
import { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface PersonalProps {
  route: any;
}
function Personal({ route }: PersonalProps) {
  //-------- App Build---------

  return (
    <View className="flex items-center">
      <Text>Personal</Text>

      {
        <View className="w-full items-center">
          <UserCard user={SecureStore.getItemAsync('user')}></UserCard>
        </View>
      }
      <View className="mt-12">
        <SettingsCard></SettingsCard>
      </View>
    </View>
  );
}

export default Personal;
