import { View, useColorScheme, Text, Modal, Pressable } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { use, useEffect, useRef, useState } from 'react';
import Button from './ui/button';

function MonthlyView({ markedDates }: { markedDates: {} }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selected, setSelected] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [myVar, setmyVar] = useState(false);
  const calendarRef = useRef<any>(null);
  const [addMark, setAddMark] = useState(false);
  const [currLongPressDate, setCurrLongPressDate] = useState<Date>(new Date());
  const [dateKey, setDateKey] = useState('');

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
    if (dateString) {
      return dateString.split('-');
    }
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
        {/*Modal for the DateTimePicker in Calendar Header */}

        <Modal transparent={true} visible={myVar} onBlur={() => {}}>
          <Pressable
            className="top-40 h-16 flex-1 items-center "
            onPress={() => {
              setmyVar(false);
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

        {/*Modal for modifying a marked date */}

        <Modal visible={addMark}>
          <View className="flex h-screen w-screen flex-1 items-center justify-start py-12">
            <View className="flex w-full flex-row justify-end">
              <Button
                className="mr-4 mt-4 rounded-full"
                variant="destructive"
                onPress={() => {
                  setAddMark(false);
                }}>
                X
              </Button>
            </View>
            <View className="gap-4">
              <Text className="mt-4 text-center font-bold">
                {currLongPressDate?.toUTCString().slice(4, 11).split(' ').reverse().join(' ')}
                {currLongPressDate?.getFullYear()}
              </Text>
              {Object.hasOwn(markedDates, currLongPressDate.toISOString().slice(0, 10)) && (
                <View className="mb-10 mt-10 flex flex-row justify-center">
                  <Text className="mt-1">
                    {markedDates[currLongPressDate.toISOString().slice(0, 10)].name}
                  </Text>
                  <Text
                    className="-mt-5 text-5xl font-bold"
                    style={{
                      color: markedDates[currLongPressDate.toISOString().slice(0, 10)].dotColor,
                    }}>
                    .
                  </Text>
                </View>
              )}
              <View className="mt-0 flex h-full items-center">
                <Text className="text-xl font-semibold">Mark This Day?</Text>
                <View></View>
              </View>
            </View>
          </View>
        </Modal>
        <Calendar
          markingType="multi-dot"
          markedDates={markedDates}
          ref={calendarRef}
          key={prepareDate(undefined, selectedDate)}
          onDayLongPress={(date) => {
            console.log(markedDates);
            setAddMark(true);
            setCurrLongPressDate(new Date(date.dateString));
            setDateKey(currLongPressDate.toISOString());
          }}
          onMonthChange={(date) => {
            let tmpStr = String(date.year) + '-' + String(date.month) + '-' + String(date.day);
            console.log(tmpStr);
            setSelectedDate(new Date(tmpStr));
          }}
          hideArrows={myVar}
          theme={calendarTheme}
          current={prepareDate(undefined, selectedDate)}
          renderHeader={(date, info) => {
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
        <Button onPress={() => {}}>Test API</Button>
      </View>
    </View>
  );
}
export default MonthlyView;
