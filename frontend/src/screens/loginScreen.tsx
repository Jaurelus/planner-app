import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { useNavigation } from '@react-navigation/native';
import Button from 'components/ui/button';
import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

function LoginScreen({ route }) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPW, setEnteredPW] = useState('');
  const navigator = useNavigation();
  const { api } = route.params;
  const login = async () => {
    const payload = {
      tbdUEmail: enteredEmail,
      tdbUPW: enteredPW,
    };
    console.log(payload);
    try {
      console.log('Logging in: ');
      const response = await fetch(api + 'user/login', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('User successfully logged in');
        navigator.navigate('Home');
      } else console.log('Error logging in', data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex flex-1 items-center justify-center">
      <Card className="w-[80%] items-center">
        <CardHeader>
          <CardTitle> Log into your account</CardTitle>
        </CardHeader>
        <CardContent className="w-full gap-3">
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            className="rounded-lg border border-primary py-2 text-center"
            value={enteredEmail}
            onChangeText={setEnteredEmail}
          />
          <TextInput
            autoCapitalize="none"
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
