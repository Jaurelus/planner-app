import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import Button from './button';
function Goals() {
  return (
    <View className="">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-center">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Create Goal</Button>
        </CardContent>
      </Card>
    </View>
  );
}

export default Goals;
