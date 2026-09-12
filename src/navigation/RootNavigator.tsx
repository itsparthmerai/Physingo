import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabs, MainTabParamList } from './MainTabs';
import { LessonScreen } from '../screens/LessonScreen';
import { LessonResultScreen } from '../screens/LessonResultScreen';
import { SignInScreen } from '../screens/SignInScreen';

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
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      {/* @react-navigation/stack disables screen-transition animation by default on web unless
          an `animation` preset is explicitly named - these strings resolve to the same tuned
          spring-based TransitionPresets used natively, so this is what makes push/modal
          transitions actually animate in the web build. */}
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="Lesson" component={LessonScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen
          name="LessonResult"
          component={LessonResultScreen}
          options={{ gestureEnabled: false, animation: 'fade' }}
        />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ animation: 'slide_from_bottom' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
