import { View, useColorScheme, Text, Modal, Pressable } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { use, useEffect, useRef, useState } from 'react';
import Button from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';
import AddObjectiveModal from './addObjectiveModal';

function MonthlyView({ markedDates, api }: { markedDates: {}; api: string }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currLongPressDate, setCurrLongPressDate] = useState<Date>(new Date());
  const [empty, setEmpty] = useState(false);
  const [visbility, setVisibility] = useState(false);
  const [selected, setSelected] = useState(false);
  const [myVar, setmyVar] = useState(false);
  const [addMark, setAddMark] = useState(false);
  const [userObjectives, setUserObjectives] = useState([]);
  const calendarRef = useRef<any>(null);
  useEffect(() => {
    console.log(userObjectives);
  }, [userObjectives]);

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
      <View className="justify-center gap-3 px-4">
        <Text className="mt-3 text-center"> Monthly Overview</Text>
        {empty ? (
          <Card className="px-4">
            {/*If no monthly goals  */}

            <Text className="text-center">
              Hint: In most cases, your monthly objectives should be something measureable.
            </Text>
          </Card>
        ) : (
          <View>
            <Text>T</Text>
            {userObjectives.map((objective) => {
              return (
                <Card className="items-center " key={objective._id}>
                  <View>
                    <CardHeader>
                      <CardTitle>{objective.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Text>{objective.description}</Text>
                      <Text>Progress Bar </Text>
                    </CardContent>
                    <CardFooter>
                      <Button size="icon" className="h-8 w-8 rounded-full">
                        Edit
                      </Button>
                    </CardFooter>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
        <Button
          onPress={() => {
            setVisibility(true);
          }}>
          Add Objective
        </Button>
        <View className="!w-[90%] px-4">
          <AddObjectiveModal
            setUserObjectives={setUserObjectives}
            api={api}
            date={selectedDate}
            visbility={visbility}
            changeVisbility={setVisibility}></AddObjectiveModal>
        </View>
      </View>
    </View>
  );
}
export default MonthlyView;
