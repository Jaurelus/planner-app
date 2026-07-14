import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import Button from '@/../components/ui/button';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';

function SignoutCard({ api, onLogout }: { api: string; onLogout: () => void }) {
  const [userToken, setUserToken] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigator = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
    console.log(userInfo);
  }, []);
  const logoutUser = async () => {
    console.log('Log out function');
    const response = await fetch(api + 'api/user/logout', {
      headers: { AuthToken: userToken },
      method: 'POST',
    });
    //Destroy token
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('userInfo');
    setUserInfo(false);
    setUserToken(false);
    console.log('User Info cleared');
    onLogout();
    console.log('Redirect');
    //Navigate to login screen
    navigator.navigate('Login');
  };
  return (
    <Card className="mb-4 flex w-[75%] p-1">
      <CardContent>
        <Button
          variant="ghost"
          onPress={() => {
            logoutUser();
          }}>
          <Text style={{ color: '#ef4444' }}>Sign Out</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
export default SignoutCard;
