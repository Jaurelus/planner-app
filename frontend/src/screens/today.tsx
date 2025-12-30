import AgendaTasks from '@/components/agendaTasks';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';

function Daily({ navigation }) {
  return (
    <View className="flex flex-1 flex-col">
      <Text>Today</Text>
      <Text>??</Text>
      <AgendaTasks></AgendaTasks>
    </View>
  );
}

export default Daily;
