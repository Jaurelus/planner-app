import { View, Text, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import Navbar from '../../components/ui/Navbar';
import Button from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BellPlus, LucideCircleX, SquarePen } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import AddModal from '@/components/AddModal';
import { useToast } from '@/components/Toast';
import EditModal from '@/components/EditModal';
import DeleteModal from '@/components/DeleteModal';

function HomePage({ route }: any) {
  const api = route?.params?.api;
  const showError = useToast();

  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [reminders, setReminders] = useState<any[]>([]);

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [form, setForm] = useState<Record<string, any>>({});
  const handleChange = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Same palette the objective and goal cards use
  const colors = ['#D8EED2', '#FEE2C3', '#E1D9FB', '#D0E9FA'];

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
  }, []);

  //-------- API Calls --------

  const getReminders = async () => {
    if (!userToken || !userInfo || !api) return;
    try {
      const response = await fetch(api + 'reminders', {
        method: 'GET',
        headers: { Authtoken: userToken, userid: userInfo._id },
      });
      const data = await response.json();
      if (response.status == 200) {
        setReminders(data.reminders ?? []);
      } else {
        showError('Could not load your reminders');
      }
    } catch (error) {
      showError('Network error loading reminders');
    }
  };

  useEffect(() => {
    getReminders();
  }, [userToken, userInfo]);

  const addReminder = async () => {
    if (!userToken || !userInfo) return;
    try {
      const response = await fetch(api + 'reminders', {
        method: 'POST',
        headers: {
          Authtoken: userToken,
          userid: userInfo._id,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.status == 201) {
        setForm({});
        setAddVisible(false);
        getReminders();
      } else {
        showError(data.message || 'Could not add that reminder');
      }
    } catch (error) {
      showError('Network error adding reminder');
    }
  };

  const editReminder = async () => {
    if (!userToken || !userInfo || !selected) return;
    try {
      const response = await fetch(api + 'reminders/' + selected._id, {
        method: 'PATCH',
        headers: {
          Authtoken: userToken,
          userid: userInfo._id,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.status == 200) {
        setForm({});
        setEditVisible(false);
        setSelected(null);
        getReminders();
      } else {
        showError(data.message || 'Could not save that reminder');
      }
    } catch (error) {
      showError('Network error saving reminder');
    }
  };

  const deleteReminder = async () => {
    if (!userToken || !userInfo || !selected) return;
    try {
      const response = await fetch(api + 'reminders/' + selected._id, {
        method: 'DELETE',
        headers: { Authtoken: userToken, userid: userInfo._id },
      });
      if (response.status == 200) {
        setDeleteVisible(false);
        setSelected(null);
        getReminders();
      }
    } catch (error) {
      showError('Could not delete that reminder');
    }
  };

  const formatWhen = (value: string) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  //---------- App Build ----------

  return (
    <View className="flex flex-1">
      <View className="flex flex-1">
        <View className="items-center pt-6">
          {/* Wordmark -- wide aspect, so contain rather than a square box */}
          <Image
            style={{ width: 220, height: 58 }}
            resizeMode="contain"
            source={require('../../../assets/dayflow-logotype.png')}></Image>
          <Text className="mt-4 text-lg font-semibold">{new Date().toDateString()}</Text>
          <Text className="mt-1 text-slate-500">Reminders</Text>
        </View>

        <ScrollView contentContainerClassName="gap-3 px-5 pb-6 pt-3">
          {reminders.length === 0 ? (
            <Card className="bg-[#E1D9FB]">
              <CardContent className="py-4">
                <Text className="text-center text-sm">
                  Nothing to remember right now. Tap the bell to add a reminder.
                </Text>
              </CardContent>
            </Card>
          ) : (
            reminders.map((reminder, index) => (
              <Card
                key={reminder._id}
                style={{ backgroundColor: colors[index % colors.length] }}>
                <CardHeader className="flex-row items-center justify-between pb-1">
                  <CardTitle className="text-base">{formatWhen(reminder.date)}</CardTitle>
                  <View className="flex-row gap-2">
                    <Button
                      size="icon"
                      className="rounded-full"
                      variant="ghost"
                      onPress={() => {
                        setSelected(reminder);
                        setForm({
                          reminderDescription: reminder.description,
                          reminderDate: new Date(reminder.date),
                        });
                        setEditVisible(true);
                      }}>
                      <SquarePen size={18} />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full"
                      variant="ghost"
                      onPress={() => {
                        setSelected(reminder);
                        setDeleteVisible(true);
                      }}>
                      <LucideCircleX size={18} color={'red'} />
                    </Button>
                  </View>
                </CardHeader>
                <CardContent className="py-1">
                  <Text className="text-sm">{reminder.description}</Text>
                </CardContent>
              </Card>
            ))
          )}
        </ScrollView>

        {/* Add reminder — same floating style as the add task button */}
        <Button
          className="absolute bottom-24 right-10 rounded-full border p-2"
          size="lg"
          onPress={() => {
            setForm({});
            setAddVisible(true);
          }}>
          <BellPlus color={'white'} />
        </Button>

        <AddModal
          module="Reminder"
          visibility={addVisible}
          setVisibility={setAddVisible}
          values={form}
          onChange={handleChange}
          onClick={addReminder}
        />
        <EditModal
          module="Reminder"
          visibility={editVisible}
          setVisibility={setEditVisible}
          values={form}
          onChange={handleChange}
          onClick={editReminder}
          context={selected?.description}
        />
        <DeleteModal
          module="Reminder"
          visibility={deleteVisible}
          setVisibility={setDeleteVisible}
          onClick={deleteReminder}
          context={selected?.description ?? ''}
        />
      </View>
      <View className="flex w-full">
        <Navbar />
      </View>
    </View>
  );
}
export default HomePage;
