import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PrivacyGateScreen } from './src/screens/PrivacyGateScreen';
import { useAuthBootstrap } from './src/store/useAuthStore';
import { useProgressCloudSync } from './src/store/useProgressSync';
import { useLegalStore } from './src/store/useLegalStore';
import { colors } from './src/theme/colors';

export default function App() {
  useAuthBootstrap();
  useProgressCloudSync();
  const hasHydrated = useLegalStore((s) => s.hasHydrated);
  const hasAcceptedPrivacyPolicy = useLegalStore((s) => s.hasAcceptedPrivacyPolicy);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {!hasHydrated ? (
        <View style={{ flex: 1, backgroundColor: colors.background }} />
      ) : !hasAcceptedPrivacyPolicy ? (
        <PrivacyGateScreen />
      ) : (
        <RootNavigator />
      )}
    </SafeAreaProvider>
  );
}
