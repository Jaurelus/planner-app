import AgendaTasks from '@/components/agendaTasks';
import { View, Text } from 'react-native';
import { Agenda, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { useColorScheme } from 'react-native';

function Daily({ route, navigation }) {
  const { api } = route.params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex flex-1 flex-col">
      <AgendaTasks api={api}></AgendaTasks>
    </View>
  );
}

export default Daily;
