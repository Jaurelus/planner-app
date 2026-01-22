import { View, ScrollView } from 'react-native';
import {
  WeekCalendar,
  CalendarContext,
  DateData,
  ExpandableCalendar,
} from 'react-native-calendars';
import { useColorScheme } from 'react-native';
import Goals from './goals';
import { useContext, useState } from 'react';

function WeeklyView({ api }: { api: string }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const context = useContext(CalendarContext);
  const [date, setDate] = useState<string>();
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
  return (
    <ScrollView className="flex-col">
      <View className=" block">
        <WeekCalendar
          theme={calendarTheme}
          date={date || context.date}
          closeOnDayPress={true}
          firstDay={1}
          onDayPress={(date) => {
            setDate(date.dateString);
            context.setDate(date.dateString, 'weeklyView');
          }}></WeekCalendar>
      </View>
      <View className="mb-15">
        <Goals api={api} />
      </View>
    </ScrollView>
  );
}
export default WeeklyView;
