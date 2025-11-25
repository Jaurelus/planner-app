import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '@/screens/home';
import Personal from '@/screens/personal';
import Daily from '@/screens/today';
import CalendarScreen from '@/components/ui/scrollview';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <View className="flex flex-1">
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Personal" component={Personal} />
          <Stack.Screen name="Today" component={Daily} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
