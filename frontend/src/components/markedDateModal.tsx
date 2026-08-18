import { Modal, Text, View, Pressable } from 'react-native';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui';
import Button from 'components/ui/button';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AddModal from './AddModal';
import EditModal from './EditModal';
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
  const [contextDate, setContextDate] = useState('');
  const [existingMarkedDate, setExistingMarkedDate] = useState<boolean>();
  const [selectedEditID, setSelectedEditID] = useState<number | null>(null);
  // Set when the user taps "Add New Date" on a day that already has one
  const [addingAnother, setAddingAnother] = useState(false);

  // Shared form state for AddModal / EditModal. Keys match the backend payload.
  const [form, setForm] = useState<Record<string, any>>({});
  const handleChange = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const dayKey = date.slice(0, 10);

  useEffect(() => {
    const exists = Object.keys(markedDates).includes(dayKey);
    setExistingMarkedDate(exists);
    setSelectedEditID(null);
    setAddingAnother(false);
    // A fresh day goes straight to the add form, so pre-fill the day tapped
    setForm(exists ? {} : { newDateDate: new Date(date) });
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

  // Both modals only ever call this with false (their X button), so it closes
  // the whole flow. Typed as a state setter so it drops straight into their props.
  const closeAll: React.Dispatch<React.SetStateAction<boolean>> = () => {
    setSelectedEditID(null);
    setAddingAnother(false);
    setForm({});
    setVisible(false);
  };

  // Which of the three views is showing
  const showAdd = visible && (!existingMarkedDate || addingAnother);
  const showEdit = visible && !showAdd && selectedEditID !== null;
  const showList = visible && !showAdd && !showEdit;

  //-------- API CALL --------------
  //Function to add marked dates
  const markDate = async () => {
    if (!userInfo || !userToken) return;
    // dateController does newDateType.toLowerCase(), so a blank type 500s there
    if (!form.newDateName || !form.newDateType) {
      console.log('A name and a type are both required to mark a date');
      return;
    }
    const payload: any = {
      newDateDate: form.newDateDate ?? new Date(contextDate),
      newDateName: form.newDateName,
      newDateType: form.newDateType,
    };
    if (form.newDateRule) payload.newDateRule = form.newDateRule;

    try {
      const response = await fetch(api + 'dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authtoken: userToken, userid: userInfo._id },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.status == 201) {
        console.log('Date sucessfully marked');
        refreshDates(true);
        closeAll(false);
      } else {
        console.log('Server side error marking date' + data.message);
      }
    } catch (error) {
      console.log('Client-side eror ', error);
    }
  };
  const editDate = async (dateID: string) => {
    if (!userInfo || !userToken) return;
    const payload = {
      dateName: form.dateName,
      dateRule: form.dateRule,
      dateCategory: form.dateCategory,
    };
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
      closeAll(false);
    } else {
      console.log('Server side error editing date' + data.message);
    }
  };

  //----------- APP BUILD --------------
  return (
    <>
      {/* Same add/edit modals every other module uses */}
      <AddModal
        module="Date"
        visibility={showAdd}
        setVisibility={closeAll}
        values={form}
        onChange={handleChange}
        onClick={markDate}
      />
      <EditModal
        module="Date"
        api={api}
        visibility={showEdit}
        setVisibility={closeAll}
        values={form}
        onChange={handleChange}
        onClick={async () => {
          await editDate(markedDates[dayKey].events[selectedEditID!]._id);
        }}
        context={dayKey}
      />

      {/* Day already has marks: pick which one to edit first */}
      <Modal transparent={true} visible={showList}>
        <View className="flex flex-1 items-center justify-center bg-black/50">
          <Card className="w-5/6">
            <CardHeader className="-mx-[1] -mt-[22px] flex flex-row justify-between rounded-t-2xl bg-[#d1bcea] pb-2 pt-4">
              <View className="-mx-4 flex">
                <CardTitle>Marked Dates</CardTitle>
                <Text className="text-[#3C0275]">{dayKey}</Text>
              </View>
              <Button
                className="-mr-6 -mt-5"
                textClassName="text-[#3C0275]"
                variant="ghost"
                onPress={() => closeAll(false)}>
                X
              </Button>
            </CardHeader>
            <CardContent className="mt-2 gap-3">
              {markedDates[dayKey]?.events.map((event: any, i: number) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setForm({
                      dateName: markedDates[dayKey].events[i].name,
                      dateRule: markedDates[dayKey].events[i].rule,
                      dateCategory: markedDates[dayKey].events[i].category,
                    });
                    setSelectedEditID(i);
                  }}>
                  <Card className="w-full bg-white">
                    <CardHeader className="flex items-center justify-center">
                      <CardTitle>{event.name}</CardTitle>
                    </CardHeader>
                    <View className="ml-3 flex w-full flex-row items-center gap-3">
                      <Circle
                        fill={markedDates[dayKey].dots[i].color}
                        stroke={markedDates[dayKey].dots[i].color}
                      />
                      <CardDescription className="flex w-[75%] break-words">
                        {event.rule}
                      </CardDescription>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </CardContent>
            <CardFooter className="justify-end gap-3">
              <Button
                onPress={() => {
                  setForm({ newDateDate: new Date(contextDate) });
                  setAddingAnother(true);
                }}>
                Add New Date
              </Button>
            </CardFooter>
          </Card>
        </View>
      </Modal>
    </>
  );
}
export default MarkedDateModal;
