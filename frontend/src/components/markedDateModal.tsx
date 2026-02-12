import { View } from 'lucide-react-native';
import { Modal, TextInput, Text } from 'react-native';
import { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';
import Button from 'components/ui/button';
import { useState } from 'react';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger } from 'components/ui';

interface MarkedDateModalProps {
  date: String;
  api: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<any>>;
}
function MarkedDateModal({ date, api, visible, setVisible }: MarkedDateModalProps) {
  const [dateName, setDateName] = useState('');
  const [contextDate, setContextDate] = useState('');
  useEffect(() => {
    setContextDate(date.toString());
  }, [date]);
  console.log('Contect', contextDate);
  const [dateType, setDateType] = useState('');

  const [dateRule, setDateRule] = useState('');
  console.log(contextDate.toString(), 'String ');
  //-------- API CALL --------------
  //Function to add marked dates
  const markDate = async () => {
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
      console.log(typeof contextDate);
      console.log('Pre fetch');
      console.log(payload);
      const response = await fetch(api + 'dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authtoken: 'token' },
        body: JSON.stringify(payload),
      });
      console.log('post fetch');
      console.log(response.status);

      const data = await response.json();
      console.log(data.message);
      if (response.status == 200) {
        console.log('Date sucessfully marked');
      } else {
        console.log('Server side error' + data.message);
      }
    } catch (error) {
      console.log('Client-side eror', error);
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
