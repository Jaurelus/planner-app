import { View, ScrollView } from 'react-native';
import {
  WeekCalendar,
  CalendarContext,
  CalendarProvider,
  ExpandableCalendar,
} from 'react-native-calendars';
import { useColorScheme } from 'react-native';
import Goals from './goals';
import { useContext, useEffect, useState } from 'react';

interface WeeklyViewProps {
  api: string;
  scrollDate: Date;
}

function WeeklyView({ api, scrollDate }: WeeklyViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const context = useContext(CalendarContext);
  const [date, setDate] = useState<string>(scrollDate.toISOString().slice(0, 10));
  useEffect(() => {
    setDate(scrollDate.toISOString().slice(0, 10));
  }, [scrollDate]);

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
        <CalendarProvider
          date={date}
          onDateChanged={(date) => {
            setDate(date);
          }}>
          <ExpandableCalendar
            hideKnob={true}
            theme={calendarTheme}
            //disablePan={true}
            //current={date}
            firstDay={1}
            onDayPress={(date) => {
              setDate(date.dateString);
              context.setDate(date.dateString, 'weeklyView');
            }}></ExpandableCalendar>
        </CalendarProvider>
      </View>
      <View className="mb-15">
        <Goals api={api} scrollDate={date} />
      </View>
    </ScrollView>
  );
}
export default WeeklyView;
