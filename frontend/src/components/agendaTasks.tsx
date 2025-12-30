import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Agenda } from 'react-native-calendars';
import { todayString } from 'react-native-calendars/src/expandableCalendar/commons';

function AgendaTasks() {
  let today = new Date();
  console.log(today.toISOString().slice(0, 10));
  const [agendaDates, setAgendaDates] = useState<string[]>([]);
  const [agendaData, setAgendaData] = useState([]);

  //Get all the dates of this week
  const testLoad = [
    {
      name: 'Jay',
      height: 21,
      day: '2025-12-28',
    },
    {
      name: 'Kay',
      age: 13,
    },
  ];

  const getWeekDates = () => {
    let sundayDate = today.getDate() - today.getDay();
    let array = [];
    let Sunday = new Date(today.getFullYear(), today.getMonth(), sundayDate);
    let tmpDay = Sunday;
    for (let i = 0; i < 7; i++) {
      array.push(tmpDay.toISOString().slice(0, 10));
      tmpDay.setDate(tmpDay.getDate() + 1);
    }
    setAgendaDates(array);
  };
  useEffect(() => {
    getWeekDates();
  }, []);

  //Agenda strucyure mapping
  const agendaItems = agendaDates.reduce(
    (curr, header: string, index: number) => {
      if (testLoad[index]) {
        curr[header] = [testLoad[index]];
      } else {
        curr[header] = [];
      }
      return curr;
    },
    {} as Record<string, any>
  );
  console.log(agendaItems);
  today.toISOString().slice(0, 10);
  console.log(agendaItems.name);

  //---------- API Calls -----------

  // Function to get task data

  return (
    <View className="flex flex-1">
      <Agenda
        items={agendaItems}
        renderItem={(item) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
        scrollEnabled={true}></Agenda>
    </View>
  );
}

export default AgendaTasks;
