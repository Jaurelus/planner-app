import AgendaTasks from '@/screens/todayScreen/agendaTasks';
import { View, Text } from 'react-native';
import { Agenda, CalendarProvider, ExpandableCalendar, DateData } from 'react-native-calendars';
import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { todayString } from 'react-native-calendars/src/expandableCalendar/commons';
import MarkedDateModal from '@/components/markedDateModal';

function Daily({ route, navigation }) {
  const { api, dates, refreshDates } = route.params;
  const colorScheme = useColorScheme();
  const today = new Date();
  const [longDate, setLongDate] = useState<Date>();

  const [modalVisible, setModalVisible] = useState(false);
  const todayStr =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    today.getDate().toString().padStart(2, '0');
  const [selectedDate, setSelectedDate] = useState<any>(null);

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
  const handleLongPress = (day: DateData) => {
    setModalVisible(true);
    let tmpDate = new Date(day.dateString);
    setLongDate(tmpDate);
  };

  return (
    <CalendarProvider date={todayStr} onDateChanged={(date) => setSelectedDate(date)}>
      <View className="flex flex-1 flex-col">
        <ExpandableCalendar
          onPressArrowRight={() => {}}
          onPressArrowLeft={() => {}}
          theme={calendarTheme}
          closeOnDayPress
          firstDay={1}
          markingType="multi-dot"
          markedDates={dates}
          pagingEnabled
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            console.log(day.dateString);
          }}
          onDayLongPress={(day) => {
            handleLongPress(day);
          }}
        />
        <AgendaTasks api={api} date={selectedDate || todayStr}></AgendaTasks>
        {longDate && (
          <MarkedDateModal
            date={longDate.toISOString()}
            api={api}
            visible={modalVisible}
            setVisible={setModalVisible}
            markedDates={dates}
            refreshDates={refreshDates}></MarkedDateModal>
        )}
      </View>
    </CalendarProvider>
  );
}

export default Daily;
