import {
  View,
  useColorScheme,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Calendar, CalendarList, DateData } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { use, useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import AddModal from '@/components/AddModal';
import EditModal from '@/components/EditModal';
import { SquarePen, LucideCircleX, CircleQuestionMark } from 'lucide-react-native';
import {
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui';
import * as Progress from 'react-native-progress';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import MarkedDateModal from '@/components/markedDateModal';
import DeleteModal from '@/components/DeleteModal';
import { useToast } from '@/components/Toast';

function MonthlyView({
  markedDates,
  api,
  refreshDates,
}: {
  markedDates: {};
  api: string;
  refreshDates: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  console.log(api);
  const showError = useToast();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currLongPressDate, setCurrLongPressDate] = useState<Date>(new Date());
  // Derived, not stored -- setEmpty was never called so the hint never showed
  const [visbility, setVisibility] = useState(false);
  const [selected, setSelected] = useState(false);
  const [myVar, setmyVar] = useState(false);
  const [addMark, setAddMark] = useState(false);
  const objectiveMonth = selectedDate.getMonth() + 1;

  const [objectives, setObjectives] = useState([]);

  const [userObjectives, setUserObjectives] = useState([]);
  const empty = userObjectives.length === 0;
  // Starts true so the first paint is a spinner, not the "no objectives" hint
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef<any>(null);
  const [, forceRender] = useState(0);
  const [userToken, setUserToken] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [longDate, setLongDate] = useState<Date>();

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteVisibility, setDeleteVisibility] = useState(false);
  const navigator = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
    console.log(userInfo);
  }, []);
  useEffect(() => {
    console.log(userObjectives);
  }, [userObjectives]);

  const [dateKey, setDateKey] = useState('');

  const [objectiveTitle, setObjectiveTitle] = useState('');
  const [objectiveDescription, setObjectiveDescription] = useState('');
  const [objectiveProgress, setObjectiveProgress] = useState('');
  const [objectiveGoalNumber, setObjectiveGoalNumber] = useState('');

  // Shared form state for AddModal / EditModal. Keys match the backend payload.
  const [form, setForm] = useState<Record<string, any>>({});
  const handleChange = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  // Which objective the edit/delete modals are acting on
  const [selectedObjective, setSelectedObjective] = useState<any>(null);
  const [editVisibility, setEditVisibility] = useState(false);
  const colors = ['#D8EED2', '#FEE2C3', '#E1D9FB', 'D0E9FA'];

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
  const handleLongPress = (day: DateData) => {
    setModalVisible(true);
    let tmpDate = new Date(day.dateString);
    setLongDate(tmpDate);
  };
  //----------- API CALL ---------------
  const getObjectives = async () => {
    if (!userToken || !userInfo) return;
    console.log('Show');
    console.log('API', `${api}objectives?currMonth=${objectiveMonth}`);

    try {
      const response = await fetch(`${api}objectives?currMonth=${objectiveMonth}`, {
        headers: { Authtoken: userToken, userid: userInfo._id },
        method: 'GET',
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Success getting objectives');
        console.log(data.objectives);
        setObjectives(data.objectives);
        setUserObjectives(data.objectives);
      } else {
        console.log(response.status, '  ', data.message);
      }
    } catch (error) {
      showError('Network error loading objectives');
    } finally {
      // finally, so a failed request stops the spinner too
      setLoading(false);
    }
  };
  useEffect(() => {
    getObjectives();
  }, [objectiveMonth, userToken, userInfo]);
  //Function to add objective (moved out of addObjectiveModal so this screen
  //can refresh its own list after a successful save)
  const addNewObjective = async () => {
    if (!userToken || !userInfo) return;
    try {
      const payload = { ...form, objectiveMonth };
      const response = await fetch(api + 'objectives', {
        headers: { Authtoken: userToken, userid: userInfo._id, 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status == 201) {
        setForm({});
        setVisibility(false);
        getObjectives();
      } else {
        showError(data.message || 'Could not add that objective');
      }
    } catch (error) {
      console.log('Client Error: ' + error);
    }
  };

  //Funcion to edit objective
  const editObjective = async () => {
    if (!userToken || !userInfo || !selectedObjective) return;
    try {
      const payload = { ...form, objectiveMonth };
      const response = await fetch(api + 'objectives/' + selectedObjective._id, {
        headers: { Authtoken: userToken, userid: userInfo._id, 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status == 200) {
        setForm({});
        setEditVisibility(false);
        setSelectedObjective(null);
        getObjectives();
      } else {
        showError(data.message || 'Could not save that objective');
      }
    } catch (error) {
      console.log('Client Error: ' + error);
    }
  };

  //Function to delete objective
  const deleteObjectives = async () => {
    if (!selectedObjective) return;
    const response = await fetch(api + 'objectives/' + selectedObjective._id, {
      headers: { Authtoken: userToken, userid: userInfo._id },
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.status == 200) {
      setDeleteVisibility(false);
      setSelectedObjective(null);
      getObjectives();
    } else {
      showError('Could not delete that objective');
    }
  };
  return (
    // flex-1 (not flex) -- the ScrollView below needs a bounded height to scroll
    <View className="flex-1">
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
          onDayLongPress={(day) => {
            handleLongPress(day);
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
      <ScrollView className="flex-1" contentContainerClassName="gap-3 px-4 pb-32">
        <Text className="mt-3 text-center"> Monthly Overview</Text>
        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#754ABF" />
          </View>
        ) : empty ? (
          <Card className="">
            {/*If no monthly goals  */}

            <Text className="text-center">
              Hint: In most cases, your monthly objectives should be something measureable.
            </Text>
          </Card>
        ) : (
          <View className="gap-3">
            {userObjectives.map((objective, index) => {
              return (
                <Card
                  key={objective._id}
                  style={{ backgroundColor: colors[index % colors.length] }}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base">{objective.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-1">
                    <Text className="text-md text-center-[">{objective.description}</Text>
                  </CardContent>
                  <CardFooter className="flex-row items-center justify-between gap-2 pt-1">
                    <Progress.Circle
                      size={32}
                      progress={objective.progress / objective.goalNumber}
                      color="green"
                      showsText={false}
                    />
                    <View className="flex-row gap-2">
                      {/* Edit Objective -- opens the single hoisted EditModal */}
                      <Button
                        size="icon"
                        className="rounded-full"
                        variant="ghost"
                        onPress={() => {
                          setSelectedObjective(objective);
                          setForm({
                            objectiveTitle: objective.title,
                            objectiveDescription: objective.description,
                            objectiveProgress: String(objective.progress),
                            objectiveGoalNumber: String(objective.goalNumber),
                          });
                          setEditVisibility(true);
                        }}>
                        <SquarePen size={20} />
                      </Button>

                      {/* Delete Objective */}
                      <Button
                        onPress={() => {
                          setSelectedObjective(objective);
                          setDeleteVisibility(true);
                        }}
                        size="icon"
                        className="rounded-full"
                        variant="ghost">
                        <LucideCircleX size={20} color={'red'} />
                      </Button>
                    </View>
                  </CardFooter>
                </Card>
              );
            })}
          </View>
        )}
        <Button
          onPress={() => {
            setForm({});
            setVisibility(true);
          }}>
          Add Objective
        </Button>

        {/* One instance of each modal, outside the map -- rendering them inside
            meant every card had its own copy sharing one visibility flag. */}
        <AddModal
          module="Objective"
          visibility={visbility}
          setVisibility={setVisibility}
          values={form}
          onChange={handleChange}
          onClick={addNewObjective}
        />
        <EditModal
          module="Objective"
          visibility={editVisibility}
          setVisibility={setEditVisibility}
          values={form}
          onChange={handleChange}
          onClick={editObjective}
          context={selectedObjective?.title}
        />
        <DeleteModal
          module="Objective"
          visibility={deleteVisibility}
          setVisibility={setDeleteVisibility}
          onClick={deleteObjectives}
          context={selectedObjective?.title ?? ''}
        />

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
    </View>
  );
}
export default MonthlyView;
