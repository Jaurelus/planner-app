import * as SecureStore from 'expo-secure-store';

export const getToken = async () => {
  return await SecureStore.getItemAsync('token');
};
export const getUserInfo = async () => {
  return await SecureStore.getItemAsync('userInfo');
};
