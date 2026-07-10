import Button from 'components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui';
import { Text, View } from 'react-native';
import { useState } from 'react';
function SettingsCard() {
  const [categoryChanger, setCategoryChanger] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>Marked Date Cat Colors</Text>
        <View>
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
