import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import Button from './button';
import AnimatedCheckbox from 'react-native-checkbox-reanimated';
import { Pressable } from 'react-native';
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

function Goals() {
  const [goals, setGoals] = useState([]);
  const [alertDT, setAlertDT] = useState('Mark Goal Complete?');
  const [alertDD, setAlertDD] = useState(
    'By pressing confirm, you are agreeing that you completed this goal'
  );

  const [gTitle, setGTitle] = useState('');
  const [gDesc, setGDesc] = useState('');

  //-------- API Calls ---------

  const API_URL = 'http://localhost:3000/api/goals';

  //Add new goal
  const saveNewGoal = async () => {
    const API_URL = 'http://localhost:3000/api/goals';

    try {
      const payload = {
        goalTitle: gTitle,
        goalDescription: gDesc,
      };
      console.log(payload.goalTitle);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status == 201) {
        setGTitle('');
        setGDesc('');
        console.log('Goal Saved');
        showGoals;
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Show Goals
  const showGoals = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
      if (response.status == 200) {
        const data = await response.json();
        setGoals(data.goals);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showGoals();
  }, []);

  //Edit goals
  const editGoals = () => {};
  //Delete goals
  const deleteGoals = () => {};

  const [checked, setChecked] = useState<boolean>(false);

  const handleCheckboxPress = () => {
    setChecked((prev) => {
      if (checked == false) {
        setAlertDT('Unmark goal as complete');
        setAlertDD('By pressing confirm, you are marking this goal as incomplete');
      } else if (checked == true) {
        setAlertDT('Mark Goal Complete?');
        setAlertDD('By pressing confirm, you are agreeing that you completed this goal');
      }
      return !prev;
    });
  };

  return (
    <View className="">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-center">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.map((goal) => (
            //
            <Card key={goal._id} className="mb-5 max-h-32 flex-col px-2">
              <CardHeader>
                <CardTitle className="text-center">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <View className="h-32 w-full flex-1 flex-row">
                  <View className=" w-[95%]">
                    <Text>{goal.description}</Text>
                  </View>
                  <View className="justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Pressable className="mb-32 h-20 w-10">
                          <AnimatedCheckbox
                            checked={goal.complete}
                            checkmarkColor="#008000"
                            highlightColor="#00FF0040"
                            boxOutlineColor="#754ABF"></AnimatedCheckbox>
                        </Pressable>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-primary">
                        <AlertDialogHeader>
                          <AlertDialogTitle>{alertDT}</AlertDialogTitle>
                          <AlertDialogDescription>{alertDD}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mb-5 mt-5 flex-row justify-center">
                          <AlertDialogCancel variant="outline" className="mr-5">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction variant="outline" onPress={handleCheckboxPress}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Create Goal</Button>
            </AlertDialogTrigger>
            <View className="">
              <AlertDialogContent className=" scale-10 !w-[90%] rounded-3xl bg-primary p-2">
                <AlertDialogHeader>
                  <AlertDialogTitle>Add New Goal</AlertDialogTitle>
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
                  <AlertDialogCancel variant="outline" className="mr-5 border border-white">
                    <Text className="text-white">Cancel</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="outline"
                    className="border border-white"
                    onPress={saveNewGoal}>
                    <Text className="text-white">Confirm</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </View>
          </AlertDialog>
        </CardContent>
      </Card>
    </View>
  );
}

export default Goals;
