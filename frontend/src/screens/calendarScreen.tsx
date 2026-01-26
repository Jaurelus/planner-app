import WeeklyView from '@/components/weeklyView';
import MonthlyView from '@/components/monthlyView';
import { View, Text } from 'react-native';
import ScrollView from '@/components/scrollview';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import { Eye } from 'lucide-react-native';

function CalendarScreen({ route, navigation }) {
  const { api } = route.params;
  const [scrollVisibility, setScrollVisiblity] = useState(true);
  const [weeklyVisibility, setWeeklyVisbility] = useState(false);
  const [monthlyVisibility, setMonthlyVisibility] = useState(false);
  const [counter, setCounter] = useState(0);

  const [viewVar, setViewVar] = useState(0);

  const [date, setSelectedDate] = useState(new Date());
  const [country, setCountry] = useState('US');
  const [holidays, setHolidays] = useState([]);
  const [formattedHolidays, setFormattedHolidays] = useState({});
  useEffect(() => {
    if (viewVar == 1) {
      handleView(1);
      setViewVar(0);
    }
  }, [viewVar]);

  const handleView = (viewVar?: Number) => {
    const newCounter = (counter + 1) % 3;
    setCounter(newCounter);

    if (viewVar == 1) {
      setScrollVisiblity(false);
      setWeeklyVisbility(true);
      setMonthlyVisibility(false);
      setCounter(1);
      return;
    }

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
  //-------- API Call -----------
  const getHolidays = async () => {
    try {
      const response = await fetch(`${api}holidays/${date.getFullYear()}?country=${country}`);
      if (response.status == 200) {
        const data = await response.json();
        setHolidays(data.holidays);

        const reducedHolidays = data.holidays.reduce((acc, currHoliday) => {
          let dateH = currHoliday.date.slice(0, 10);
          acc[dateH] = { marked: true, dotColor: 'red', ...currHoliday };
          return acc;
        }, {});
        setFormattedHolidays(reducedHolidays);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getHolidays();
  }, [date.getFullYear()]);

  return (
    <View className="flex flex-1">
      <Button
        variant="ghost"
        onPress={() => {
          handleView(viewVar);
        }}
        className=" h-20">
        <Eye />
      </Button>
      {scrollVisibility && (
        <View className="">
          <ScrollView
            setDate={setSelectedDate}
            onChange={setViewVar}
            markedDates={formattedHolidays}
          />
        </View>
      )}
      {weeklyVisibility && (
        <View className="top-0 mt-0">
          <WeeklyView api={api} scrollDate={date} markedDates={formattedHolidays}></WeeklyView>
        </View>
      )}
      {monthlyVisibility && (
        <View className="">
          <MonthlyView markedDates={formattedHolidays}></MonthlyView>
        </View>
      )}
    </View>
  );
}
export default CalendarScreen;
