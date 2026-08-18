import Button from 'components/ui/button';
import { Modal, Text, TextInput, View, Pressable } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';
import RemindSelect from './RemindSelect';
import { Select } from 'components/Select';

// Exported so EditModal offers exactly the same nine classifications
export const TASK_CATEGORIES = [
  { choiceNum: 1, option: 'Physical' },
  { choiceNum: 2, option: 'Mental(School)' },
  { choiceNum: 3, option: 'Intellecutal(Personal)' },
  { choiceNum: 4, option: 'Creative' },
  { choiceNum: 5, option: 'Social' },
  { choiceNum: 6, option: 'Daily Living/Chore' },
  { choiceNum: 7, option: 'Recreation/Hobby' },
  { choiceNum: 8, option: 'Work/Occupation' },
  { choiceNum: 9, option: 'Misc' },
];

interface AddModalProps {
  module: string;
  mode?: 'add' | 'edit';
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: () => Promise<void>;
  // Parent-owned form state. Keys match the backend payload keys.
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}
function AddModal({
  module,
  mode = 'add',
  visibility,
  setVisibility,
  onClick,
  values,
  onChange,
}: AddModalProps) {
  // Which date picker is open. UI-only, so it stays local.
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const showDate = (value: any, withTime: boolean) => {
    if (!value) return 'Select';
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return 'Select';
    return withTime ? d.toLocaleString() : d.toLocaleDateString();
  };

  // Pressable box + spinner, reused by the date/datetime fields below
  const DateField = ({
    field,
    label,
    withTime = false,
  }: {
    field: string;
    label: string;
    withTime?: boolean;
  }) => (
    <View className="gap-1">
      <Text className="ml-1 text-xs font-medium text-slate-600">{label}</Text>
      <Pressable onPress={() => setOpenPicker(openPicker === field ? null : field)}>
        <View className="rounded-xl border border-[#d1bcea] bg-white p-2">
          <Text className="text-center">{showDate(values[field], withTime)}</Text>
        </View>
      </Pressable>
      {openPicker === field && (
        <DateTimePicker
          value={values[field] ? new Date(values[field]) : new Date()}
          mode={withTime ? 'datetime' : 'date'}
          display="spinner"
          onChange={(e, selected) => {
            if (selected) onChange(field, selected);
          }}
        />
      )}
    </View>
  );

  return (
    <Modal transparent={true} visible={visibility}>
      <View className="flex flex-1 items-center justify-center bg-black/50">
        <Card className="w-5/6">
          <CardHeader className="-mx-[1] -mt-[22px] flex flex-row justify-between rounded-t-2xl  bg-[#d1bcea] pb-2 pt-4">
            <View className="-mx-4 flex  ">
              <CardTitle className="">
                {mode === 'edit' ? 'Edit' : 'Add'} {module}
              </CardTitle>
            </View>
            <Button
              className="-mr-6 -mt-5 "
              textClassName="text-[#3C0275]"
              variant="ghost"
              onPress={() => {
                setOpenPicker(null);
                setVisibility(false);
              }}>
              X
            </Button>
          </CardHeader>

          {/* objectivesController.addObjective */}
          {module == 'Objective' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Title</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Objective Title"
                  value={values.objectiveTitle ?? ''}
                  onChangeText={(t) => onChange('objectiveTitle', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Description</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Objective Description"
                  multiline={true}
                  value={values.objectiveDescription ?? ''}
                  onChangeText={(t) => onChange('objectiveDescription', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Current Progress</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Current Progress"
                  keyboardType="numeric"
                  value={values.objectiveProgress ?? ''}
                  onChangeText={(t) => onChange('objectiveProgress', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Goal Number</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Goal Number"
                  keyboardType="numeric"
                  value={values.objectiveGoalNumber ?? ''}
                  onChangeText={(t) => onChange('objectiveGoalNumber', t)}
                />
              </View>
            </CardContent>
          )}

          {/* tasksController.addTask */}
          {module == 'Task' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Task Name</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Task Name"
                  value={values.uTaskName ?? ''}
                  onChangeText={(t) => onChange('uTaskName', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Description</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Task Description"
                  multiline={true}
                  value={values.uTaskDesc ?? ''}
                  onChangeText={(t) => onChange('uTaskDesc', t)}
                />
              </View>
              <DateField field="uTaskStart" label="Starts" withTime />
              <DateField field="uTaskEnd" label="Ends" withTime />
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Category</Text>
                {/* Fixed list, so the values match what the edit dialog writes */}
                <Select
                  placeholder={values.uTaskCat || 'Choose a classification for this task'}
                  options={TASK_CATEGORIES}
                  onSelect={(choice) =>
                    onChange('uTaskCat', TASK_CATEGORIES[Number(choice) - 1].option)
                  }
                  labelKey="option"
                  valueKey="choiceNum"
                />
              </View>
              {/* Minutes before start. Backend turns this into remindTime. */}
              <RemindSelect
                value={values.uTaskRemind ?? ''}
                onChange={(v) => onChange('uTaskRemind', v)}
              />
            </CardContent>
          )}

          {/* remindersControllers.createReminder */}
          {module == 'Reminder' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Reminder</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="What should I remind you about?"
                  multiline={true}
                  value={values.reminderDescription ?? ''}
                  onChangeText={(t) => onChange('reminderDescription', t)}
                />
              </View>
              <DateField field="reminderDate" label="When" withTime />
            </CardContent>
          )}

          {/* goalsController.createGoal */}
          {module == 'Goal' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Title</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Goal Title"
                  value={values.goalTitle ?? ''}
                  onChangeText={(t) => onChange('goalTitle', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Description</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Goal Description"
                  multiline={true}
                  value={values.goalDescription ?? ''}
                  onChangeText={(t) => onChange('goalDescription', t)}
                />
              </View>
              <DateField field="goalDate" label="Target Date" />
            </CardContent>
          )}

          {/* dateController.addNewDate */}
          {module == 'Date' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Name</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Name"
                  value={values.newDateName ?? ''}
                  onChangeText={(t) => onChange('newDateName', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Type</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Type (Ex: Birthdays)"
                  value={values.newDateType ?? ''}
                  onChangeText={(t) => onChange('newDateType', t)}
                />
              </View>
              <DateField field="newDateDate" label="Date" />
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-600">Note / Rule</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Note / Rule"
                  multiline={true}
                  value={values.newDateRule ?? ''}
                  onChangeText={(t) => onChange('newDateRule', t)}
                />
              </View>
            </CardContent>
          )}

          <CardFooter className="justify-end">
            <Button
              onPress={() => {
                onClick();
              }}>
              {mode === 'edit' ? 'Save Changes' : `Add ${module}`}
            </Button>
          </CardFooter>
        </Card>
      </View>
    </Modal>
  );
}
export default AddModal;
