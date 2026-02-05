import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { useNavigation } from '@react-navigation/native';
import Button from 'components/ui/button';
import { useRef, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Check } from 'lucide-react-native';
import VerificationModal from '@/components/verificationModal';

function RegisterScreen({ route }) {
  const { api } = route.params;
  const [email, setEmail] = useState('');
  const [PW, setPW] = useState('');
  const [confirmpW, setConfirmPW] = useState('');
  const naviagtor = useNavigation();
  const [validemail, setValidEmail] = useState(true);
  const [PWCheck, setPWCheck] = useState(true);
  const [PWConfirmCheck, setPWConfirmCheck] = useState(true);
  const [lengthCheck, setlengthCheck] = useState(false);
  const [numFlag, setNumFlag] = useState(false);
  const [upperFlag, setUpperFlag] = useState(false);
  const [initialERender, setInitialERender] = useState(true);
  const [initialPWRender, setInitialPWRender] = useState(true);
  const [initialPWCRender, setInitialPWCRender] = useState(true);

  //Handle valid and invlaid input from email box
  const handleIntitilView = () => {};
  const handleEmailInput = (email: string) => {
    setInitialERender(false);
    if (!email.includes('@')) {
      setValidEmail(false);
    } else if (email.startsWith('@') || email.endsWith('@')) {
      setValidEmail(false);
    } else if (!(email.split('@')[1].length > 2 && email.split('@')[1].slice(1).includes('.'))) {
      setValidEmail(false);
    } else {
      setValidEmail(true);
    }
  };
  //Handle valid and invlaid input from PW box
  const handlePWInput = (password: string) => {
    setInitialPWRender(false);
    setPWConfirmCheck(false);
    {
      let tmp1 = false;
      let tmp2 = false;
      let tmp3 = false;
      if (password.length > 7) {
        tmp1 = true;
      } else {
        tmp2 = false;
      }
      if (/[0-9]/.test(password)) {
        tmp2 = true;
      } else {
        tmp2 = false;
      }
      if (/[A-Z]/.test(password)) {
        tmp3 = true;
      } else {
        tmp3 = false;
      }
      setlengthCheck(tmp1);
      setNumFlag(tmp2);
      setUpperFlag(tmp3);

      console.log('NumFlag ', numFlag);
      console.log(upperFlag);
      console.log('Length , ', lengthCheck);

      if (tmp1 && tmp2 && tmp3) {
        setPWCheck(true);
        console.log(PWCheck);
      } else {
        setPWCheck(false);
      }
    }
  };

  //Handle valid and invlaid input from confirm box
  const handleConfirmInput = (password: string, confirmation: string) => {
    setInitialPWCRender(false);
    let tmp = false;
    if (password === confirmation) {
      tmp = true;
    } else {
      tmp = false;
    }
    setPWConfirmCheck(tmp);
    console.log(tmp);
  };
  //-------- API CAL ----------

  //Do a security check on the button
  const registerUser = async () => {
    console.log('Start api call8');
    try {
      const payload = {
        userEmail: email,
        userPassword: PW,
      };
      console.log(api);
      const response = await fetch(api + '  user', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status == 201) {
        console.log('User Added');
        setPW('');
        setEmail('');
        setConfirmPW('');
        setPWCheck(false);
        setValidEmail(false);
      }
      if (response.status == 400) {
        console.log('Error');
      } else console.log(response.status);
    } catch (error) {
      console.log('Error', error);
    }
  };
  return (
    <View className=" flex flex-1 items-center justify-center">
      <VerificationModal visibility={false}></VerificationModal>
      <Card className="w-[80%] items-center">
        <CardHeader>
          <CardTitle>Sign Up </CardTitle>
        </CardHeader>
        <CardContent className="w-full gap-3">
          <View className="relative">
            <TextInput
              autoCapitalize="none"
              onBlur={() => {
                handleEmailInput(email);
              }}
              value={email}
              onChangeText={setEmail}
              className="rounded-lg border border-primary py-2 text-center"
              style={{ borderColor: validemail ? '#754ABF' : 'red' }}
              placeholder="Email"></TextInput>
            <View className="absolute mt-1 hidden">
              {validemail && !initialERender && <Check color={'green'}></Check>}
            </View>
          </View>

          <View>
            <TextInput
              //secureTextEntry
              autoCapitalize="none"
              onBlur={() => {
                handlePWInput(PW);
              }}
              value={PW}
              onChangeText={setPW}
              className="rounded-lg border border-primary py-2 text-center"
              style={{ borderColor: PWCheck ? '#754ABF' : 'red' }}
              placeholder="Password"></TextInput>
            <View className="absolute mt-1 hidden">
              {PWCheck && !initialPWRender && <Check color={'green'}></Check>}
            </View>
            <View className=" mt-4 gap-1">
              {!lengthCheck && !initialPWRender && (
                <Text className="text-center text-xs font-light" style={{ color: 'red' }}>
                  Password must be at least 8 characters long
                </Text>
              )}
              {!numFlag && !initialPWRender && (
                <Text className="text-center text-xs font-light" style={{ color: 'red' }}>
                  Password must contain at least 1 number
                </Text>
              )}
              {!upperFlag && !initialPWRender && (
                <Text className="text-center text-xs font-light" style={{ color: 'red' }}>
                  Password must be contain at least 1 uppercase letter
                </Text>
              )}
            </View>
          </View>
          <View>
            <TextInput
              onBlur={() => {
                handleConfirmInput(confirmpW, PW);
              }}
              autoCapitalize="none"
              value={confirmpW}
              onChangeText={setConfirmPW}
              className="rounded-lg border border-primary py-2 text-center"
              style={{ borderColor: PWConfirmCheck ? '#754ABF' : 'red' }}
              placeholder="Confirm Password"></TextInput>
            <View className="absolute mt-1 ">
              {PWConfirmCheck && !initialPWCRender && <Check color="green"></Check>}
            </View>
            {!PWConfirmCheck && (
              <Text className=" font-red mt-2 text-center text-xs" style={{ color: 'red' }}>
                Passwords must match
              </Text>
            )}
          </View>

          <Button
            className="mb-3"
            onPress={() => {
              registerUser();
            }}>
            Sign Up!
          </Button>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Text>Already signed up?</Text>
          <Button
            disabled={validemail && PWCheck && PWConfirmCheck ? false : true}
            onPress={() => {
              naviagtor.navigate('Login');
            }}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}

export default RegisterScreen;
