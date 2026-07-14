import SettingsCard from '@/screens/personalScreen/settings';
import SignoutCard from '@/screens/personalScreen/signoutCard';
import UserCard from '@/screens/personalScreen/usercard';
import { useSafeAreaEnv } from 'nativewind';
import { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';

interface PersonalProps {
  route: any;
}
function Personal({ route }: PersonalProps) {
  const { api, onChange } = route.params;

  //-------- App Build---------

  return (
    <View className="flex flex-1 items-center justify-between py-5">
      <View className=" flex w-full items-center">
        <UserCard api={api}></UserCard>
      </View>
      <View className="flex">
        <SettingsCard></SettingsCard>
      </View>
      <View className="mb-5 flex">
        <SignoutCard
          api={api}
          onLogout={() => {
            onChange(false);
          }}
        />
      </View>
    </View>
  );
}

export default Personal;
