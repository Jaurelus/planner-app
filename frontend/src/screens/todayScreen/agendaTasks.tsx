import { View, Text, useColorScheme } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import {
  Agenda,
  CalendarProvider,
  ExpandableCalendar,
  Timeline,
  CalendarContext,
} from 'react-native-calendars';
import Button from '@/../components/ui/button';
import { CircleX, SquarePen } from 'lucide-react-native';
import { CopyPlus, Square, Check, BicepsFlexed } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { getUserInfo } from 'utils/SecureStoreManager';

import DeleteModal from '@/components/DeleteModal';
import AddModal from '@/components/AddModal';
import EditModal from '@/components/EditModal';
import { useToast } from '@/components/Toast';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui';

interface AgendaTasksProps {
  api: string;
  date: string;
}
function AgendaTasks({ api, date }: AgendaTasksProps) {
  const API_URL = api + 'tasks';
  const showError = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [startHour, setStartHour] = useState<Date>(new Date(date + 'T12:00:00'));
  const [endHour, setEndHour] = useState<Date>(new Date(date + 'T12:00:00'));
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCat, setTaskCat] = useState('');
  // Minutes before start to fire a push. Blank = no reminder.
  const [taskRemind, setTaskRemind] = useState('');
  const [uTaskRemind, setUTaskRemind] = useState('');
  // Which task the delete modal is acting on
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  // Which task the edit modal is acting on
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editVisible, setEditVisible] = useState(false);

  const [uTaskEnd, setUTaskEnd] = useState<Date | null>(null);
  const [uTaskStart, setUTaskStart] = useState<Date | null>(null);
  const [uTaskName, setuTaskName] = useState('');
  const [uTaskDesc, setUTaskDesc] = useState('');
  const [uTaskCat, setUTaskCat] = useState('');

  // AddModal is driven by a values/onChange pair keyed on the backend payload
  // names, so map those keys onto the existing add-task state.
  const addValues = {
    uTaskName: taskName,
    uTaskDesc: taskDesc,
    uTaskStart: startHour,
    uTaskEnd: endHour,
    uTaskCat: taskCat,
    uTaskRemind: taskRemind,
  };
  const addSetters: Record<string, (value: any) => void> = {
    uTaskName: setTaskName,
    uTaskDesc: setTaskDesc,
    uTaskStart: setStartHour,
    uTaskEnd: setEndHour,
    uTaskCat: setTaskCat,
    uTaskRemind: setTaskRemind,
  };
  const handleAddChange = (key: string, value: any) => addSetters[key]?.(value);

  // Same idea for EditModal, over the existing uTask* state
  const editValues = {
    uTaskName: uTaskName,
    uTaskDesc: uTaskDesc,
    uTaskStart: uTaskStart,
    uTaskEnd: uTaskEnd,
    uTaskCat: uTaskCat,
    uTaskRemind: uTaskRemind,
  };
  const editSetters: Record<string, (value: any) => void> = {
    uTaskName: setuTaskName,
    uTaskDesc: setUTaskDesc,
    uTaskStart: setUTaskStart,
    uTaskEnd: setUTaskEnd,
    uTaskCat: setUTaskCat,
    uTaskRemind: setUTaskRemind,
  };
  const handleEditChange = (key: string, value: any) => editSetters[key]?.(value);

  const [allTasks, setAllTasks] = useState([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userToken, setUserToken] = useState('');
  const [currEvents, setCurrEvents] = useState([]);
  const eventColors = ['#F6DBFA', '#E89B6E', '#754ABF', '#D7BE69'];

  const context = useContext(CalendarContext);

  //Format for display
  const convert12 = (date: String) => {
    let time = date.split('T')[1];
    if (Number(time.split(':')[0]) >= 12) {
      return 'PM';
    } else return 'AM';
  };

  const prepareDate = () => {
    return (
      new Date().getFullYear() +
      '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '-' +
      String(new Date().getDate()).padStart(2, '0')
    );
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
    //2026-04-06 6:00:00 PM
    date = new Date(date);
    let isoDate = date.toISOString().split('T')[1];
    // Get time info
    let locale = date.toLocaleString([], { hour12: false }).split(',');
    let localeDate = locale[0];
    let localeTime = locale[1].slice(1, -3);
    let localeMonth = locale[0].split('/')[0];
    let localeDay = locale[0].split('/')[1];
    let localeYear = locale[0].split('/')[2];
    return (
      localeYear +
      '-' +
      localeMonth.padStart(2, '0') +
      '-' +
      localeDay.padStart(2, '0') +
      ' ' +
      localeTime +
      ':00'
      /*
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        date.getDate().toString().padStart(2, '0') +
        ' ' +
        date.toLocaleTimeString().slice(0,-6)
        */
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

  useEffect(() => {
    const tmpEvents = allTasks.map((task, i) => {
      return {
        id: task._id,
        summary: task.taskDescription,
        title: task.taskName,
        color: `${eventColors[i % 4]}73`,
        start: formatTimeLineTimes(task.timeStart), //formatTimeLineTimes(new Date(task.timeStart)),
        end: formatTimeLineTimes(task.timeEnd), //formatTimeLineTimes(new Date(task.timeEnd)),
        ...task,
      };
    });
    setCurrEvents(tmpEvents);
  }, [allTasks]);

  const darkenColor = (color: string) => {
    let tmp = color.slice(0, 7);
    tmp = tmp + 'FF';
    return tmp;
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

  // Function to get task data
  const viewTasks = async () => {
    if (!userInfo || !selectedDate) return;
    console.log('Selected Date', selectedDate);
    try {
      const response = await fetch(API_URL + `?date=${selectedDate}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', AuthToken: userToken, UserID: userInfo._id },
      });
      if (response.status == 200) {
        const data = await response.json();
        console.log('\n' + data.tasks + '\n');
        setAllTasks(data.tasks);
        //console.log(allTasks);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
  }, []);
  useEffect(() => {
    viewTasks();
  }, [userInfo, selectedDate]);

  //Function to create a task

  const createTask = async () => {
    if (!userInfo) return;
    const tPayload = {
      uTaskName: taskName,
      uTaskDesc: taskDesc,
      uTaskStart: startHour,
      uTaskEnd: endHour,
      uTaskCat: taskCat,
      // Backend converts this into an absolute remindTime
      uTaskRemind: taskRemind,
    };
    try {
      const response = await fetch(API_URL, {
        headers: { 'Content-Type': 'application/json', AuthToken: userToken, UserID: userInfo._id },
        method: 'POST',
        body: JSON.stringify(tPayload),
      });
      const data = await response.json();
      //Sucessful add
      if (response.status == 201) {
        console.log('Task sucessfully created');
        setAddVisible(false);
        viewTasks();

        //Reset fields
        setTaskRemind('');
        setTaskName('');
        setTaskDesc('');
        setTaskCat('');
      } else console.log(data.message);
    } catch (error) {
      showError('Could not create that task');
    }
  };

  //Function to delete a task

  const deleteTask = async (taskID: string) => {
    try {
      const response = await fetch(API_URL + '/' + taskID, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', AuthToken: userToken },
      });

      if (response.status == 200) {
        await viewTasks();
        console.log('Task deleted');
      } else console.log(response.status);
    } catch (error) {
      showError('Could not delete that task');
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
    // Always sent: '' means "clear the reminder", so it can't be omitted
    payload.uTaskRemind = uTaskRemind;

    try {
      const response = await fetch(API_URL + '/' + taskID, {
        headers: { 'Content-Type': 'application/json', AuthToken: userToken },
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Successul update');
        setEditVisible(false);
        setEditTarget(null);
        await viewTasks();
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
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  return (
    <View className="flex-1">
      <Timeline
        date={selectedDate}
        timelineLeftInset={45}
        rightEdgeSpacing={10}
        format24h={false}
        events={currEvents}
        scrollToNow={true}
        renderEvent={(event) => {
          return (
            <Card
              className="p-0! ml-auto mr-auto flex min-h-32 w-full flex-1 flex-col gap-5 rounded-sm"
              style={{ borderColor: darkenColor(event.color) }}>
              <CardHeader
                className="rounded-t-4xl -mx-[1] -mt-[22px] flex flex-row  pb-2 pt-4"
                style={{ backgroundColor: event.color }}>
                <Text>
                  {new Date(event.start).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(event.end).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </CardHeader>
              <CardContent>
                {/* Red on these pastel event tints is ~3.6:1; dark is 15:1 */}
                <Text className="font-semibold color-dark">{event.title}</Text>
                <Text className=" text-center color-dark">{event.summary}</Text>
              </CardContent>
              <CardFooter className="mb-4">
                <Button
                  variant="ghost"
                  className="flex flex-1 items-center justify-center rounded-none"
                  textClassName="color-black"
                  style={{ backgroundColor: `${event.color}1A` }}
                  onPress={() => {
                    const startDate = new Date(event.start);
                    const endDate = new Date(event.end);
                    setEditTarget({ id: event.id, title: event.title });
                    setuTaskName(event.title);
                    setUTaskDesc(event.summary || '');
                    setUTaskStart(startDate);
                    setUTaskEnd(endDate);
                    setUTaskCat((event as any).taskCategory || '');
                    // Turn the stored remindTime back into "minutes before"
                    const savedRemind = (event as any).remindTime;
                    setUTaskRemind(
                      savedRemind
                        ? String(
                            Math.round(
                              (startDate.getTime() - new Date(savedRemind).getTime()) / 60000
                            )
                          )
                        : ''
                    );
                    setEditVisible(true);
                  }}>
                  <SquarePen color="#3c0275" />
                </Button>
                <Button
                  onPress={() => {
                    if (!event.id) {
                      console.log('No event id');
                      return;
                    }
                    setSelectedTask({ id: event.id, title: event.title });
                    setDeleteVisible(true);
                  }}
                  className="flex flex-1"
                  textClassName="color-black"
                  style={{ backgroundColor: `${event.color}1A` }}>
                  <CircleX color="red" />
                </Button>
              </CardFooter>
            </Card>
          );
        }}></Timeline>

      {/* Positioned by a wrapper View, not the Button itself -- and given an
          explicit zIndex/elevation so the Timeline can't paint over it. */}
      <View
        style={{
          position: 'absolute',
          bottom: 28,
          right: 24,
          zIndex: 50,
          elevation: 5,
        }}>
        <Button
          className="rounded-full border p-2"
          size="lg"
          onPress={() => {
            // Seed the pickers on the day being viewed, not the day the
            // screen happened to mount on
            setStartHour(new Date(selectedDate + 'T12:00:00'));
            setEndHour(new Date(selectedDate + 'T13:00:00'));
            setAddVisible(true);
          }}>
          <CopyPlus color={'white'} />
        </Button>
      </View>

      {/* Same add/edit modals every other module uses. One instance each,
          outside renderEvent -- a copy per event would share one flag. */}
      <AddModal
        module="Task"
        visibility={addVisible}
        setVisibility={setAddVisible}
        values={addValues}
        onChange={handleAddChange}
        onClick={createTask}
      />
      <EditModal
        module="Task"
        visibility={editVisible}
        setVisibility={setEditVisible}
        values={editValues}
        onChange={handleEditChange}
        onClick={async () => {
          if (editTarget) await editTask(editTarget.id);
        }}
        context={editTarget?.title}
      />

      {/* Single delete modal for every task on the timeline */}
      <DeleteModal
        module="Task"
        visibility={deleteVisible}
        setVisibility={setDeleteVisible}
        onClick={async () => {
          if (!selectedTask) return;
          await deleteTask(selectedTask.id);
          setDeleteVisible(false);
          setSelectedTask(null);
        }}
        context={selectedTask?.title ?? ''}
      />
    </View>
  );
}

export default AgendaTasks;
