import Button from 'components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui';
import { Text, View } from 'react-native';
import { useState } from 'react';
import ColorSelector from '@/components/colorSelector';
function SettingsCard({ api }: { api: string }) {
  const [categoryChanger, setCategoryChanger] = useState(false);
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
              setCategoryChanger(true);
            }}>
            ...
          </Button>
        </View>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default SettingsCard;
