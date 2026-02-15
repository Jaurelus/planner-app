import AgendaTasks from '@/components/agendaTasks';
import { View, Text } from 'react-native';
import { Agenda, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { todayString } from 'react-native-calendars/src/expandableCalendar/commons';

function Daily({ route, navigation }) {
  const { api, dates } = route.params;
  const colorScheme = useColorScheme();
  const today = new Date();
  today.setUTCHours(0, 0, 0);
  const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().slice(0, 10));

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

  return (
    <CalendarProvider date={selectedDate}>
      <View className="flex flex-1 flex-col">
        <ExpandableCalendar
          //onP ressArrowLeft={}
          theme={calendarTheme}
          closeOnDayPress
          firstDay={1}
          markingType="multi-dot"
          markedDates={dates}
          horizontal
          pagingEnabled
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          onDayLongPress={(day) => {
            //Add the date to marked dates
          }}
        />
        <AgendaTasks api={api} date={selectedDate}></AgendaTasks>
      </View>
    </CalendarProvider>
  );
}

export default Daily;
