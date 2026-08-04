import Button from 'components/ui/button';
import { Modal, Text, TextInput, View, Pressable } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';

interface EditModalProps {
  module: string;
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: () => Promise<void>;
  // Parent-owned form state, pre-filled from the record being edited.
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  // Optional line under the title, e.g. the name of the item being edited
  context?: string;
}
function EditModal({
  module,
  visibility,
  setVisibility,
  onClick,
  values,
  onChange,
  context,
}: EditModalProps) {
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
      <Text className="ml-1 text-xs font-medium text-slate-500">{label}</Text>
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
              <CardTitle className="">Edit {module}</CardTitle>
              {context ? <Text className="color-primary">{context}</Text> : null}
            </View>
            <Button
              className="-mr-6 -mt-5 "
              textClassName="color-primary"
              variant="ghost"
              onPress={() => {
                setOpenPicker(null);
                setVisibility(false);
              }}>
              X
            </Button>
          </CardHeader>

          {/* objectivesController.editObjective */}
          {module == 'Objective' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Title</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Objective Title"
                  value={values.objectiveTitle ?? ''}
                  onChangeText={(t) => onChange('objectiveTitle', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Description</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Objective Description"
                  multiline={true}
                  value={values.objectiveDescription ?? ''}
                  onChangeText={(t) => onChange('objectiveDescription', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Current Progress</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Current Progress"
                  keyboardType="numeric"
                  value={values.objectiveProgress ?? ''}
                  onChangeText={(t) => onChange('objectiveProgress', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Goal Number</Text>
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

          {/* tasksController.editTask */}
          {module == 'Task' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Task Name</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Task Name"
                  value={values.uTaskName ?? ''}
                  onChangeText={(t) => onChange('uTaskName', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Description</Text>
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
                <Text className="ml-1 text-xs font-medium text-slate-500">Category</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Category"
                  value={values.uTaskCat ?? ''}
                  onChangeText={(t) => onChange('uTaskCat', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">
                  Remind me (minutes before)
                </Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="e.g. 15 — leave blank for none"
                  keyboardType="numeric"
                  value={values.uTaskRemind ?? ''}
                  onChangeText={(t) => onChange('uTaskRemind', t)}
                />
              </View>
            </CardContent>
          )}

          {/* goalsController.editGoal */}
          {module == 'Goal' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Title</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Goal Title"
                  value={values.goalTitle ?? ''}
                  onChangeText={(t) => onChange('goalTitle', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Description</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Goal Description"
                  multiline={true}
                  value={values.goalDescription ?? ''}
                  onChangeText={(t) => onChange('goalDescription', t)}
                />
              </View>
            </CardContent>
          )}

          {/* dateController.editDate */}
          {module == 'Date' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Name</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Name"
                  value={values.dateName ?? ''}
                  onChangeText={(t) => onChange('dateName', t)}
                />
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Note / Rule</Text>
                <TextInput
                  className="rounded-xl border border-[#d1bcea] bg-white p-1 text-center"
                  placeholder="Note / Rule"
                  multiline={true}
                  value={values.dateRule ?? ''}
                  onChangeText={(t) => onChange('dateRule', t)}
                />
              </View>
            </CardContent>
          )}

          {/* remindersControllers.editReminder */}
          {module == 'Reminder' && (
            <CardContent className="mt-2 gap-5">
              <View className="gap-1">
                <Text className="ml-1 text-xs font-medium text-slate-500">Reminder</Text>
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

          <CardFooter className="justify-end gap-3">
            <Button
              variant="outline"
              onPress={() => {
                setOpenPicker(null);
                setVisibility(false);
              }}>
              <Text className="color-black">Cancel</Text>
            </Button>
            <Button
              onPress={() => {
                onClick();
              }}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </View>
    </Modal>
  );
}
export default EditModal;
