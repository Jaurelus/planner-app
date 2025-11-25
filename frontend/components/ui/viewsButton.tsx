import { View } from 'react-native';
import Button from './button';
import { Eye } from 'lucide-react-native';

function ViewsButton() {
  const changeViews = () => {};

  return (
    <View>
      <Button variant="ghost">
        <Eye />
      </Button>
    </View>
  );
}
export default ViewsButton;
