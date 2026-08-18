import { View, Text, Pressable, Modal } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Circle, Check } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import Button from 'components/ui/button';

function ColorSelector({
  api,
  currentCategory,
  setUpdatedCategory,
  manage = false,
}: {
  api: string;
  currentCategory?: Record<string, any>;
  setUpdatedCategory?: React.Dispatch<React.SetStateAction<any>>;
  // manage = settings screen: list every category and let its colour be changed
  manage?: boolean;
}) {
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userCategories, setUserCategories] = useState<any[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState(
    currentCategory ? currentCategory.type : 'Category'
  );
  const [visible, setVisible] = useState(false);
  // Which category the colour picker is open for (manage mode)
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!userInfo || !userToken) return;
    getColors();
    if (manage) getPalette();
  }, [userInfo, userToken]);

  // The picker outlives a single open when it sits inside a persistent modal,
  // so follow the category the parent hands us instead of only the first one
  useEffect(() => {
    setSelectedValue(currentCategory?.type ?? 'Category');
  }, [currentCategory?.type]);

  //-------- API Calls --------

  const getColors = async (color?: string) => {
    if (!userInfo || !userToken) return;
    const response = await fetch(
      !color ? api + 'dates/categories' : api + `dates/categories?color=${color}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authtoken: userToken, userid: userInfo._id },
      }
    );
    const data = await response.json();
    if (response.status == 200) {
      setUserCategories(data.categories ?? []);
    } else {
      console.log('Server side error getting colors', data.message);
    }
  };

  const getPalette = async () => {
    if (!userInfo || !userToken) return;
    const response = await fetch(api + 'dates/palette', {
      method: 'GET',
      headers: { Authtoken: userToken, userid: userInfo._id },
    });
    const data = await response.json();
    if (response.status == 200) setPalette(data.colors ?? []);
  };

  // Duplicates are allowed here -- the backend only enforces uniqueness on create
  const saveCategoryColor = async (newColor: string) => {
    if (!userInfo || !userToken || !editing) return;
    try {
      setSaving(true);
      const response = await fetch(api + 'dates/categories', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authtoken: userToken,
          userid: userInfo._id,
        },
        body: JSON.stringify({ categoryType: editing.type, newColor }),
      });
      const data = await response.json();
      if (response.status == 200) {
        setEditing(null);
        await getColors();
      } else {
        console.log('Server side error saving colour', data.message);
      }
    } catch (error) {
      console.log('Client error saving colour', error);
    } finally {
      setSaving(false);
    }
  };

  //-------- Manage mode: the settings list --------

  if (manage) {
    return (
      <View className="w-full">
        {userCategories.length === 0 ? (
          <Text className="py-2 text-xs text-slate-500">
            No categories yet — they appear once you mark a date.
          </Text>
        ) : (
          <View className="w-full">
            {/* Collapsed summary -- swatches only, tap to reveal the list */}
            <Pressable
              className="flex-row items-center justify-between rounded-lg border border-[#d1bcea] px-3 py-2"
              onPress={() => setVisible((prev) => !prev)}>
              <View className="flex-row items-center gap-1">
                {userCategories.slice(0, 5).map((value, i) => (
                  <Circle key={i} size={14} fill={value.color} stroke={value.color} />
                ))}
                {userCategories.length > 5 && (
                  <Text className="ml-1 text-xs text-slate-500">+{userCategories.length - 5}</Text>
                )}
              </View>
              <Text className="text-xs text-slate-500">
                {userCategories.length} {userCategories.length === 1 ? 'category' : 'categories'}
                {visible ? '  ▲' : '  ▼'}
              </Text>
            </Pressable>

            {visible && (
              <View className="mt-1 w-full gap-1">
                {userCategories.map((value, i) => (
                  <Pressable
                    key={i}
                    className="flex flex-row items-center justify-between rounded-lg px-2 py-2"
                    onPress={() => setEditing(value)}>
                    <Text className="capitalize">{value.type}</Text>
                    <View className="flex-row items-center gap-2">
                      <Circle size={18} fill={value.color} stroke={value.color} />
                      <Text className="text-xs text-slate-400">Edit</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Colour picker */}
        <Modal transparent={true} visible={!!editing} animationType="fade">
          <View className="flex flex-1 items-center justify-center bg-black/50">
            <Card className="w-5/6">
              <CardHeader className="-mx-[1] -mt-[22px] rounded-t-2xl bg-[#d1bcea] pb-2 pt-4">
                <CardTitle className="capitalize">{editing?.type}</CardTitle>
                <Text className="color-primary">Pick a colour for this category</Text>
              </CardHeader>
              <CardContent className="mt-3 flex-row flex-wrap justify-center gap-4">
                {palette.map((color) => (
                  <Pressable
                    key={color}
                    disabled={saving}
                    onPress={() => saveCategoryColor(color)}
                    className="items-center justify-center">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: color }}>
                      {editing?.color === color && <Check color="white" size={22} />}
                    </View>
                  </Pressable>
                ))}
              </CardContent>
              <View className="mt-2 px-4 pb-2">
                <Text className="text-center text-xs text-slate-500">
                  Colours can be shared between categories.
                </Text>
              </View>
              <View className="flex-row justify-end p-3">
                <Button variant="outline" onPress={() => setEditing(null)}>
                  <Text className="color-black">Close</Text>
                </Button>
              </View>
            </Card>
          </View>
        </Modal>
      </View>
    );
  }

  //-------- Picker mode: unchanged, used by markedDateModal --------

  return (
    <View className="">
      {userCategories && (
        <View className="relative flex flex-row">
          <Pressable
            className="border-1 w-28 rounded-lg border border-primary p-1"
            onPress={() => {
              setVisible((prev) => !prev);
            }}>
            <Text className="text-center">{selectedValue}</Text>
          </Pressable>
          {visible && (
            <View className="border-1 absolute -left-2 top-10 z-50 -ml-3 rounded-lg border border-primary bg-white p-3">
              {userCategories.map((value, i) => (
                <Pressable
                  key={i}
                  className="flex w-32 flex-1 flex-col gap-2"
                  onPress={() => {
                    setSelectedValue(value.type);
                    setVisible(false);
                    // Whole object: dateController reads .type and .color off it
                    setUpdatedCategory?.(value);
                  }}>
                  <View className="flex flex-1 flex-row justify-between">
                    <Text>{value.type}</Text>
                    <Circle
                      size={16}
                      fill={value.color}
                      stroke={value.color}
                      className="z-50 ml-10"></Circle>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
export default ColorSelector;
