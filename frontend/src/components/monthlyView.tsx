import { View, useColorScheme, Text, Modal, Pressable } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRef, useState } from 'react';
import Button from './ui/button';

function MonthlyView() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selected, setSelected] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [myVar, setmyVar] = useState(false);
  const calendarRef = useRef<any>(null);

  let max = new Date();
  max.setFullYear(new Date().getFullYear() + 5);
  let min = new Date();
  min.setFullYear(new Date().getFullYear() - 5);

  const calendarTheme = {
    backgroundColor: isDark ? '#200524' : '#FFFFFF',
    calendarBackground: isDark ? '#200524' : '#FFFFFF',
    textSectionTitleColor: isDark ? '#F6DBFA' : '#754ABF',
    selectedDayBackgroundColor: isDark ? '#A77ED6' : '#F6DBFA',
    selectedDayTextColor: '#F6DBFA',
    todayTextColor: isDark ? '#E89B6E' : '#D48354',
    dayTextColor: isDark ? '#F6DBFA' : '#200524',
    textDisabledColor: isDark ? '#6B4A7A' : '#C4A8D4',
    monthTextColor: isDark ? '#F6DBFA' : '#200524',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
    arrowColor: isDark ? '#ffffff' : '#200524',
  };

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

  return (
    <View className="flex">
      <View>
        <Modal
          transparent={true}
          visible={myVar}
          onBlur={() => {
            console.log('Bandds');
          }}>
          <Pressable
            className="top-40 h-16 flex-1 items-center "
            onPress={() => {
              setmyVar(false);
              console.log('Bandz');
            }}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <DateTimePicker
                maximumDate={max}
                minimumDate={min}
                onChange={(event, date) => {
                  if (date) {
                    console.log(date);
                    const dateString = prepareDate(undefined, date);
                    setSelectedDate(date);
                    calendarRef.current?.scrollToMonth(dateString);
                  }
                }}
                display="spinner"
                style={{ backgroundColor: '#ffffff' }}
                mode="date"
                value={selectedDate}></DateTimePicker>
            </Pressable>
          </Pressable>
        </Modal>
        <Calendar
          ref={calendarRef}
          key={prepareDate(undefined, selectedDate)}
          onMonthChange={(date) => {
            let tmpStr = String(date.year) + '-' + String(date.month) + '-' + String(date.day);
            console.log(tmpStr);
            setSelectedDate(new Date(tmpStr));
          }}
          hideArrows={myVar}
          theme={calendarTheme}
          current={prepareDate(undefined, selectedDate)}
          renderHeader={(date, info) => {
            console.log(date);
            if (myVar) {
              return (
                <View className="inset-x-0 w-full items-center justify-center gap-5 bg-white py-32"></View>
              );
            }
            let trueDate = new Date(date);
            let mth = trueDate.toLocaleString('en-US', { month: 'short' });
            let year = trueDate.toLocaleString('en-US', { year: 'numeric' });
            return (
              <View className="flex-row gap-5">
                <Button
                  className="border-none bg-white"
                  onPress={() => {
                    setSelected((prev) => !prev);
                    setmyVar((prev) => !prev);
                  }}>
                  <Text className="text-lg font-bold">{mth}</Text>
                  <Text className="text-lg font-bold">{year}</Text>
                </Button>
              </View>
            );
          }}></Calendar>
      </View>
      <View className="justify-center">
        <Text className="mt-3 text-center"> Monthly Overview</Text>
      </View>
    </View>
  );
}
export default MonthlyView;
