import { View, ScrollView } from 'react-native';
import {
  WeekCalendar,
  CalendarContext,
  CalendarProvider,
  ExpandableCalendar,
  DateData,
} from 'react-native-calendars';
import { useColorScheme } from 'react-native';
import Goals from './goals';
import { useContext, useEffect, useState } from 'react';
import { cn } from 'lib/utils';
import Button from 'components/ui/button';
import CustTdyBtn from '../../components/ui/custTodayBtn';
import MarkedDateModal from '@/components/markedDateModal';

interface WeeklyViewProps {
  api: string;
  scrollDate: Date;
  markedDates: {};
  refreshDates: React.Dispatch<React.SetStateAction<boolean>>;
}

function WeeklyView({ api, scrollDate, markedDates, refreshDates }: WeeklyViewProps) {
  //If no scroll date, set date to be Monday
  const tmpTdy = new Date();
  let frmMonday = tmpTdy.getDay() - 1;
  tmpTdy.setDate(tmpTdy.getDate() - frmMonday);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const context = useContext(CalendarContext);
  const [date, setDate] = useState<string>(
    scrollDate ? scrollDate.toISOString().slice(0, 10) : tmpTdy.toISOString()
  );
  const [, forceRender] = useState(0);

  const [longDate, setLongDate] = useState<Date>();

  const [modalVisible, setModalVisible] = useState(false);
  //Make it Monday
  useEffect(() => {
    console.log('Initial Date: ', tmpTdy);
  }, []);
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
    console.log('Handle cust butt ');
    let tmpTdy = new Date();
    //Find Monday and set tmp to it
    let frmMonday = tmpTdy.getDay() - 1;
    tmpTdy.setDate(tmpTdy.getDate() - frmMonday);
    setDate(prepareDate(undefined, tmpTdy));
    forceRender((n) => n + 1);
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
  const handleLongPress = (day: DateData) => {
    setModalVisible(true);
    let tmpDate = new Date(day.dateString);
    setLongDate(tmpDate);
  };

  return (
    <ScrollView className="flex-col">
      <View className="relative flex">
        <CalendarProvider
          className="relative flex flex-1"
          date={date}
          onDateChanged={(date) => {
            console.log('WEEKLY', date);
            let tmpTdy = new Date(date);
            let frmMonday = tmpTdy.getDay() - 1;
            tmpTdy.setDate(tmpTdy.getDate() - frmMonday);

            setDate(prepareDate(undefined, tmpTdy));
          }}>
          <ExpandableCalendar
            markingType="multi-dot"
            markedDates={markedDates}
            hideKnob={true}
            theme={calendarTheme}
            hideArrows={true}
            date={date}
            //disablePan={true}
            //current={date}
            firstDay={1}
            onDayPress={(day) => {
              console.log(day);
              setDate(day.dateString);
            }}
            onDayLongPress={(day) => {
              handleLongPress(day);
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
      {longDate && (
        <MarkedDateModal
          date={longDate.toISOString()}
          api={api}
          visible={modalVisible}
          setVisible={setModalVisible}
          markedDates={markedDates}
          refreshDates={refreshDates}></MarkedDateModal>
      )}
    </ScrollView>
  );
}
export default WeeklyView;
