import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthBootstrap } from './src/store/useAuthStore';
import { useProgressCloudSync } from './src/store/useProgressSync';

export default function App() {
  useAuthBootstrap();
  useProgressCloudSync();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
