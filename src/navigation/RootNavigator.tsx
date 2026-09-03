import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { TopicScreen } from '../screens/TopicScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { LessonResultScreen } from '../screens/LessonResultScreen';
import type { TopicId } from '../content/types';

export type RootStackParamList = {
  MainTabs: undefined;
  Topic: { topicId: TopicId };
  Lesson: { lessonId: string };
  LessonResult: {
    lessonId: string;
    correct: number;
    total: number;
    xpEarned: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Topic" component={TopicScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen
          name="LessonResult"
          component={LessonResultScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
