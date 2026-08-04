import { Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Select } from 'components/Select';

// 5, 10, 15 ... 60
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const minutes = (i + 1) * 5;
  return { minutes, label: `${minutes} minutes before` };
});

const DEFAULT_MINUTES = '15';

interface RemindSelectProps {
  // Minutes before start, as a string. '' means no reminder.
  value: string;
  onChange: (value: string) => void;
}

/** Checkbox first -- the minute scroller only appears once it's ticked. */
function RemindSelect({ value, onChange }: RemindSelectProps) {
  const enabled = !!value;

  return (
    <View className="w-full gap-2">
      <BouncyCheckbox
        isChecked={enabled}
        size={20}
        fillColor="#754ABF"
        text="Remind me before this starts"
        textStyle={{ textDecorationLine: 'none', fontSize: 14, color: '#334155' }}
        onPress={(checked: boolean) => onChange(checked ? DEFAULT_MINUTES : '')}
      />
      {enabled && (
        <Select
          placeholder="Choose when to be reminded"
          options={MINUTE_OPTIONS}
          selectedValue={Number(value)}
          onSelect={(selected) => onChange(String(selected))}
          labelKey="label"
          valueKey="minutes"
        />
      )}
    </View>
  );
}

export default RemindSelect;
