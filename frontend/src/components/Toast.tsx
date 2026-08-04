import { createContext, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

/**
 * Tiny error toast. Wrap the app once in <ToastProvider>, then call
 * `const showError = useToast()` and `showError('message')` in any catch/else.
 */
const ToastContext = createContext<(message: string) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <ToastContext.Provider value={setMessage}>
      {children}
      {message && (
        <View
          className="absolute bottom-24 left-6 right-6 rounded-xl bg-red-600 px-4 py-3"
          style={{ zIndex: 999, elevation: 10 }}>
          <Text className="text-center text-white">{message}</Text>
        </View>
      )}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
