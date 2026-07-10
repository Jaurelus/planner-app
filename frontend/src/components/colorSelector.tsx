import { Select } from 'components/Select';
import { View, Text, Pressable, Modal } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Circle } from 'lucide-react-native';

function ColorSelector({
  api,
  currentCategory,
  setUpdatedCategory,
}: {
  api: string;
  currentCategory?: Record<string, any>;
  setUpdatedCategory: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userCategories, setUserCategories] = useState([]);
  const [selectedValue, setSelectedValue] = useState(
    currentCategory ? currentCategory.type : 'Category'
  );
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    console.log('Category, ', currentCategory);
  }, [currentCategory]);
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
    if (!userInfo) return;
    getColors();
  }, [userInfo]);

  const getColors = async (color?) => {
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
      console.log('Success getting colors ', data.categories);
      setUserCategories(data.categories);
    } else {
      console.log('Server side error getting colors', data.message);
    }
  };

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
                    setUpdatedCategory(value.type);
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
