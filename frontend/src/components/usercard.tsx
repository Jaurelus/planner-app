import { Circle, SquarePen, BadgeCheck } from 'lucide-react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';
import { Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import Button from 'components/ui/button';
import * as SecureStore from 'expo-secure-store';

function UserCard() {
  const [userToken, setUserToken] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
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
  return (
    <Card className="relative w-[75%] p-0 pb-5">
      {userInfo != null && (
        <View>
          <View className="absolute right-2 top-2">
            <Button
              variant="outline"
              className="flex h-8 w-8 rounded-3xl"
              onPress={() => {
                setNameFocused((prev) => {
                  return !prev;
                });
              }}>
              <SquarePen size={16} className="flex" color={'black'} />
            </Button>
          </View>
          <CardHeader className=" ml-5 mr-5 mt-5 flex-col justify-between">
            <View className="mt-3 flex flex-row justify-between">
              <Circle className=" " fill={'#754ABF'} size={64} color={'#754ABF'}>
                <Text className="mt-6 text-center text-xl font-bold color-white">
                  {userInfo.firstName ? userInfo.firstName.slice(0, 1) : 'D'}
                </Text>
              </Circle>
              <CardTitle className="mt-6 text-lg">{userInfo.firstName}</CardTitle>
            </View>
          </CardHeader>
          {userInfo && (
            <CardContent className="gap-3">
              <TextInput
                editable={nameFocused ? true : false}
                showSoftInputOnFocus={false}
                onPress={(e) => {
                  e.preventDefault();
                }}
                className={`${nameFocused ? 'border border-black' : 'border-none'} rounded-lg text-center`}
                autoFocus={false}
                onFocus={() => {
                  setNameFocused(true);
                }}>
                {userInfo.firstName || 'First Name'}
              </TextInput>
              <TextInput
                editable={nameFocused ? true : false}
                showSoftInputOnFocus={false}
                onPress={(e) => {
                  e.preventDefault();
                }}
                className={`${nameFocused ? 'border border-black' : 'border-none'} rounded-lg text-center`}
                autoFocus={false}
                onFocus={() => {
                  setNameFocused(true);
                }}>
                {userInfo.lastName || 'Last Name'}
              </TextInput>
              <TextInput
                editable={nameFocused ? true : false}
                className={`${nameFocused ? 'border border-black' : 'border-none'} flex rounded-lg px-2 text-center`}
                autoFocus={false}
                onFocus={() => {
                  setNameFocused(true);
                }}>
                {userInfo.email}
              </TextInput>
              <TextInput
                editable={nameFocused ? true : false}
                className={`${nameFocused ? 'border border-black' : 'border-none'} rounded-lg text-center`}
                autoFocus={false}
                onFocus={() => {
                  setNameFocused(true);
                }}>
                {userInfo.phoneNumber || 'Phone Number'}
              </TextInput>
              {hardCodeUser.isVerified && (
                <View className="mr-5 flex-row justify-center">
                  <BadgeCheck fill={'green'} color={'white'}></BadgeCheck>
                  <Text className="mt-1 text-center"> Account verified</Text>
                </View>
              )}
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
