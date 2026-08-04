import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from 'components/ui';
import Button from 'components/ui/button';
import { Modal, Text, View } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';
interface DeleteModalProps {
  module: string;
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: () => Promise<void>;
  context: string;
}
function DeleteModal({ module, visibility, setVisibility, onClick, context }: DeleteModalProps) {
  return (
    <Modal transparent={true} visible={visibility}>
      <View className="flex flex-1 items-center justify-center bg-black/50">
        <Card className="w-5/6">
          <CardHeader className="-mx-[1] -mt-[22px] flex flex-row justify-between rounded-t-2xl  bg-[#d1bcea] pb-2 pt-4">
            <View className="-mx-4 flex  ">
              <CardTitle className="">Delete {module}</CardTitle>
              <Text className="color-primary">This is permanent and cannot be undone</Text>
            </View>
            <Button
              className="-mr-6 -mt-5 "
              textClassName="color-primary"
              variant="ghost"
              onPress={() => {
                setVisibility(false);
              }}>
              X
            </Button>
          </CardHeader>
          <CardContent className="mt-2 gap-5">
            <Text> Are you sure that you want to delete this {module.toLowerCase()}: </Text>
            <Text className="font-semibold">{context}</Text>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              variant="destructive"
              onPress={() => {
                onClick();
              }}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      </View>
    </Modal>
  );
}
export default DeleteModal;
