import { SquarePen, Mail } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
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

  // The server copy -- this is what the card renders
  const [APIUser, setAPIUser] = useState<any>(null);

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
    if (!userInfo || !userToken) return;
    getUser();
  }, [userInfo, userToken]);

  //-------- API Calls --------
  const getUser = async () => {
    if (!userInfo || !userToken) return null;
    try {
      const response = await fetch(api + 'user/getUser', {
        headers: { Authtoken: userToken, userid: userInfo._id },
        method: 'GET',
      });
      const data = await response.json();
      if (response.status == 200) {
        setAPIUser(data.user);
        // Seed the edit fields from the server, not from stale storage
        setEditFirstName(data.user.firstName ?? '');
        setEditLastName(data.user.lastName ?? '');

        return data.user; // returned so callers can persist it
      }
      console.log('Server Error getting user:', data.message);
      return null;
    } catch (error) {
      console.log('Client Side Error getting user', error);
      return null;
    }
  };

  const editUser = async (userID: string) => {
    const payload = {
      userFirst: editFirstName,
      userLast: editLastName,

    };

    try {
      const response = await fetch(`${api}user/${userID}`, {
        headers: { Authtoken: userToken, 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status == 200) {
        const fresh = await getUser();
        // getUser returns the doc now -- the old code stored `undefined`
        if (fresh) await SecureStore.setItemAsync('userInfo', JSON.stringify(fresh));
      } else {
        console.log('Server Error: ', data.message);
      }
    } catch (error) {
      console.log('Client Side Error', error);
    }
  };

  const initial = (APIUser?.firstName || APIUser?.email || 'U').slice(0, 1).toUpperCase();
  const fullName =
    [APIUser?.firstName, APIUser?.lastName].filter(Boolean).join(' ') || 'Add your name';

  //-------- APP BUILD -----------
  return (
    <Card className="w-[75%]">
      <CardHeader className="-mx-[1] -mt-[22px] flex-row items-center justify-between rounded-t-2xl bg-[#d1bcea] pb-3 pt-4">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Text className="text-xl font-bold color-white">{initial}</Text>
          </View>
          <View>
            <CardTitle className="text-lg">{fullName}</CardTitle>
            <Text className="color-primary text-xs">Profile</Text>
          </View>
        </View>

        <AlertDialog>
          <AlertDialogTrigger asChild={true}>
            <Button size="icon" variant="ghost" className="rounded-full">
              <SquarePen size={18} color={'#3c0275'} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="!w-[90%] bg-white px-2">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit User Info</AlertDialogTitle>
            </AlertDialogHeader>
            <View className="mt-2 gap-4 px-2">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">First Name</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-2 text-center"
                  value={editFirstName}
                  placeholder="First Name"
                  onChangeText={setEditFirstName}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Last Name</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-2 text-center"
                  value={editLastName}
                  placeholder="Last Name"
                  onChangeText={setEditLastName}
                />
              </View>
            </View>
            <AlertDialogFooter className="mt-4 flex-row justify-center gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onPress={async () => {
                  await editUser(userInfo._id);
                }}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      {APIUser && (
        <CardContent className="mt-3 gap-1 pb-4">
          <View className="flex-row items-center gap-3 py-2">
            <Mail size={16} color={'#754ABF'} />
            <Text className="flex-1">{APIUser.email}</Text>
          </View>
        </CardContent>
      )}
    </Card>
  );
}

export default UserCard;
