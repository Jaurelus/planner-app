import { View, useColorScheme, Text, Modal, Pressable, TextInput } from 'react-native';
import { Calendar, CalendarList, DateData } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { use, useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import AddObjectiveModal from '../../components/addObjectiveModal';
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currLongPressDate, setCurrLongPressDate] = useState<Date>(new Date());
  const [empty, setEmpty] = useState(false);
  const [visbility, setVisibility] = useState(false);
  const [selected, setSelected] = useState(false);
  const [myVar, setmyVar] = useState(false);
  const [addMark, setAddMark] = useState(false);
  const objectiveMonth = selectedDate.getMonth() + 1;

  const [objectives, setObjectives] = useState([]);

  const [userObjectives, setUserObjectives] = useState([]);
  const calendarRef = useRef<any>(null);
  const [, forceRender] = useState(0);
  const [userToken, setUserToken] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [longDate, setLongDate] = useState<Date>();

  const [modalVisible, setModalVisible] = useState(false);
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
      console.log('Client Error', error);
    }
  };
  useEffect(() => {
    getObjectives();
  }, [objectiveMonth, userToken, userInfo]);
  //Funcion to edit objective
  const editObjective = async (OID: Number) => {
    const payload: any = {};

    try {
      if (!objectiveTitle) {
        console.log('Missing objective title');
      }
      payload.objectiveTitle = objectiveTitle;
      payload.objectiveMonth = objectiveMonth;
      if (objectiveDescription) {
        payload.objectiveDescription = objectiveDescription;
      }
      if (objectiveProgress) {
        payload.objectiveProgress = objectiveProgress;
      }
      if (objectiveGoalNumber) {
        payload.objectiveGoalNumber = objectiveGoalNumber;
      }
      const response = await fetch(api + 'objectives/' + OID, {
        headers: { Authtoken: userToken, userid: userInfo._id, 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Objective sucessfully edited');
        forceRender((n) => n + 1);
      } else {
        console.log('Error editing objective: ', data.message);
      }
    } catch (error) {
      console.log('Client Error: ' + error);
    }
  };

  //Function to delete objective
  const deleteObjectives = async (id: Number) => {
    const response = await fetch(api + 'objectives/' + id, {
      headers: { Authtoken: userToken, userid: userInfo._id },
      method: 'DELETE',
      body: JSON.stringify({ objectiveID: id }),
    });
    const data = await response.json();
    if (response.status == 200) {
      console.log('Sucess deleting objective');
      forceRender((n) => n + 1);
    } else {
      console.log('Server Error: ' + data.message);
    }
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
      <View className="justify-center gap-3 px-4">
        <Text className="mt-3 text-center"> Monthly Overview</Text>
        {empty ? (
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
                  className="relative flex items-center justify-center"
                  key={objective._id}
                  style={{ backgroundColor: colors[index % colors.length] }}>
                  <CardHeader>
                    <CardTitle>{objective.title}</CardTitle>
                  </CardHeader>
                  <View className="flex-row">
                    <CardContent className="w-[70%] justify-center">
                      <Text className="text-center">{objective.description}</Text>
                    </CardContent>
                    <CardFooter className="mt-2 justify-end">
                      {/* Edit Objective */}
                      <Progress.Circle
                        className=" absolute -top-16 left-12"
                        size={36}
                        progress={objective.progress / objective.goalNumber}
                        color="green"
                        showsText={false}></Progress.Circle>

                      <AlertDialog
                        onOpenChange={(open) => {
                          if (open) {
                            setObjectiveTitle(objective.title);
                            setObjectiveDescription(objective.description);
                            setObjectiveProgress(String(objective.progress));
                            setObjectiveGoalNumber(String(objective.goalNumber));

                            console.log('Finna set', objective.title);
                          } else {
                            setObjectiveTitle('');
                            setObjectiveDescription('');
                            setObjectiveProgress('');
                            setObjectiveGoalNumber('');
                          }
                        }}>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" className="rounded-full " variant="ghost">
                            <SquarePen size={20} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="!w-[90%] bg-white px-2">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Edit Objective</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDescription>
                            <TextInput
                              className=" mt-5 rounded-xl border border-primary  bg-white p-1 text-center"
                              value={objectiveTitle || objective.title}
                              onChangeText={setObjectiveTitle}></TextInput>
                            <TextInput
                              className=" mt-5 rounded-xl border border-primary  bg-white p-1 text-center"
                              multiline={true}
                              value={objectiveDescription || objective.description}
                              onChangeText={setObjectiveDescription}></TextInput>
                            {/*Progress Hint */}
                            <View className="relative mt-5 ">
                              <TextInput
                                className="  rounded-xl border border-primary  bg-white p-1 text-center"
                                value={objectiveProgress || String(objective.progress)}
                                onChangeText={setObjectiveProgress}
                                placeholder="Objective Progress"></TextInput>
                              <View className="absolute right-2 top-2">
                                <Button
                                  onPress={() => {}}
                                  size="icon"
                                  variant="default"
                                  className="h-4 w-4 rounded-full bg-slate-500 text-white">
                                  <CircleQuestionMark color="white" />
                                </Button>
                              </View>
                            </View>
                            <View className="relative mt-5 ">
                              <TextInput
                                className="  rounded-xl border border-primary  bg-white p-1 text-center"
                                value={objectiveGoalNumber || String(objective.goalNumber)}
                                onChangeText={setObjectiveGoalNumber}
                                placeholder="Objective Goal"></TextInput>
                              <View className="absolute right-2 top-2">
                                <Button
                                  onPress={() => {}}
                                  size="icon"
                                  variant="default"
                                  className="h-4 w-4 rounded-full bg-slate-500 text-white">
                                  <CircleQuestionMark color="white" />
                                </Button>
                              </View>
                            </View>
                          </AlertDescription>
                          <AlertDialogFooter className="flex-row">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onPress={() => {
                                editObjective(objective._id);
                              }}>
                              Submit Changes
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Delete Objective */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" className="rounded-full " variant="ghost">
                            <LucideCircleX size={20} color={'red'} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="!w-[90%] bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Objective?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDescription>
                            Are you sure that you want to delete this objective
                          </AlertDescription>
                          <AlertDialogFooter className="flex-row">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onPress={() => {
                                deleteObjectives(objective._id);
                              }}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
        {longDate && (
          <MarkedDateModal
            date={longDate.toISOString()}
            api={api}
            visible={modalVisible}
            setVisible={setModalVisible}
            markedDates={markedDates}
            refreshDates={refreshDates}></MarkedDateModal>
        )}
      </View>
    </View>
  );
}
export default MonthlyView;
