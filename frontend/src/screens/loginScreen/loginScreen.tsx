import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput } from 'react-native';
import { useEffect, useState } from 'react';

import Button from 'components/ui/button';
import * as SecureStore from 'expo-secure-store';
import { useToast } from '@/components/Toast';

interface LoginProps {
  route: any;
}
function LoginScreen({ route }: LoginProps) {
  const { onChange } = route.params;
  // Filled in when arriving straight from Register
  const [enteredEmail, setEnteredEmail] = useState(route.params?.prefillEmail ?? '');
  const [enteredPW, setEnteredPW] = useState(route.params?.prefillPW ?? '');
  const navigator = useNavigation();
  const { api } = route.params;
  const showError = useToast();

  useEffect(() => {
    if (route.params?.prefillEmail) setEnteredEmail(route.params.prefillEmail);
    if (route.params?.prefillPW) setEnteredPW(route.params.prefillPW);
  }, [route.params?.prefillEmail, route.params?.prefillPW]);
  const login = async () => {
    const payload = {
      tbdUEmail: enteredEmail,
      tdbUPW: enteredPW,
    };
    try {
      const response = await fetch(api + 'user/login', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('User successfully logged in');

        const tmpTok = data.token;
        const tmpUsr = JSON.stringify(data.user);
        onChange(true);
        await SecureStore.setItemAsync('token', tmpTok);
        await SecureStore.setItemAsync('userInfo', tmpUsr);

        navigator.navigate('Home');
      } else {
        console.log('Error logging in', data.message);
        showError(data.message || 'Could not log you in');
      }
    } catch (error) {
      console.log(error);
      showError('Network error — please try again');
    }
  };

  return (
    <View className="flex flex-1 items-center justify-center">
      <Card className="flex w-[80%] items-center">
        <CardHeader>
          <CardTitle> Log into your account</CardTitle>
        </CardHeader>
        <CardContent className="w-full gap-3">
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            className=" rounded-lg border border-primary py-2 text-center"
            value={enteredEmail}
            onChangeText={setEnteredEmail}
          />
          <TextInput
            autoCapitalize="none"
            secureTextEntry
            placeholder="Password"
            className=" rounded-lg border border-primary py-2 text-center"
            value={enteredPW}
            onChangeText={setEnteredPW}
          />
          <Button
            onPress={() => {
              login();
            }}>
            Log In
          </Button>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <View className="items-center ">
            <Text className="font-medium">New user?</Text>
          </View>

          <Button
            onPress={() => {
              navigator.navigate('Register');
            }}>
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}

export default LoginScreen;
