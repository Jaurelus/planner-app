import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import Button from './ui/button';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { LucideCircleX, SquarePen } from 'lucide-react-native';
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

  const colors = ['#D8EED2', '#FEE2C3', '#E1D9FB', 'D0E9FA'];

  const catIconMap = {};

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
    <View className=" mb-10 gap-3 px-5 py-5">
      {/* Goal display (cards) */}

      {goals.map((goal, index) => (
        //
        <Card
          key={goal._id}
          className="flex flex-row items-center"
          style={{ backgroundColor: colors[index % colors.length] }}>
          {/*Card View*/}

          <View className="flex-1 flex-col gap-1">
            <CardHeader>
              <CardTitle className="text-center">{goal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-center">{goal.description}</Text>
            </CardContent>
          </View>
          <CardFooter>
            {/*Button View*/}

            <View className="flex-row">
              <Button size="icon" className="rounded-full " variant="ghost">
                <SquarePen size={18} />
              </Button>
              <Button size="icon" className="rounded-full " variant="ghost">
                <LucideCircleX size={20} color={'red'} />
              </Button>

              {/*Checkbox View*/}

              <View className="ml-2 mt-2">
                <BouncyCheckbox size={20} fillColor="green"></BouncyCheckbox>
              </View>
            </View>
          </CardFooter>
        </Card>
      ))}

      {/* Adding a new goal */}

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
    </View>
  );
}

export default Goals;
