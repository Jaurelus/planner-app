import Button from 'components/ui/button';
import { Modal, Text, TextInput, View } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';
import { useEffect, useRef, useState } from 'react';
import { OTPInput } from 'components/ui';
import { useNavigation } from '@react-navigation/native';

interface VerificationModalProps {
  isVisible: boolean;
  user: Record<string, string>;
  api: string;
  onUserUpdate: React.Dispatch<React.SetStateAction<any>>;
}
function VerificationModal({ isVisible, user, api, onUserUpdate }: VerificationModalProps) {
  const [emailMode, setEmailMode] = useState(true);
  const [firstNumRender, setFirstNumRender] = useState(true);
  const [enteredCode, setEnteredCode] = useState('');
  const [submitCodeScreen, setSubmitCodeScreen] = useState(false);
  const [number, setNumber] = useState('');
  const test = useState(true);
  const navigator = useNavigation();

  console.log('k', user.phoneNumber);
  console.log('l', user);

  useEffect(() => {
    console.log(user.phoneNumber);
  });
  //----- API CALL ---------
  const addNumber = async (UserID) => {
    console.log(UserID);
    console.log('------------');
    if (user.phoneNumber) {
      return;
    }
    const payload = {
      phone: number,
    };
    try {
      const response = await fetch(`${api}user/${UserID}`, {
        body: JSON.stringify(payload),
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Better');
        console.log(data.user.phoneNumber);
        onUserUpdate(data.user);
      } else {
        console.log('Add number Error: ', data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendVCode = async (User, mode) => {
    const payload: any = {};
    console.log('if');
    if (mode == true) {
      console.log('true');

      payload.userEmail = User.email;
    } else {
      console.log('false');
      console.log(typeof User.phoneNumber, User.phoneNumber);

      payload.userPhoneNumber = String(User.phoneNumber).padStart(12, '+1');
    }

    console.log('Try');
    try {
      console.log('VCoe');
      const response = await fetch(api + 'user/send', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Verification code successfully sent');
      } else {
        console.log('Error E', data.message);
      }
    } catch (error) {
      console.log('Error :|');
    }
  };

  const compareCodes = async (User, mode) => {
    const payload: any = {};

    if (mode == true) {
      payload.email = User.email;
      payload.uCode = enteredCode;
    } else {
      console.log(User.phoneNumber);
      payload.number = User.phoneNumber;
      payload.uCode = enteredCode;
    }
    try {
      const response = await fetch(api + 'user/verify', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('User verified');
        //login
        login(user);
      } else if (response.status == 401) {
        console.log('Error, wrong code');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error, 'Front');
    }
  };

  const login = async (User) => {
    const payload = {
      tbdUEmail: User.email,
      tbdUPW: User.password,
    };
    console.log('pay');
    try {
      console.log('Logging in');
      const response = await fetch(api + '/user/login', {
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
    <Modal visible={isVisible}>
      <View className="flex flex-1 items-center">
        <View className="flex flex-1 items-center justify-center">
          <Card className="items-center px-5">
            <CardHeader>
              <CardTitle>Verify your account</CardTitle>
            </CardHeader>
            {submitCodeScreen ? (
              <CardContent className=" items-center gap-2">
                <View className="ml-auto mr-auto flex w-full rounded-sm border-2">
                  <OTPInput
                    value={enteredCode}
                    className="overflow-hidden"
                    onChange={setEnteredCode}
                    onComplete={() => {
                      console.log('otp');
                      compareCodes(user, emailMode);
                    }}></OTPInput>
                </View>

                <Button
                  onPress={() => {
                    sendVCode(user, emailMode);
                  }}
                  className="mt-3">
                  Resend code?
                </Button>
              </CardContent>
            ) : (
              <CardContent className="gap-2">
                <View className="flex-row">
                  <Text>Verification code will be sent to this </Text>
                  <Text>{emailMode ? 'email' : 'number'}</Text>
                </View>
                <Text className="text-center">{user.email}</Text>

                {firstNumRender && !emailMode && (
                  <TextInput
                    className="rounded-lg border border-primary p-2"
                    placeholder="Enter your phone number"
                    value={number}
                    onChangeText={setNumber}></TextInput>
                )}

                <Button
                  onPress={async () => {
                    setSubmitCodeScreen((prev) => {
                      return !prev;
                    });

                    if (!user.phoneNumber) {
                      await addNumber(user._id);
                    }
                    sendVCode(user, emailMode);
                  }}>
                  Send Code
                </Button>
              </CardContent>
            )}

            <CardFooter className="mt-4 flex-col gap-3">
              <View className="flex-row">
                <Text className="text-sm">Want to use your </Text>
                <Text>{emailMode ? 'phone number' : 'email'} </Text>
                <Text>instead?</Text>
              </View>
              <Button
                onPress={() => {
                  login(user);
                }}>
                Login
              </Button>
              <Button
                onPress={() => {
                  setEmailMode((prev) => {
                    return !prev;
                  });
                }}>
                Press Here
              </Button>
            </CardFooter>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

export default VerificationModal;
