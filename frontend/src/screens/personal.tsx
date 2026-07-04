import SettingsCard from '@/components/settings';
import SignoutCard from '@/components/signoutCard';
import UserCard from '@/components/usercard';
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
    <View className="flex items-center gap-5">
      <Text>Personal</Text>

      {
        <View className="w-full items-center">
          <UserCard api={api}></UserCard>
        </View>
      }
      <View className="mt-12">
        <SettingsCard></SettingsCard>
      </View>
      <View>
        <SignoutCard api={api} onLogout={()=>{onChange(false)}}/>
      </View>
    </View>
  );
}

export default Personal;
