import { View, Text } from 'react-native';
import PlaidLogin from './plaidlogin';

function FinanceScreen({ route }) {
  const { api } = route.params;

  return (
    <View className="flex flex-1 items-center justify-center">
      <Text>Coming Soon</Text>
    </View>
  );
}

export default FinanceScreen;
