import { View, Text, TextInput } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import Button from './ui/button';
import { useState } from 'react';

function EditGoal() {
  const [gTitle, setGTitle] = useState('');
  const [gDesc, setGDesc] = useState('');

  const editUserGoal = async () => {
    const API_URL = 'http://localhost:3000/api/goals';
    try {
    } catch (error) {}
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
        <Button onPress={editUserGoal}>Save</Button>
      </CardContent>
    </Card>
  );
}

export default EditGoal;
