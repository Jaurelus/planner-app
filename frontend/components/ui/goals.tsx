import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './card';
function Goals() {
  return (
    <View className="">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-center">Goals</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </View>
  );
}

export default Goals;
