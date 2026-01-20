import AgendaTasks from '@/components/agendaTasks';
import { View, Text } from 'react-native';
import { Agenda, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { useColorScheme } from 'react-native';

function Daily({ navigation }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const calendarTheme = {
    backgroundColor: isDark ? '#200524' : '#FFFFFF',
    calendarBackground: isDark ? '#200524' : '#FFFFFF',
    textSectionTitleColor: isDark ? '#F6DBFA' : '#754ABF',
    selectedDayBackgroundColor: isDark ? '#A77ED6' : '#F6DBFA',
    selectedDayTextColor: '#000000',
    todayTextColor: isDark ? '#E89B6E' : '#D48354',
    dayTextColor: isDark ? '#FFFFFF' : '#200524',
    textDisabledColor: isDark ? '#6B4A7A' : '#C4A8D4',
    monthTextColor: isDark ? '#F6DBFA' : '#200524',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
  };
  const prepareDate = () => {
    return (
      new Date().getFullYear() +
      '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '-' +
      String(new Date().getDate()).padStart(2, '0')
    );
  };
  return (
    <CalendarProvider date={prepareDate()}>
      <View className="flex flex-1 flex-col">
        <AgendaTasks></AgendaTasks>
      </View>
    </CalendarProvider>
  );
}

export default Daily;
