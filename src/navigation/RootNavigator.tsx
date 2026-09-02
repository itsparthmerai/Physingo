import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { LessonResultScreen } from '../screens/LessonResultScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  Lesson: { lessonId: string };
  LessonResult: {
    lessonId: string;
    correct: number;
    total: number;
    xpEarned: number;
  };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen
          name="LessonResult"
          component={LessonResultScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
