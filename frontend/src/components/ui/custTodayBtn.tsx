import { View } from 'react-native';

import Button from './button';

function CustTdyBtn({ onPress }: { onPress: () => void }) {
  return (
    <View>
      <Button onPress={onPress}>This Week</Button>
    </View>
  );
}

export default CustTdyBtn;
