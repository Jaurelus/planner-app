import { View, Text, useColorScheme, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Agenda, CalendarProvider, ExpandableCalendar, Timeline } from 'react-native-calendars';
import Button from './ui/button';
import { CopyPlus, Square, Check, BicepsFlexed } from 'lucide-react-native';
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
import { Select } from 'components/Select';
import { Card } from './ui';

function AgendaTasks() {
  let today = new Date();
  console.log();
  const [agendaDates, setAgendaDates] = useState<string[]>([]);
  const [agendaData, setAgendaData] = useState([]);
  const [sunday, setSunday] = useState('');
  const [checked, setChecked] = useState(false);
  const [startHour, setStartHour] = useState<Date>(new Date());
  const [endHour, setEndHour] = useState<Date>(new Date());
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCat, setTaskCat] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const catMap = {
    1: { name: 'Physical' },
    2: { name: 'Mental(School)' },
    3: { name: 'Intellecutal(Personal)' },
    4: { name: 'Creative' },
    5: { name: 'Social' },
    6: { name: 'Daily Living/Chore' },
    7: { name: 'Recreation/Hobby' },
    8: { name: 'Work/Occupation' },
    9: { name: 'Misc' },
  };

  const setCardHeight = (start: Date, end: Date) => {
    return (new Date(end) - new Date(start)) / (1000 * 60);
  };

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

  today.toISOString().slice(0, 10);

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

  const API_URL = 'http://localhost:3000/api/tasks';

  // Function to get task data
  const viewTasks = async () => {
    try {
      const response = await fetch(API_URL, { method: 'GET' });
      if (response.status == 200) {
        const data = await response.json();
        setAllTasks(data.tasks);
        console.log(allTasks);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    viewTasks();
  }, []);
  //Function to create a task
  const createTask = async () => {
    const tPayload = {
      uTaskName: taskName,
      uTaskDesc: taskDesc,
      uTaskStart: startHour,
      uTaskEnd: endHour,
      uTaskCat: taskCat,
    };
    try {
      const response = await fetch(API_URL, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(tPayload),
      });

      //Sucessful add
      if (response.status == 201) {
        console.log('Task sucessfully created');
        viewTasks();
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <View className="flex flex-1">
      <Timeline
        format24h={false}
        events={[
          {
            id: '1',
            summary: '',
            start: `${today.toISOString().slice(0, 10)} 12:00:00`,
            end: '{today.toISOString().slice(0,10)} 16:00:00',
            title: 'Sleep',
            color: 'red',
          },
        ]}></Timeline>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className=" absolute bottom-10 right-10 rounded-full border p-2" size="lg">
            <CopyPlus color={'white'} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="gap-3 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Task</AlertDialogTitle>
          </AlertDialogHeader>
          <View className="items-center gap-2">
            <TextInput
              value={taskName}
              onChangeText={setTaskName}
              placeholder="Task Name"
              className="w-[90%] rounded-md bg-white placeholder:text-center"></TextInput>
            <TextInput
              value={taskDesc}
              onChangeText={setTaskDesc}
              placeholder="Task Description"
              className="w-[90%] rounded-md bg-white placeholder:text-center"></TextInput>
            {/* Times */}
            <View className="flex w-[80%] flex-row items-center justify-center gap-5">
              <View className="flex flex-col py-3">
                <Text className="ml-3 text-center text-white">Start Time</Text>
                <DateTimePicker
                  mode="time"
                  value={startHour}
                  onChange={(event, date) => setStartHour(date)}
                />
              </View>
              <View>
                <Text className="ml-3 justify-center text-center text-white">End Time</Text>
                <DateTimePicker
                  mode="time"
                  value={endHour}
                  onChange={(event, date) => setEndHour(date)}
                />
              </View>
              <View>
                <Text className=" text-center text-white">All Day?</Text>
                <Pressable className="ml-3" onPress={() => setChecked((prev) => !prev)}>
                  <Square>{checked && <Check color={'green'}></Check>}</Square>
                </Pressable>
              </View>
            </View>
            <Select
              placeholder="Choose a classification for this tasks"
              options={[
                { choiceNum: 1, option: 'Physical' },
                { choiceNum: 2, option: 'Mental(School)' },
                { choiceNum: 3, option: 'Intellecutal(Personal)' },
                { choiceNum: 4, option: 'Creative' },
                { choiceNum: 5, option: 'Social' },
                { choiceNum: 6, option: 'Daily Living/Chore' },
                { choiceNum: 7, option: 'Recreation/Hobby' },
                { choiceNum: 8, option: 'Work/Occupation' },
                { choiceNum: 9, option: 'Misc' },
              ]}
              onSelect={(value) => {
                setTaskCat(catMap[value].name);
              }}
              labelKey="option"
              valueKey="choiceNum"></Select>
          </View>

          <AlertDialogFooter className="mb-5 mt-5 flex flex-row items-center justify-center gap-3">
            <AlertDialogCancel variant="destructive">Cancel</AlertDialogCancel>
            <AlertDialogAction onPress={createTask}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}

export default AgendaTasks;
