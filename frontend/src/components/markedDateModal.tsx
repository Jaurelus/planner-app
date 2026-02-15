import { View } from 'lucide-react-native';
import { Modal, TextInput, Text } from 'react-native';
import { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';
import Button from 'components/ui/button';
import { useState } from 'react';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger } from 'components/ui';
import * as SecureStore from 'expo-secure-store';
import ColorSelector from './colorSelector';

interface MarkedDateModalProps {
  date: String;
  api: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<any>>;
  changeFlag: boolean;
}
function MarkedDateModal({ date, api, visible, setVisible, changeFlag }: MarkedDateModalProps) {
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [dateName, setDateName] = useState('');
  const [contextDate, setContextDate] = useState('');

  console.log('Contect', contextDate);
  const [dateType, setDateType] = useState('');
  const [dateRule, setDateRule] = useState('');

  useEffect(() => {
    setContextDate(date.toString());
  }, [date]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
  }, []);
  //-------- API CALL --------------
  //Function to add marked dates
  const markDate = async () => {
    if (!userInfo || !userToken) return;
    const payload: any = {};

    try {
      if (date) {
        payload.newDateDate = new Date(contextDate);
      }
      if (dateName) {
        payload.newDateName = dateName;
      }
      if (dateType) {
        payload.newDateType = dateType;
      }
      if (dateRule) {
        payload.newDateRule = dateRule;
      }
      console.log('Pre fetch');
      console.log(payload);
      const response = await fetch(api + 'dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authtoken: userToken, userid: userInfo._id },
        body: JSON.stringify(payload),
      });
      console.log('post fetch');
      console.log(response.status);

      const data = await response.json();
      console.log(data.message);
      if (response.status == 201) {
        console.log('Date sucessfully marked');
        changeFlag = true;
      } else {
        console.log('Server side error ' + data.message);
      }
    } catch (error) {
      console.log('Client-side eror ', error);
    }
  };
  //----------- APP BUILD --------------
  return (
    <Modal transparent={true} visible={visible}>
      <Card className="mb-auto ml-auto mr-auto mt-auto w-[75%] items-center justify-center">
        <CardHeader>
          <CardTitle>Add Marked Date?</CardTitle>
          <Text className="text-center">{new Date(date.toString()).toLocaleDateString()}</Text>
        </CardHeader>

        <CardContent className="w-full items-center gap-3 ">
          <TextInput
            className=" w-3/4 rounded-lg border border-primary p-1 text-center"
            placeholder="Name"
            value={dateName}
            onChangeText={setDateName}></TextInput>
          <TextInput
            className="w-3/4 rounded-lg border border-primary p-1 text-center"
            placeholder="Type (Ex: Birthdays)"
            value={dateType}
            onChangeText={setDateType}></TextInput>
          <ColorSelector></ColorSelector>
        </CardContent>
        <CardFooter>
          <Button
            onPress={() => {
              markDate();
            }}>
            Add Date
          </Button>
          <Button
            onPress={() => {
              setVisible(false);
            }}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}
export default MarkedDateModal;
