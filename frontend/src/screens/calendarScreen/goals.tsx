import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import Button from '../../components/ui/button';
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
  AlertDescription,
} from 'components/ui';
import { TextInput } from 'react-native';
import { CalendarContext } from 'react-native-calendars';
import * as SecureStore from 'expo-secure-store';
import AddModal from '@/components/AddModal';
import EditModal from '@/components/EditModal';
import DeleteModal from '@/components/DeleteModal';
import { useToast } from '@/components/Toast';

function Goals({ api, scrollDate }: { api: string; scrollDate: string }) {
  const API_URL = api + 'goals';
  const showError = useToast();
  const [goals, setGoals] = useState([]);
  const [alertDT, setAlertDT] = useState('Mark Goal Complete?');
  const [alertDD, setAlertDD] = useState(
    'By pressing confirm, you are agreeing that you completed this goal'
  );
  console.log('SCROLL ', scrollDate);
  const context = useContext(CalendarContext);

  const [gTitle, setGTitle] = useState('');
  const [gDesc, setGDesc] = useState('');
  const [gTitleEdit, setGTitleEdit] = useState('');
  const [gDescEdit, setGDescEdit] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  // Shared form state for AddModal / EditModal
  const [form, setForm] = useState<Record<string, any>>({});
  const handleChange = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

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
    try {
      // Fall back to the week being viewed if no date was picked
      const payload = {
        ...form,
        goalDate: form.goalDate || new Date(scrollDate),
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', AuthToken: userToken, UserID: userInfo._id },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status == 201) {
        setForm({});
        setAddVisible(false);
        await showGoals();
      } else {
        showError(data.message || 'Could not save that goal');
      }
    } catch (error) {
      showError('Network error saving goal');
    }
  };

  //Show Goals
  const showGoals = async () => {
    if (!userInfo) return;
    if (!scrollDate) {
      scrollDate = new Date().toISOString().slice(0, 10);
    }
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
  }, [scrollDate, userInfo]);

  //Edit goals
  const editGoals = async () => {
    if (!userInfo || !selectedGoal) return;

    try {
      const response = await fetch(API_URL + '/' + selectedGoal._id, {
        headers: { 'Content-Type': 'application/json', authtoken: userToken },
        method: 'PUT',
        body: JSON.stringify(form),
      });

      if (response.status == 200) {
        setForm({});
        setEditVisible(false);
        setSelectedGoal(null);
        showGoals();
      }
    } catch (error) {
      showError('Could not save that goal');
    }
  };
  //Delete goals
  const deleteGoals = async () => {
    if (!userInfo || !selectedGoal) return;

    try {
      const response = await fetch(API_URL + '/' + selectedGoal._id, {
        method: 'DELETE',
        headers: { authtoken: userToken },
      });
      if (response.status == 200) {
        setDeleteVisible(false);
        setSelectedGoal(null);
        showGoals();
      }
    } catch (error) {
      showError('Could not delete that goal');
    }
  };

  const handleCheckboxPress = async (GID: any, currCompletion: any) => {
    if (!userInfo) return;

    try {
      const response = await fetch(API_URL + '/' + GID, {
        headers: { 'Content-Type': 'application/json', authtoken: userToken },
        method: 'PUT',
        body: JSON.stringify({ goalCompletion: !currCompletion }),
      });
      const data = await response.json();
      if (response.status == 200) {
        //
        console.log('Goal completion status changed.');
        showGoals();
      } else if (response.status == 400) {
        console.log('Error updating the goal' + data.message);
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
              {/* Edit Goal -- opens the single hoisted EditModal */}
              <Button
                size="icon"
                onPress={() => {
                  setSelectedGoal(goal);
                  setForm({
                    goalTitle: goal.title,
                    goalDescription: goal.description,
                  });
                  setEditVisible(true);
                }}
                className="rounded-full "
                variant="ghost">
                <SquarePen size={18} />
              </Button>

              {/* Delete Goal */}
              <Button
                size="icon"
                className="rounded-full "
                variant="ghost"
                onPress={() => {
                  setSelectedGoal(goal);
                  setDeleteVisible(true);
                }}>
                <LucideCircleX size={20} color={'red'} />
              </Button>

              {/*Checkbox View*/}

              <View className="ml-2 mt-2">
                <BouncyCheckbox
                  onPress={() => {
                    handleCheckboxPress(goal._id, goal.complete);
                  }}
                  isChecked={goal.complete}
                  size={20}
                  fillColor="green"></BouncyCheckbox>
              </View>
            </View>
          </CardFooter>
        </Card>
      ))}

      {/* Adding a new goal */}

      <Button
        onPress={() => {
          setForm({});
          setAddVisible(true);
        }}>
        Create Goal
      </Button>

      {/* One instance of each modal, outside the map */}
      <AddModal
        module="Goal"
        visibility={addVisible}
        setVisibility={setAddVisible}
        values={form}
        onChange={handleChange}
        onClick={saveNewGoal}
      />
      <EditModal
        module="Goal"
        visibility={editVisible}
        setVisibility={setEditVisible}
        values={form}
        onChange={handleChange}
        onClick={editGoals}
        context={selectedGoal?.title}
      />
      <DeleteModal
        module="Goal"
        visibility={deleteVisible}
        setVisibility={setDeleteVisible}
        onClick={deleteGoals}
        context={selectedGoal?.title ?? ''}
      />
    </View>
  );
}

export default Goals;
