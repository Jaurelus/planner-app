import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import Button from './button';

function Goals() {
  const [goals, setGoals] = useState([]);

  const showGoals = async () => {
    const API_URL = 'http://localhost:3000/api/goals';

    try {
      const response = await fetch(API_URL, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
      if (response.status == 200) {
        const data = await response.json();
        setGoals(data.goals);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showGoals();
  }, []);

  return (
    <View className="">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-center">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.map((goal) => (
            //
            <Card className="mb-5 flex-col">
              <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>{goal.description}</Text>
              </CardContent>
            </Card>
          ))}
          <Button>Create Goal</Button>
        </CardContent>
      </Card>
    </View>
  );
}

export default Goals;
