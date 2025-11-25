import { View, Text, Button } from 'react-native';
import Navbar from 'components/ui/Navbar';
function HomePage({ navigation }) {
  return (
    <View className="flex-1">
      <Text>Home</Text>
      <View className="absolute bottom-0">
        <Navbar />
      </View>
    </View>
  );
}
export default HomePage;
