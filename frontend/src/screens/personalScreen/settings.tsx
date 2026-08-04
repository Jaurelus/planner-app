import Button from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import ColorSelector from '@/components/colorSelector';
import { Power, PowerOff } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

function SettingsCard({ api }: { api: string }) {
  const [notisON, setNotisOn] = useState(true);
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      const parsed = user ? JSON.parse(user) : null;
      setUserInfo(parsed);
      // Seed from the saved user so the switch shows the real state
      if (parsed) setNotisOn(parsed.notificationsEnabled !== false);
    };
    fetchData();
  }, []);

  //-------- API Call --------
  const toggleNotifications = async () => {
    if (!userToken || !userInfo) return;
    const next = !notisON;
    setNotisOn(next); // optimistic, reverted below if the save fails
    try {
      const response = await fetch(api + 'user/' + userInfo._id, {
        headers: { AuthToken: userToken, 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify({ userNotisEnabled: next }),
      });
      if (response.status == 200) {
        const updated = { ...userInfo, notificationsEnabled: next };
        setUserInfo(updated);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(updated));
      } else {
        setNotisOn(!next);
      }
    } catch (error) {
      console.log('Error saving notification setting', error);
      setNotisOn(!next);
    }
  };

  return (
    <Card className="w-[75%]">
      <CardHeader className="-mx-[1] -mt-[22px] rounded-t-2xl bg-[#d1bcea] pb-2 pt-4">
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="mt-2 flex w-full gap-2">
        <View className="flex w-full flex-row items-center justify-between py-2">
          <Text className="font-medium">Categories</Text>
          <ColorSelector api={api}></ColorSelector>
        </View>
        <View className="h-[1px] w-full bg-[#d1bcea]" />
        <View className="flex flex-row items-center justify-between py-2">
          <View>
            <Text className="font-medium">Notifications</Text>
            <Text className="text-xs text-slate-500">
              {notisON ? 'Reminders are on' : 'Reminders are paused'}
            </Text>
          </View>
          <Button
            variant={notisON ? 'default' : 'outline'}
            onPress={toggleNotifications}>
            <View className="flex-row items-center gap-2">
              <Text className={notisON ? 'text-white' : 'color-black'}>
                {notisON ? 'ON' : 'OFF'}
              </Text>
              {notisON ? <Power color={'white'} size={18} /> : <PowerOff size={18} />}
            </View>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}

export default SettingsCard;
