import SettingsCard from '@/components/settings';
import UserCard from '@/components/usercard';
import { useSafeAreaEnv } from 'nativewind';
import { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';

interface PersonalProps {
  route: any;
}
function Personal({ route }: PersonalProps) {
  const { userInfo } = route.params;
  //-------- App Build---------

  console.log(userInfo, 'p');
  return (
    <View className="flex items-center">
      <Text>Personal</Text>

      {userInfo && (
        <View className="w-full items-center">
          <UserCard user={userInfo}></UserCard>
        </View>
      )}
      <View className="mt-12">
        <SettingsCard></SettingsCard>
      </View>
    </View>
  );
}

export default Personal;
