import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components/ui';
import Button from 'components/ui/button';
import { TextInput, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { CircleQuestionMark } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

interface AddObjectiveModalProps {
  visbility: boolean;
  changeVisbility: React.Dispatch<React.SetStateAction<any>>;
  date: Date;
  api: string;
  setUserObjectives: React.Dispatch<React.SetStateAction<any>>;
}
function AddObjectiveModal({
  visbility,
  changeVisbility,
  date,
  api,
  setUserObjectives,
}: AddObjectiveModalProps) {
  const [objectiveTitle, setObjectiveTitle] = useState('');
  const [objectiveDescription, setObjectiveDescription] = useState('');
  const [objectiveProgress, setObjectiveProgress] = useState('');
  const [objectiveGoalNumber, setObjectiveGoalNumber] = useState('');
  const objectiveMonth = date.getMonth() + 1;
  const [userToken, setUserToken] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [objectives, setObjectives] = useState([]);
  const [buttonEnabled, setButtonEnabled] = useState(false);
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
    getObjectives();
    console.log(objectives);
  }, [userInfo, userToken]);
  //--------- API Calls --------

  //Function to add objective
  const addNewObjective = async () => {
    if (!userToken || !userInfo) return;
    console.log('User attempting call \n\n', userInfo);
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

      const response = await fetch(api + 'objectives', {
        headers: { Authtoken: userToken, userid: userInfo._id, 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('Response', response.headers);
      const data = await response.json();
      console.log('Data', data);
      if (response.status == 201) {
        console.log('Successfully added objective', data.objectives);
        setObjectiveTitle('');
        setObjectiveDescription('');
        setObjectiveProgress('');
        setObjectiveGoalNumber('');
        getObjectives();
      } else {
        console.log(response.status, data.message);
      }
    } catch (error) {
      console.log('Frontend error', error);
    }
  };
  //Funcion to edit objective

  //Function to get objectives
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

  //Function to delete objective

  return (
    <AlertDialog open={visbility}>
      <AlertDialogContent className="!w-[90%] bg-white px-2 py-1">
        <AlertDialogHeader>
          <AlertDialogTitle className="">Add Objective?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="">
          <TextInput
            className=" mt-5 rounded-xl border border-primary  bg-white p-1 text-center"
            value={objectiveTitle}
            onChangeText={(text) => {
              setObjectiveTitle(text);
              if (text.trim().length > 1) {
                setButtonEnabled(true);
              }
            }}
            placeholder="Objective Title"></TextInput>
          <TextInput
            className=" mt-5 rounded-xl border border-primary  bg-white p-1 text-center"
            multiline={true}
            value={objectiveDescription}
            onChangeText={setObjectiveDescription}
            placeholder="Objective Description"></TextInput>
          {/*Progress Hint */}
          <View className="relative mt-5 ">
            <TextInput
              className="  rounded-xl border border-primary  bg-white p-1 text-center"
              value={objectiveProgress}
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
          {/*Goal Hint */}

          <View className="relative mt-5">
            <TextInput
              className=" rounded-xl border border-primary  bg-white p-1 text-center"
              onChangeText={setObjectiveGoalNumber}
              placeholder="Objective Goal"></TextInput>
            <View className="absolute right-2 top-2 ">
              <Button
                size="icon"
                variant="default"
                className="h-4 w-4 rounded-full bg-slate-500 text-white">
                <CircleQuestionMark color="white" />
              </Button>
            </View>
          </View>
        </AlertDialogDescription>
        <AlertDialogFooter className="flex-row  justify-center gap-3">
          <Button
            variant="outline"
            className="border-red-600"
            onPress={() => {
              setObjectiveTitle('');
              setObjectiveDescription('');
              setObjectiveProgress('');
              setObjectiveGoalNumber('');
              changeVisbility(false);
            }}>
            <Text className="color-black">Cancel</Text>
          </Button>
          <Button
            disabled={!buttonEnabled}
            onPress={() => {
              addNewObjective();
            }}>
            Add Objective
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddObjectiveModal;
