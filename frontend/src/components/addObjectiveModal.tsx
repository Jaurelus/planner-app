import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components/ui';
import Button from 'components/ui/button';
import { View } from 'lucide-react-native';

interface AddObjectiveModalProps {
  visbility: boolean;
  changeVisbility: React.Dispatch<React.SetStateAction<any>>;
}
function AddObjectiveModal({ visbility, changeVisbility }: AddObjectiveModalProps) {
  return (
    <AlertDialog open={visbility}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="color-black">Add Objective?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Button
              onPress={() => {
                changeVisbility(false);
              }}>
              Cancel
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddObjectiveModal;
