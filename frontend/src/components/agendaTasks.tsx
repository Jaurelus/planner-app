import { View, Text, useColorScheme, TextInput, Pressable } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import {
  Agenda,
  CalendarProvider,
  ExpandableCalendar,
  Timeline,
  CalendarContext,
} from 'react-native-calendars';
import Button from './ui/button';
import { CircleX, SquarePen } from 'lucide-react-native';
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
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [startHour, setStartHour] = useState<Date>(new Date());
  const [endHour, setEndHour] = useState<Date>(new Date());
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCat, setTaskCat] = useState('');

  const [uTaskEnd, setUTaskEnd] = useState<Date>(new Date());
  const [uTaskStart, setUTaskStart] = useState<Date>(new Date());
  const [uTaskName, setuTaskName] = useState('');
  const [uTaskDesc, setUTaskDesc] = useState('');
  const [uTaskCat, setUTaskCat] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [PH, setPH] = useState('');
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
  const eventColors = ['#F6DBFA', '#E89B6E', '#754ABF', '#D7BE69'];

  const context = useContext(CalendarContext);

  //Format for display
  const convert12 = (time: string) => {
    let hour = Number(time.slice(0, 2));
    let minute = time.slice(3, 5).padEnd(2, '0');
    let mFlag;
    if (hour > 11) {
      mFlag = 'PM';
    } else {
      mFlag = 'AM';
    }
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${mFlag}`;
  };

  //Format timestamps to display on timeline
  const formatTime = (time: string) => {
    let normalizedTime = time.padStart(11, '0');
    if (normalizedTime.startsWith('0')) {
      return `${normalizedTime.slice(1, 5)} ${normalizedTime.slice(9, 11)}`;
    }
    return `${normalizedTime.slice(0, 5)} ${normalizedTime.slice(9, 11)}`;
  };

  //Format times so the timeline accepts it
  const formatTimeLineTimes = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0') +
      ' ' +
      date.toTimeString().slice(0, 8).padStart(8, '0')
    );
  };
  const formatTimeLineDates = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    );
  };
  //Function to filter out the events by the day

  //Prepare timeline events
  const [todayEvents, setTodayEvents] = useState();
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  const prepareEvents = () => {
    const todayEvents = allTasks.filter(
      (task) => formatTimeLineDates(new Date(task.timeStart)) === context.date
    );

    const currEvents = todayEvents.map((task, i) => ({
      id: task._id,
      summary: task.taskDescription,
      title: task.taskName,
      color: eventColors[i % 4],
      start: formatTimeLineTimes(new Date(task.timeStart)),
      end: formatTimeLineTimes(new Date(task.timeEnd)),
      ...task,
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
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    viewTasks();
  }, []);

  useEffect(() => {
    if (allTasks.length > 0 && selectedDate) {
      prepareEvents();
    }
  }, [allTasks, selectedDate]);

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

        //Reset fields
        setTaskName('');
        setTaskDesc('');
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  //Function to delete a task

  const deleteTask = async (taskID: string) => {
    try {
      const response = await fetch(API_URL + '/' + taskID, { method: 'DELETE' });

      if (response.status == 200) {
        await viewTasks();
        console.log('Task deleted');
      } else console.log(response.status);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  //Function to edit a task
  const editTask = async (taskID: string) => {
    const payload: any = {};
    if (uTaskName) payload.uTaskName = uTaskName;
    if (uTaskDesc) payload.uTaskDesc = uTaskDesc;
    if (uTaskStart) payload.uTaskStart = uTaskStart;
    if (uTaskEnd) payload.uTaskEnd = uTaskEnd;
    if (uTaskCat) payload.uTaskCat = uTaskCat;

    try {
      const response = await fetch(API_URL + '/' + taskID, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Successul update');
        viewTasks();
        prepareEvents();
        setuTaskName('');
        setUTaskDesc('');
      }
      if (data.status == 400) {
        console.log(data.message);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <View className="flex flex-1">
      <ExpandableCalendar
        initialDate={context.date}
        className="block"
        theme={calendarTheme}
        closeOnDayPress
        firstDay={1}
        markingType="custom"
        markedDates={{}}
        horizontal
        pagingEnabled
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        onDayLongPress={(day) => {
          //Add the date to marked dates
        }}
      />
      <Timeline
        date={context.date}
        timelineLeftInset={45}
        rightEdgeSpacing={10}
        format24h={false}
        events={timelineEvents}
        renderEvent={(event) => {
          return (
            <View className="ml-auto mr-auto flex flex-1 flex-row items-center justify-center gap-5 border-0">
              <View className="ml-auto mr-auto flex flex-1 flex-col items-center justify-center ">
                <Text>{event.title}</Text>
                <Text className="max-w-64 text-center">{event.summary}</Text>
                <Text>
                  {convert12(event.start.slice(11, 19))} - {convert12(event.end.slice(11, 19))}
                </Text>
              </View>
              <View
                className="top-0 -mt-2 flex h-full flex-col border-l-2  pt-0"
                style={{ borderColor: event.color }}>
                <View
                  className="top-0 mt-0 flex flex-1 items-center border-b-2"
                  style={{ borderColor: event.color }}>
                  {/* Edit Task */}

                  <AlertDialog
                    onOpenChange={(open) => {
                      if (open) {
                        setPH(event.category || 'Choose a classification for these tasks');
                        setUTaskDesc(event.summary || '');
                        setUTaskEnd(new Date(event.end));
                        setUTaskStart(new Date(event.start));
                        setuTaskName(event.title);
                      }
                      if (!open) {
                        setuTaskName('');
                        setUTaskDesc('');
                      }
                    }}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex flex-1 items-center justify-center rounded-none"
                        textClassName="color-black"
                        style={{ backgroundColor: `${event.color}1A` }}>
                        <SquarePen color="#3c0275" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="!w-[90%] gap-3 bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="mt-2 color-dark">
                          Edit This Task?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <View className="items-center gap-2">
                        <View className="mt-5 items-center gap-5">
                          <TextInput
                            value={uTaskName}
                            onChangeText={setuTaskName}
                            placeholder={event.title}
                            className="w-80 rounded-xl border border-primary bg-white p-2  placeholder:text-center"></TextInput>
                          <TextInput
                            multiline={true}
                            value={uTaskDesc}
                            onChangeText={setUTaskDesc}
                            placeholder={event.summary}
                            className="w-80 rounded-xl border border-primary bg-white p-2 placeholder:text-center"></TextInput>
                        </View>

                        {/* Times */}

                        <View className="flex w-[80%] flex-row items-center justify-center gap-5">
                          <View className="flex flex-col py-3">
                            <Text className="ml-3 text-center text-black">Start Time</Text>
                            <DateTimePicker
                              mode="time"
                              value={uTaskStart || new Date(event.start)}
                              onChange={(event, date) => setUTaskStart(new Date(date))}
                            />
                          </View>
                          <View>
                            <Text className="ml-3 justify-center text-center text-black">
                              End Time
                            </Text>

                            <DateTimePicker
                              mode="time"
                              value={uTaskEnd || new Date(event.end)}
                              onChange={(event, date) => {
                                setUTaskEnd(date);
                              }}
                            />
                          </View>
                        </View>
                        <Select
                          placeholder={PH || event.taskCategory}
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
                            setUTaskCat(catMap[value].name);
                            setPH(catMap[value].name);
                          }}
                          labelKey="option"
                          valueKey="choiceNum"></Select>
                      </View>

                      <AlertDialogFooter className="mb-5 mt-5 flex flex-row items-center justify-center gap-3">
                        <AlertDialogCancel
                          variant="destructive"
                          onPress={() => {
                            setuTaskName('');
                            setUTaskDesc('');
                          }}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onPress={() => {
                            editTask(event.id);
                          }}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </View>
                <View className="flex flex-1">
                  {/* Delete Task*/}

                  <Button
                    onPress={() => {
                      if (!event.id) {
                        console.log('No event id');
                        return;
                      }
                      deleteTask(event.id);
                    }}
                    className="flex flex-1"
                    textClassName="color-black"
                    style={{ backgroundColor: `${event.color}1A` }}>
                    <CircleX color="red" />
                  </Button>
                </View>
              </View>
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
            <AlertDialogTitle className="mt-2 color-dark">Add New Task</AlertDialogTitle>
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
                  onChange={(event, date) => {
                    setEndHour(date);
                    console.log(date);
                  }}
                />
              </View>
            </View>
            <Select
              placeholder={taskCat || 'Choose a classification for these tasks'}
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
