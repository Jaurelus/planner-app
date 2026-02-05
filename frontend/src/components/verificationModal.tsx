import Button from 'components/ui/button';
import { Modal, Text, View } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui';

function VerificationModal({ verifyEM }: any) {
  return (
    <Modal visible={verifyEM}>
      <View className="flex flex-1 items-center">
        <View className="flex flex-1 items-center justify-center">
          <Card className="items-center px-5">
            <CardHeader>
              <CardTitle>Verify your account</CardTitle>
            </CardHeader>
            <CardContent className="gap-2">
              <Text>Verification code will be sent to email</Text>
              <Button>Send Code</Button>
            </CardContent>
            <CardFooter className="mt-4 flex-col gap-3">
              <Text className="text-sm">Want to use your phone number instead?</Text>
              <Button>Press Here</Button>
            </CardFooter>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

export default VerificationModal;
