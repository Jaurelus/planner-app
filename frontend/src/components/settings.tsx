import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';
import { Text } from 'react-native';
function SettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>Marked Date Cat Colors</Text>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default SettingsCard;
