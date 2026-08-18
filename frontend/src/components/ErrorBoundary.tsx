import React from 'react';
import { Text, View } from 'react-native';
import Button from 'components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time crashes. Without this, any thrown error unmounts the
 * whole tree and leaves a blank white screen with no way back.
 *
 * Has to be a class -- there is no hooks equivalent of componentDidCatch.
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log('App crash:', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View className="flex flex-1 items-center justify-center gap-4 px-8">
        <Text className="text-center text-lg font-semibold">Something went wrong</Text>
        <Text className="text-center text-sm text-slate-500">
          The app hit an unexpected error. Tap below to try again.
        </Text>
        <Button onPress={() => this.setState({ hasError: false })}>Try Again</Button>
      </View>
    );
  }
}

export default ErrorBoundary;
