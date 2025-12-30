import { View, Text, useColorScheme, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Agenda } from 'react-native-calendars';
import Button from './ui/button';
import { CopyPlus } from 'lucide-react-native';
import { todayString } from 'react-native-calendars/src/expandableCalendar/commons';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui';

function AgendaTasks() {
  let today = new Date();
  let testDate = new Date('2025-12-28');
  console.log(today.toISOString().slice(0, 10));
  const [agendaDates, setAgendaDates] = useState<string[]>([]);
  const [agendaData, setAgendaData] = useState([]);
  const [sunday, setSunday] = useState('');
  const [startHour, setStartHour] = useState<Date>(new Date());
  const [endHour, setEndHour] = useState<Date>(new Date());

  //Get all the dates of this week
  const testLoad = [
    {
      name: 'Jay',
      height: 21,
      day: '2025-12-28',
    },
    {
      name: 'Kay',
      age: 13,
    },
  ];

  const getWeekDates = () => {
    let sundayDate = today.getDate() - today.getDay();
    let array = [];
    let Sunday = new Date(today.getFullYear(), today.getMonth(), sundayDate);
    setSunday(Sunday.toISOString().slice(0, 10));
    let tmpDay = Sunday;
    for (let i = 0; i < 7; i++) {
      array.push(tmpDay.toISOString().slice(0, 10));
      tmpDay.setDate(tmpDay.getDate() + 1);
    }
    setAgendaDates(array);
  };
  useEffect(() => {
    setAgendaDates([today.toISOString().slice(0, 10)]);
  }, []);

  //Agenda strucyure mapping
  const agendaItems = agendaDates.reduce(
    (curr, header: string, index: number) => {
      if (testLoad[index]) {
        curr[header] = [testLoad[index]];
      } else {
        curr[header] = [];
      }
      return curr;
    },
    {} as Record<string, any>
  );
  console.log(agendaItems);
  today.toISOString().slice(0, 10);
  console.log(agendaItems.name);

  const colorScheme = useColorScheme();
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

  //---------- API Calls -----------

  const API_URL = 'http://localhost:3000/api/goals';

  // Function to get task data

  //Function to create a task
  const createTask = () => {};

  return (
    <View className="flex flex-1">
      <View className="flex flex-1">
        <Agenda
          items={agendaItems}
          renderItem={(item) => (
            <View>
              <Text>{item.name}</Text>
            </View>
          )}
          scrollEnabled={false}
          selected={today.toISOString().slice(0, 10)}
          selectedDay={sunday}
          theme={{
            ...calendarTheme,
            agendaTodayColor: '754ABF',
            agendaDayTextColor: 'green',
            agendaDayNumColor: 'green',
            agendaKnobColor: '#754ABF',
          }}></Agenda>
      </View>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className=" absolute bottom-10 right-10 rounded-full border p-2" size="lg">
            <CopyPlus color={'white'} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="gap-3">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Task</AlertDialogTitle>
          </AlertDialogHeader>
          <View className="items-center gap-2">
            <TextInput
              placeholder="Task Name"
              className="w-[90%] rounded-md bg-white placeholder:text-center"></TextInput>
            <TextInput
              placeholder="Task Description"
              className="w-[90%] rounded-md bg-white placeholder:text-center"></TextInput>
            {/* Times */}
            <View className="flex w-[80%] flex-row justify-center gap-5">
              <View className="flex justify-center">
                <Text className="justify-center text-center text-white">Start Time</Text>
                <DateTimePicker mode="time" value={startHour} />
              </View>
              <View>
                <Text className="justify-center text-center text-white">End Time</Text>
                <DateTimePicker mode="time" value={endHour} />
              </View>
              <Button size="sm">All day</Button>
            </View>
          </View>

          <AlertDialogFooter className="mb-5 mt-5 flex flex-row items-center justify-center gap-3">
            <AlertDialogCancel variant="destructive">Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}

export default AgendaTasks;
