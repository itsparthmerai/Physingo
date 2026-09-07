import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs, MainTabParamList } from './MainTabs';
import { LessonScreen } from '../screens/LessonScreen';
import { LessonResultScreen } from '../screens/LessonResultScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Lesson: { lessonId: string };
  LessonResult: {
    lessonId: string;
    correct: number;
    total: number;
    xpEarned: number;
  };
  SignIn: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: 'fade' }} />
        <Stack.Screen
          name="Lesson"
          component={LessonScreen}
          options={{ animation: 'slide_from_bottom', animationDuration: 320 }}
        />
        <Stack.Screen
          name="LessonResult"
          component={LessonResultScreen}
          options={{ gestureEnabled: false, animation: 'fade', animationDuration: 260 }}
        />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
