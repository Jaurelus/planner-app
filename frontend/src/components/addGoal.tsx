import { View, Text, TextInput } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import Button from './ui/button';
import { useState } from 'react';

function AddGoal() {
  const [gTitle, setGTitle] = useState('');
  const [gDesc, setGDesc] = useState('');

  const saveNewGoal = async () => {
    const API_URL = 'http://localhost:3000/api/goals';

    try {
      const payload = {
        goalTitle: gTitle,
        goalDescription: gDesc,
      };
      console.log(payload.goalTitle);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status == 201) {
        setGTitle('');
        setGDesc('');
        console.log('Goal Saved');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className=" w-[75%] flex-grow justify-center p-5">
      <CardHeader>
        <CardTitle className="text-center color-primary">Add New Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <TextInput
          className="mb-5 rounded-xl border border-primary p-1 text-center"
          value={gTitle}
          onChangeText={setGTitle}></TextInput>
        <TextInput
          value={gDesc}
          onChangeText={setGDesc}
          multiline
          scrollEnabled={false}
          className="w-100 mb-5 h-64 rounded-xl border border-primary p-2 text-center"></TextInput>
        <Button onPress={saveNewGoal}>Save</Button>
      </CardContent>
    </Card>
  );
}

export default AddGoal;
