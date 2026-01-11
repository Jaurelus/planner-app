import { View, Text } from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';

function Personal({ navigation }) {
  return (
    <CalendarProvider date={new Date().toISOString().slice(0, 10)}>
      <ExpandableCalendar
        closeOnDayPress
        firstDay={1}
        markingType="custom"
        markedDates={{}}
        horizontal
        pagingEnabled
      />

      <View></View>
    </CalendarProvider>
  );
}

export default Personal;
