import { View, Text } from 'react-native';
import PlaidLogin from './plaidlogin';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

function FinanceScreen({ route }) {
  const { api } = route.params;
  const [userToken, setUserToken] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
    console.log('UserInfo, ', userInfo);
  }, []);
  // Check if the user is already logged into any accounts
  //If so show dashboard else login

  return (
    <View className="flex flex-1 items-center justify-center">
      <Text>Coming Soon</Text>
      {userInfo?.plaidToken ? (
        <View>
          <Text>Bank</Text>
        </View>
      ) : (
        <View className="w-full">
          <PlaidLogin api={api} />
        </View>
      )}
    </View>
  );
}

export default FinanceScreen;
