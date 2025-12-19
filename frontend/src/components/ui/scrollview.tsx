import { View, Text } from 'react-native';
import { CalendarList, Calendar } from 'react-native-calendars';
import { useColorScheme } from 'react-native';
import ViewsButton from 'components/ui/viewsButton';

function ScrollView() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const calendarTheme = {
    backgroundColor: isDark ? '#200524' : '#FFFFFF',
    calendarBackground: isDark ? '#200524' : '#FFFFFF',
    textSectionTitleColor: isDark ? '#F6DBFA' : '#754ABF',
    selectedDayBackgroundColor: isDark ? '#A77ED6' : '#F6DBFA',
    selectedDayTextColor: '#F6DBFA',
    todayTextColor: isDark ? '#E89B6E' : '#D48354',
    dayTextColor: isDark ? '#F6DBFA' : '#200524',
    textDisabledColor: isDark ? '#6B4A7A' : '#C4A8D4',
    monthTextColor: isDark ? '#F6DBFA' : '#200524',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
  };

  return (
    <View>
      <CalendarList
        className=""
        enableSwipeMonths={true}
        theme={calendarTheme}
        todayBottomMargin
        //current={new Date().toISOString().slice(0, 7)}
      ></CalendarList>
    </View>
  );
}
export default ScrollView;
