import Button from 'components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui';
import { Text, View } from 'react-native';
import { useState } from 'react';
import ColorSelector from '@/components/colorSelector';
import { Power, PowerOff } from 'lucide-react-native';
function SettingsCard({ api }: { api: string }) {
  const [categoryChanger, setCategoryChanger] = useState(false);
  const [notisON, setNotisOn] = useState(false);
  return (
    <Card className="w-[75%]">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full gap-3">
        <View className="flex w-full flex-row items-center justify-between">
          <Text>Categories</Text>
          <ColorSelector api={api}></ColorSelector>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text>Notifications</Text>
          <Button
            onPress={() => {
              setNotisOn((prev) => !prev);
            }}>
            {notisON ? (
              <View className="flex-row items-center gap-3 ">
                <Text className="text-white">OFF</Text>
                <PowerOff color={'white'} />
              </View>
            ) : (
              <View className="flex-row items-center gap-3 ">
                <Text className="text-white">ON</Text>
                <Power color={'white'} />
              </View>
            )}
          </Button>
        </View>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default SettingsCard;
