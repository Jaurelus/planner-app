import WeeklyView from '@/components/weeklyView';
import MonthlyView from '@/components/monthlyView';
import { View, Text } from 'react-native';
import ScrollView from '@/components/ui/scrollview';
import { useState } from 'react';
import Button from '@/components/ui/button';
import { Eye } from 'lucide-react-native';
import { CalendarProvider } from 'react-native-calendars';

function CalendarScreen({ navigation }) {
  const [scrollVisibility, setScrollVisiblity] = useState(true);
  const [weeklyVisibility, setWeeklyVisbility] = useState(false);
  const [monthlyVisibility, setMonthlyVisibility] = useState(false);
  const [counter, setCounter] = useState(0);

  const handleView = () => {
    const newCounter = (counter + 1) % 3;
    setCounter(newCounter);

    //Cycle through visibilisty
    if (newCounter == 0) {
      setScrollVisiblity(true);
      setWeeklyVisbility(false);
      setMonthlyVisibility(false);
    }
    if (newCounter == 1) {
      setScrollVisiblity(false);
      setWeeklyVisbility(true);
      setMonthlyVisibility(false);
    }
    if (newCounter == 2) {
      setScrollVisiblity(false);
      setWeeklyVisbility(false);
      setMonthlyVisibility(true);
    }
  };

  const prepareDate = () => {
    return (
      new Date().getFullYear() +
      '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '-' +
      String(new Date().getDate()).padStart(2, '0')
    );
  };

  return (
    <CalendarProvider date={prepareDate()}>
      <View className="flex flex-1">
        <Button variant="ghost" onPress={handleView} className=" h-20">
          <Eye />
        </Button>
        {scrollVisibility && (
          <View className="">
            <ScrollView />
          </View>
        )}
        {weeklyVisibility && (
          <View className="top-0 mt-0">
            <WeeklyView></WeeklyView>
          </View>
        )}
        {monthlyVisibility && (
          <View className="">
            <MonthlyView></MonthlyView>
          </View>
        )}
      </View>
    </CalendarProvider>
  );
}
export default CalendarScreen;
