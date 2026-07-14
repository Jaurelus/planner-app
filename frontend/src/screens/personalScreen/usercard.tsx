import { Circle, SquarePen, BadgeCheck } from 'lucide-react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui';
import { Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import Button from 'components/ui/button';
import * as SecureStore from 'expo-secure-store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui';

function UserCard({ api }: { api: string }) {
  const [userToken, setUserToken] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [APIUser, setAPIUser] = useState<any>(null);

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
    if (!userInfo) return;
    getUser();
    setEditFirstName(userInfo.firstName);
    setEditLastName(userInfo.lastName);
    setEditNumber(userInfo.phoneNumber);
  }, [userInfo]);
  //console.log(user.user);
  const [nameFocused, setNameFocused] = useState(false);
  const hardCodeUser = {
    __v: 0,
    _id: '6987c123a2d46cca15f341b2',
    email: 'jayden12@gmail.com',
    firstName: 'Jayden',
    lastName: '',
    isVerified: true,
    password: '$2b$10$WF637oLqV3OpR/rnkjWRu.w4ypaV7EJS3uXOMW3L5dFe6rwDZ3UUi',
    phoneNumber: '5614526777',
    userGoals: [],
    userTasks: [],
  };

  //-------- API Calls --------
  const getUser = async () => {
    if (!userInfo) return;
    const response = await fetch(api + 'user/getUser', {
      headers: { Authtoken: userToken, userid: userInfo._id },
      method: 'GET',
    });
    const data = await response.json();
    if (response.status == 200) {
      console.log('user retrieved');
      setAPIUser(data.user);
    } else {
      console.log('Server Error getting user:', data.message);
    }
  };
  const editUser = async (userID: Number) => {
    const payload = {
      userFirst: editFirstName,
      userLast: editLastName,
      phone: editNumber,
    };

    try {
      const response = await fetch(`${api}user/${userID}`, {
        headers: { Authtoken: userToken, 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('User updated');
        getUser();
      } else {
        console.log('Server Error: ', data.message);
      }
    } catch (error) {
      console.log('Client Side Error', error);
    }
  };
  //-------- APP BUILD -----------
  return (
    <Card className="relative w-[75%] pb-3 ">
      {userInfo != null && (
        <View>
          <View className="absolute right-2 top-2">
            <AlertDialog>
              <AlertDialogTrigger asChild={true}>
                <Button className=" h-24 w-24 rounded-lg p-1" onPress={() => {}}>
                  <SquarePen size={20} className="flex" color={'white'} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex !w-[90%] items-center justify-center gap-3 bg-white">
                <AlertDialogHeader className="py-5">
                  <AlertDialogTitle>Edit User Info</AlertDialogTitle>
                </AlertDialogHeader>
                <View className="flex items-center gap-5 py-5 text-center">
                  <TextInput
                    value={editFirstName}
                    placeholder="First Name"
                    onChangeText={setEditFirstName}></TextInput>
                  <TextInput
                    value={editLastName}
                    placeholder="Last Name"
                    onChangeText={setEditLastName}></TextInput>
                </View>
                <AlertDialogFooter className="flex flex-row items-center justify-center gap-3 py-5">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onPress={async () => {
                      await editUser(userInfo._id);
                      let tmpUsr = await getUser();
                      await SecureStore.setItemAsync('userInfo', JSON.stringify(tmpUsr));
                    }}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
          <CardHeader className=" ml-5 mr-5 mt-5 flex-col justify-between">
            <View className="mt-3 flex flex-row justify-between">
              <View className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Text className="text-center text-xl font-bold color-white">
                  {userInfo.firstName ? userInfo.firstName.slice(0, 1) : 'U'}
                </Text>
              </View>

              <CardTitle className="mt-6 text-lg">{userInfo.firstName}</CardTitle>
            </View>
          </CardHeader>
          {APIUser && (
            <CardContent className="gap-3">
              <Text
                onPress={(e) => {
                  e.preventDefault();
                }}
                className=" flex rounded-lg px-2 text-center">
                {APIUser.firstName || 'First Name'}
              </Text>
              <Text className=" flex rounded-lg px-2 text-center">
                {APIUser.lastName || 'Last Name'}
              </Text>
              <Text className=" flex rounded-lg px-2 text-center">{APIUser.email}</Text>
            </CardContent>
          )}
          {nameFocused && (
            <CardFooter className="flex justify-center">
              <Button
                onPress={() => {
                  setNameFocused(false);
                }}>
                Submit
              </Button>
            </CardFooter>
          )}
        </View>
      )}
    </Card>
  );
}

export default UserCard;
