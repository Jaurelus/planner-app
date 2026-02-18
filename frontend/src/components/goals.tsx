import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import Button from './ui/button';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { CircleX, LucideCircleX, SquarePen } from 'lucide-react-native';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from 'components/ui';
import { TextInput } from 'react-native';
import { CalendarContext } from 'react-native-calendars';
import * as SecureStore from 'expo-secure-store';

function Goals({ api, scrollDate }: { api: string; scrollDate: string }) {
  const API_URL = api + 'goals';
  const [goals, setGoals] = useState([]);
  const [alertDT, setAlertDT] = useState('Mark Goal Complete?');
  const [alertDD, setAlertDD] = useState(
    'By pressing confirm, you are agreeing that you completed this goal'
  );

  const context = useContext(CalendarContext);

  const [gTitle, setGTitle] = useState('');
  const [gDesc, setGDesc] = useState('');
  const [gTitleEdit, setGTitleEdit] = useState('');
  const [gDescEdit, setGDescEdit] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    setInputDate(scrollDate);
  }, [scrollDate]);
  const updateAlertText = () => {
    if (alertDT == 'Mark Goal Complete?') {
      setAlertDT('Mark Goal Incomplete');
      setAlertDD(
        'By pressing confirm, you are reopening the goal, meaning it has yet to be completed.'
      );
    } else {
      setAlertDT('Mark Goal Complete?');
      setAlertDD('By pressing confirm, you are agreeing that you completed this goal');
    }
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
  const findFirstDay = (date: Date) => {
    if (date.getDay() == 0) {
      return new Date(
        date.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(date.getDate() + 1)
      );
    }
    let flag;
    if (date.getDay() == 0) {
      flag = -5;
    } else flag = -5;

    let firstDay = date.getDate() - ((date.getDay() || 7) % 7) + flag;
    return new Date(
      date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + firstDay
    );
  };

  //-------- API Calls ---------

  //const API_URL = 'http://localhost:3000/api/goals';

  //Add new goal
  const saveNewGoal = async () => {
    if (!userInfo) return;
    console.log(scrollDate);
    try {
      const payload = {
        goalTitle: gTitle,
        goalDescription: gDesc,
        goalDate: new Date(scrollDate),
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', AuthToken: userToken, UserID: userInfo._id },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status == 201) {
        setGTitle('');
        setGDesc('');
        console.log('Goal Saved');
        await showGoals();
        console.log(data.goal);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Show Goals
  const showGoals = async () => {
    if (!userInfo) return;
    const firsDay = String(findFirstDay(new Date(scrollDate)).toISOString().slice(0, 10)).padStart(
      2,
      '0'
    );
    const lasDayNum = String(Number(scrollDate.split('-')[2]) + 6);
    let dateArray = scrollDate.split('-');

    //Last Day Check
    const tmpDate = new Date(Number(dateArray[0]), Number(dateArray[1]), 0).getDate();

    if (Number(lasDayNum) > tmpDate) {
      dateArray[1] = String(Number(dateArray[1]) + 1).padStart(2, '0');
      dateArray[2] = String(Number(lasDayNum) - tmpDate).padStart(2, '0');
    } else {
      dateArray[2] = lasDayNum;
    }

    //Back to whats right
    const lasDay = dateArray.join('-');

    try {
      console.log(firsDay);
      const response = await fetch(API_URL + `?startDate=${firsDay}&endDate=${lasDay}`, {
        headers: { 'Content-Type': 'application/json', AuthToken: userToken, UserID: userInfo._id },
        method: 'GET',
      });
      if (response.status == 200) {
        console.log('--------Showing zgoals------');
        const data = await response.json();

        console.log(data.goals);
        setGoals(data.goals);
      }
    } catch (error) {
      console.log(error);
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
    showGoals();
  }, [scrollDate]);

  //Edit goals
  const editGoals = async (GID) => {
    if (!userInfo) return;

    const payload: any = {};

    //Either description or title
    if (!gTitleEdit.trim() && !gDescEdit.trim()) {
      console.log('Nothing to change');
    }
    //Title change
    if (gTitleEdit.trim()) {
      payload.goalTitle = gTitleEdit;
    }
    //Description change
    if (gDescEdit.trim()) {
      payload.goalDescription = gDescEdit;
    }

    try {
      const response = await fetch(API_URL + '/' + GID, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (response.status == 200) {
        console.log('Goal info sucuessfully updated');
        showGoals();
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };
  //Delete goals
  const deleteGoals = async (GID) => {
    if (!userInfo) return;

    try {
      const response = await fetch(API_URL + '/' + GID, {
        method: 'DELETE',
      });
      if (response.status == 200) {
        showGoals();
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  const handleCheckboxPress = async (GID: any, currCompletion: any) => {
    if (!userInfo) return;

    try {
      const response = await fetch(API_URL + '/' + GID, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify({ goalCompletion: !currCompletion }),
      });

      if (response.status == 200) {
        //
        console.log('Goal completion status changed.');
        showGoals();
      } else if (response.status == 400) {
        console.log('Error updating the goal');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------- App Content Build ------------

  return (
    <View className="mb-10 flex px-5 py-5">
      {/* Goal display (cards) */}

      <Card className="flex  px-10 py-5">
        <CardHeader>
          <CardTitle className="flex flex-1 pt-2 text-center"> This Week's Goals</CardTitle>
        </CardHeader>
        {goals && (
          <CardContent className="flex gap-5 ">
            {goals.map((goal) => (
              //
              <Card key={goal._id} className="mb-0 min-h-32 flex-col p-0">
                <View className=" !p-0.  flex-row  rounded-md border-2">
                  {/* Text View */}
                  <View className="min-w-40 flex-1 flex-col items-center justify-center">
                    <CardTitle className="text-center">{goal.title}</CardTitle>

                    <Text className="p-1">{goal.description}</Text>
                  </View>

                  {/* Buttons Panel */}

                  <View className="flex items-center  border-l-2 ">
                    {/* Edit */}

                    <View className=" ml-auto mr-auto flex items-center justify-center border-b-2">
                      <AlertDialog
                        onOpenChange={(open) => {
                          if (open) {
                            setGTitleEdit(goal.title);
                            setGDescEdit(goal.description);
                          }
                          if (!open) {
                            setGTitleEdit('');
                            setGDescEdit('');
                          }
                        }}>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="rounded"
                            onPress={() => {
                              setGTitleEdit(goal.title);
                              setGDescEdit(goal.description);
                            }}>
                            <SquarePen color="#D48354" size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="flex !w-[90%] flex-row items-center justify-center bg-white">
                          <AlertDialogHeader className="flex-col">
                            <AlertDialogTitle className="mt-2 color-dark">
                              Edit Goal?
                            </AlertDialogTitle>
                            <TextInput
                              className="mb-5 mt-5 !w-[90%] rounded-xl border border-primary bg-white p-1 text-center"
                              value={gTitleEdit || goal.title}
                              onChangeText={setGTitleEdit}></TextInput>
                            <TextInput
                              multiline={true}
                              className="mb-5 min-h-20 !w-[90%] rounded-xl border border-primary bg-white  p-1 text-center color-black"
                              value={gDescEdit || goal.description}
                              onChangeText={setGDescEdit}></TextInput>
                            <AlertDialogDescription className="px-4 pb-3 text-base color-dark">
                              Are you sure you would like to edit the contents of this goal to the
                              text entered?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mb-5 flex-row justify-center gap-2">
                            <AlertDialogCancel variant="destructive">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="mt-1.5"
                              onPress={() => editGoals(goal._id)}>
                              Confirm Edit
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </View>

                    {/*Delete */}
                    <View className=" mt-0   border-b-2 p-0">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="mr-0 rounded p-0">
                            <CircleX color="red" size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="!w-[90%] gap-5 bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="mt-2 color-dark">
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="px-5 py-2 text-base text-dark">
                              Are you sure that you want to delete and remove this goal?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mb-5 mt-5 flex-row items-center justify-center gap-5">
                            <AlertDialogCancel
                              variant="outline"
                              className="border-2 border-primary">
                              <Text className="color-dark">Cancel</Text>
                            </AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              className="mt-1.5"
                              onPress={() => {
                                deleteGoals(goal._id);
                              }}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </View>

                    {/* Marking a goal as complete */}
                    <View className="flex flex-1 flex-col items-stretch justify-stretch ">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Pressable className="flex flex-1 items-center py-2">
                            <BouncyCheckbox
                              pointerEvents="none"
                              className=""
                              isChecked={goal.complete}
                              disableText
                              fillColor="green"
                              size={20}
                              useBuiltInState={false}
                              iconStyle={{ borderColor: 'green' }}
                            />
                          </Pressable>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="scale-10 !w-[90%] bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="pt-3 color-dark">
                              {alertDT}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="px-5 py-1 text-dark">
                              {alertDD}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mb-5 mt-5 flex-row items-center justify-center gap-5">
                            <AlertDialogCancel variant="destructive" className="">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="mt-1.5"
                              onPress={() => {
                                handleCheckboxPress(goal._id, goal.complete);
                                updateAlertText();
                              }}>
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </View>
                  </View>
                </View>
              </Card>
            ))}

            {/* Adding a new goal */}
          </CardContent>
        )}
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Create Goal</Button>
            </AlertDialogTrigger>
            <View className="">
              <AlertDialogContent className=" !w-[90%] rounded-3xl bg-white p-2 px-10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="mt-2 color-dark">Add New Goal</AlertDialogTitle>
                </AlertDialogHeader>
                <TextInput
                  className="mb-5 mt-5 rounded-xl border border-primary  bg-white p-1 text-center"
                  value={gTitle}
                  onChangeText={setGTitle}
                  placeholder="Goal Title"></TextInput>
                <TextInput
                  value={gDesc}
                  onChangeText={setGDesc}
                  multiline
                  scrollEnabled={false}
                  className="w-100 mb-5 h-64 rounded-xl border border-primary bg-white p-2 text-center"
                  placeholder="Goal Description"></TextInput>
                <AlertDialogFooter className="mt-5 flex-row justify-center text-white">
                  <AlertDialogCancel variant="destructive" className="mr-5 border border-white">
                    <Text className="text-white">Cancel</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="default"
                    className="mt-2 border border-primary"
                    onPress={saveNewGoal}>
                    <Text className="text-white">Confirm</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </View>
          </AlertDialog>
        </CardFooter>
      </Card>
    </View>
  );
}

export default Goals;
