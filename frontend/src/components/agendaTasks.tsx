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
  let today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<String>(new Date().toISOString().slice(0, 10));
  const [selectPH, setSelectPH] = useState('Choose a classification for these tasks');
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

  //Format timestamps to display on timeline
  const formatTime = (time: String) => {
    let normalizedTime = time.padStart(11, '0');
    if (normalizedTime.startsWith('0')) {
      return `${normalizedTime.slice(1, 5)} ${normalizedTime.slice(9, 11)}`;
    }
    return `${normalizedTime.slice(0, 5)} ${normalizedTime.slice(9, 11)}`;
  };
  useEffect(() => {
    formatTime(new Date().toLocaleTimeString());
  });
  //Function to filter out the events by the day

  //Prepare timeline events
  const [todayEvents, setTodayEvents] = useState();
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  const prepareEvents = async () => {
    const todayEvents = await allTasks.filter(
      (task) => task.timeStart.slice(0, 10) === selectedDate
    );
    const currEvents = todayEvents.map((task) => ({
      id: task._id,
      summary: task.taskDescription,
      start: `${new Date(task.timeStart).toISOString()}`,
      end: `${new Date(task.timeEnd).toISOString()}`,
      title: task.taskName,
      color: '#FF0000',
    }));

    setTimelineEvents(currEvents);
    console.log(currEvents);
  };

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
        //console.log(allTasks);
        if (data.tasks.length > 0) {
          console.log('Type of timeStart:', typeof data.tasks[0].timeStart);
          console.log('Value:', data.tasks[data.tasks.length - 1].timeStart);
          console.log('Is it a Date object?', data.tasks[0].timeStart instanceof Date);
        }
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    viewTasks();
  }, []);

  useEffect(() => {
    prepareEvents();
  }, [allTasks]);
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
    <CalendarProvider date={today}>
      <View className="flex flex-1">
        <ExpandableCalendar
          date={today}
          theme={calendarTheme}
          closeOnDayPress
          firstDay={1}
          markingType="custom"
          markedDates={{}}
          horizontal
          pagingEnabled
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            prepareEvents();
          }}
          onDayLongPress={() => {
            //Add the date to marked dates
          }}
        />
        <Timeline
          date={today}
          timelineLeftInset={45}
          rightEdgeSpacing={10}
          format24h={false}
          events={timelineEvents}
          renderEvent={(event) => {
            return (
              <View
                className="bg ml-auto mr-auto flex flex-1 flex-col items-center justify-center border-0 "
                style={{}}>
                <Text>{event.title}</Text>
                <Text>{event.summary}</Text>
                <Text>
                  {formatTime(new Date(event.start).toLocaleTimeString())} -{' '}
                  {formatTime(new Date(event.end).toLocaleTimeString())}
                </Text>
              </View>
            );
          }}></Timeline>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className=" absolute bottom-10 right-10 rounded-full border p-2" size="lg">
              <CopyPlus color={'white'} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="!w-[90%] gap-3 bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="mt-2">Add New Task</AlertDialogTitle>
            </AlertDialogHeader>
            <View className="items-center gap-2">
              <View className="mt-5 items-center gap-5">
                <TextInput
                  value={taskName}
                  onChangeText={setTaskName}
                  placeholder="Task Name"
                  className="w-80 rounded-xl border border-primary bg-white p-2  placeholder:text-center"></TextInput>
                <TextInput
                  multiline={true}
                  value={taskDesc}
                  onChangeText={setTaskDesc}
                  placeholder="Task Description"
                  className="w-80 rounded-xl border border-primary bg-white p-2 placeholder:text-center"></TextInput>
              </View>
              {/* Times */}
              <View className="flex w-[80%] flex-row items-center justify-center gap-5">
                <View className="flex flex-col py-3">
                  <Text className="ml-3 text-center text-black">Start Time</Text>
                  <DateTimePicker
                    mode="time"
                    value={startHour}
                    onChange={(event, date) => setStartHour(date)}
                  />
                </View>
                <View>
                  <Text className="ml-3 justify-center text-center text-black">End Time</Text>
                  <DateTimePicker
                    mode="time"
                    value={endHour}
                    onChange={(event, date) => setEndHour(date)}
                  />
                </View>
              </View>
              <Select
                placeholder={selectPH}
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
                  setSelectPH(catMap[value].name);
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
    </CalendarProvider>
  );
}

export default AgendaTasks;
