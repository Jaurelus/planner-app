import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { useNavigation } from '@react-navigation/native';
import Button from 'components/ui/button';
import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

function LoginScreen() {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPW, setEnteredPW] = useState('');
  const navigator = useNavigation();

  return (
    <View className="flex flex-1 items-center justify-center">
      <Card className="w-[80%] items-center">
        <CardHeader>
          <CardTitle> Log into your account</CardTitle>
        </CardHeader>
        <CardContent className="w-full gap-3">
          <TextInput
            placeholder="Email"
            className="rounded-lg border border-primary py-2 text-center"
            value={enteredEmail}
            onChangeText={setEnteredEmail}
          />
          <TextInput
            placeholder="Password"
            className=" rounded-lg border border-primary py-2 text-center"
            value={enteredPW}
            onChangeText={setEnteredPW}
          />
          <Button>Log In</Button>
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
