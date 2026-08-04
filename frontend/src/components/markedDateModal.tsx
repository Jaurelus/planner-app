import { Modal, TextInput, Text, View, Pressable } from 'react-native';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui';
import Button from 'components/ui/button';
import { useState } from 'react';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger } from 'components/ui';
import * as SecureStore from 'expo-secure-store';
import ColorSelector from './colorSelector';
import { Select } from 'components/Select';
import { Circle } from 'lucide-react-native';

interface MarkedDateModalProps {
  date: string;
  api: string;
  visible: boolean;
  markedDates: Record<string, any>;
  setVisible: React.Dispatch<React.SetStateAction<any>>;
  refreshDates: React.Dispatch<React.SetStateAction<boolean>>;
}
function MarkedDateModal({
  date,
  api,
  visible,
  setVisible,
  markedDates,
  refreshDates,
}: MarkedDateModalProps) {
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [dateName, setDateName] = useState('');
  const [contextDate, setContextDate] = useState('');
  const [existingMarkedDate, setExistingMarkedDate] = useState<boolean>();
  const [dateType, setDateType] = useState('');
  const [dateRule, setDateRule] = useState('');
  const [editType, setEditType] = useState('');
  const [editRule, setEditRule] = useState('');
  const [editCategory, setEditCategory] = useState<Record<string, any>>({});
  const [selectedEditID, setSelectedEditID] = useState(null);

  useEffect(() => {
    setExistingMarkedDate(Object.keys(markedDates).includes(date.slice(0, 10)));
    setSelectedEditID(null);
    console.log(markedDates['2026-07-04']?.events[0]?.name);

    console.log('KEYS', Object.keys(markedDates));
  }, [date, markedDates]);
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
        refreshDates(true);
        setVisible(false);
      } else {
        console.log('Server side error marking date' + data.message);
      }
    } catch (error) {
      console.log('Client-side eror ', error);
    }
  };
  const editDate = async (dateID) => {
    if (!userInfo || !userToken) return;
    const payload = { dateName: editType, dateRule: editRule, dateCategory: editCategory };
    // ID travels in the URL path (same style as tasks/objectives) -> backend reads req.params.dateID
    const response = await fetch(`${api}dates/${dateID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authtoken: userToken, userid: userInfo._id },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.status == 200) {
      console.log('Date sucessfully edited');
      refreshDates(true);
      setVisible(false);
    } else {
      console.log('Server side error editing date' + data.message);
    }
  };

  //----------- APP BUILD --------------
  return (
    <Modal transparent={true} visible={visible}>
      {!existingMarkedDate ? (
        <Card className="mb-auto ml-auto mr-auto mt-auto w-[75%] items-center justify-center">
          <View className="flex flex-1 bg-[#A77ED6]">
            <CardHeader>
              <CardTitle>{'Add Marked Date?'}</CardTitle>
              <Text className="text-center">{date.slice(0, 10)}</Text>
            </CardHeader>
          </View>

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
            <ColorSelector
              currentCategory={editCategory}
              setUpdatedCategory={setEditCategory}
              api={api}></ColorSelector>
          </CardContent>
          <CardFooter className="gap-3">
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
      ) : (
        <Card className="mb-auto ml-auto mr-auto mt-auto flex w-[75%] items-center justify-center">
          <CardHeader>
            <CardTitle>{'Edit Marked Date?'}</CardTitle>
            <Text className="text-center">{date.slice(0, 10)}</Text>
          </CardHeader>
          {/*2 diff card contents (1 for multidot)*/}
          {selectedEditID == null ? (
            <>
              <CardContent className="mx-3 w-full gap-3">
                {markedDates[date.slice(0, 10)].events.map((event, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      setSelectedEditID(i);
                      setEditType(markedDates[date.slice(0, 10)].events[i].name);
                      setEditRule(markedDates[date.slice(0, 10)].events[i].rule);
                      setEditCategory(markedDates[date.slice(0, 10)].events[i].category);
                    }}>
                    <Card className=" w-full bg-white">
                      <CardHeader className="flex items-center justify-center">
                        <CardTitle>{event.name || 'Hola'}</CardTitle>
                      </CardHeader>
                      <View className="ml-3 flex w-full flex-row gap-3">
                        <Circle
                          fill={markedDates[date.slice(0, 10)].dots[i].color}
                          stroke={markedDates[date.slice(0, 10)].dots[i].color}
                        />

                        <CardDescription className="flex w-[75%] break-words">
                          {event.rule || 'No worko'}
                        </CardDescription>
                      </View>
                    </Card>
                  </Pressable>
                ))}
              </CardContent>
              <CardFooter className="gap-3">
                <Button
                  onPress={() => {
                    setVisible(false);
                  }}>
                  Close
                </Button>
                <Button
                  onPress={() => {
                    setExistingMarkedDate(false);
                  }}>
                  Add New Date
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardContent className="flex">
                <TextInput value={editType} onChangeText={setEditType}></TextInput>
                <TextInput value={editRule} onChangeText={setEditRule} multiline={true}></TextInput>
                <View>
                  <ColorSelector
                    currentCategory={editCategory}
                    setUpdatedCategory={setEditCategory}
                    api={api}></ColorSelector>
                </View>
              </CardContent>
              <CardFooter className="gap-3">
                <Button
                  onPress={() => {
                    setSelectedEditID(null);
                    setVisible(false);
                  }}>
                  Close
                </Button>
                <Button
                  onPress={async () => {
                    await editDate(markedDates[date.slice(0, 10)].events[selectedEditID]._id);
                  }}>
                  Edit Date
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </Modal>
  );
}
export default MarkedDateModal;
