import { View, Text } from 'react-native';
import PlaidLogin from './plaidlogin';

function FinanceScreen({ route }) {
  const { api } = route.params;

  return (
    <View className="flex flex-1">
      <Text>Finance</Text>
      <PlaidLogin api={api}></PlaidLogin>
    </View>
  );
}

export default FinanceScreen;
