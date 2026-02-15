import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { CalendarList, Calendar, CalendarContext, DateData } from 'react-native-calendars';
import { useColorScheme } from 'react-native';
import { CalendarContextProps } from 'react-native-calendars/src/expandableCalendar/Context';
import MarkedDateModal from './markedDateModal';

interface ScrollViewProps {
  onChange: (value: number) => void;
  setDate: (value: Date) => void;
  markedDates: {};
  api: string;
}

function ScrollView({ onChange, setDate, markedDates, api }: ScrollViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [longDate, setLongDate] = useState<Date>();

  const [modalVisible, setModalVisible] = useState(false);

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
    textMonthFontWeight: '600',
    textDayHeaderFontWeight: '600',
  };

  // View the week on short press pass the variable to calendarscreen (newcounter==1)
  const handleShortPress = (day: DateData) => {
    //Set date
    let tmpDate = new Date(day.dateString);
    setDate(tmpDate);
    //Weekly view
    onChange(1);
  };
  //Add a marked date on long press
  const handleLongPress = (day: DateData) => {
    setModalVisible(true);
    let tmpDate = new Date(day.dateString);
    setLongDate(tmpDate);
  };

  return (
    <View className=" flex items-center">
      <CalendarList
        onVisibleMonthsChange={(month) => {
          console.log(month);
        }}
        markingType="multi-dot"
        markedDates={markedDates}
        className=""
        enableSwipeMonths={true}
        theme={calendarTheme}
        onDayPress={(day) => {
          console.log(day);
          handleShortPress(day);
        }}
        onDayLongPress={(day) => {
          handleLongPress(day);
        }}></CalendarList>
      <View className=" ">
        {longDate && (
          <MarkedDateModal
            date={longDate.toISOString()}
            api={api}
            visible={modalVisible}
            setVisible={setModalVisible}></MarkedDateModal>
        )}
      </View>
    </View>
  );
}
export default ScrollView;
