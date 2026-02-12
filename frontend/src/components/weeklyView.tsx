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
import { cn } from 'lib/utils';
import Button from 'components/ui/button';
import CustTdyBtn from './ui/custTodayBtn';

interface WeeklyViewProps {
  api: string;
  scrollDate: Date;
  markedDates: {};
}

function WeeklyView({ api, scrollDate, markedDates }: WeeklyViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const context = useContext(CalendarContext);
  const [date, setDate] = useState<string>(scrollDate.toISOString().slice(0, 10));

  const prepareDate = (dateString?: string, dateDate?: Date) => {
    if (dateDate) {
      return (
        dateDate.getFullYear() +
        '-' +
        String(dateDate.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(dateDate.getDate()).padStart(2, '0')
      );
    }
    return (
      new Date().getFullYear() +
      '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '-' +
      String(new Date().getDate()).padStart(2, '0')
    );
  };

  const handleTdyBtn = () => {
    let tmpTdy = new Date();
    console.log(tmpTdy);
    setDate(prepareDate(undefined, tmpTdy));
  };

  const calendarTheme = {
    backgroundColor: isDark ? '#200524' : '#FFFFFF',
    calendarBackground: isDark ? '#200524' : '#FFFFFF',
    textSectionTitleColor: isDark ? '#F6DBFA' : '#754ABF',
    selectedDayBackgroundColor: isDark ? '#A77ED6' : '#FFFFFF',
    selectedDayTextColor: '#000000',
    todayTextColor: isDark ? '#E89B6E' : '#000000',
    dayTextColor: isDark ? '#FFFFFF' : '#200524',
    textDisabledColor: isDark ? '#6B4A7A' : '#C4A8D4',
    monthTextColor: isDark ? '#F6DBFA' : '#200524',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
  };
  return (
    <ScrollView className="flex-col">
      <View className="relative flex">
        <CalendarProvider
          className="relative flex flex-1"
          showTodayButton
          todayBottomMargin={16}
          todayButtonStyle={{
            marginTop: 0,
            display: 'flex',
            position: 'absolute',
            top: 0,
            zIndex: 1000,
          }}
          date={date}
          onDateChanged={(date) => {
            console.log(date);

            setDate(date);
          }}>
          <ExpandableCalendar
            markedDates={markedDates}
            hideKnob={true}
            theme={calendarTheme}
            hideArrows={true}
            //disablePan={true}
            //current={date}
            firstDay={1}
            onDayPress={(day) => {
              console.log(day);
              setDate(day.dateString);
            }}></ExpandableCalendar>
          {/*View to display a button to change the date to today */}
          <View className="h-[vh] w-full items-center justify-end bg-white">
            <View className="w-[50%]">
              <CustTdyBtn onPress={handleTdyBtn} />
            </View>
          </View>
          <Goals api={api} scrollDate={date} />
        </CalendarProvider>
      </View>
    </ScrollView>
  );
}
export default WeeklyView;
