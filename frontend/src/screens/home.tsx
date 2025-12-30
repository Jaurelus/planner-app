import { View, Text } from 'react-native';
import Navbar from '../components/ui/Navbar';

function HomePage({ navigation }) {
  return (
    <View className="flex flex-1 justify-between">
      <Text>Home</Text>
      <View className="bottom-0 flex w-full">
        <Navbar />
      </View>
    </View>
  );
}
export default HomePage;
