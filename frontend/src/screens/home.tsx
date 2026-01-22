import { View, Text, Image } from 'react-native';
import Navbar from '../components/ui/Navbar';

function HomePage({ navigation }) {
  return (
    <View className="flex flex-1">
      <View className="flex flex-1 items-center">
        <Image
          style={{ width: 200, height: 200 }}
          className="h-[200px] w-[200px]"
          source={require('../../assets/transparent-logo.png')}></Image>
        <Text>Home</Text>
      </View>
      <View className="flex w-full">
        <Navbar />
      </View>
    </View>
  );
}
export default HomePage;
