import React from 'react';
import type { ComponentType } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TopicScreen } from '../screens/TopicScreen';
import type { TopicId } from '../content/types';

/**
 * Shared per-tab stack shape: a tab's home screen plus the Topic (subject) screen.
 * Nesting Topic inside a tab's own stack keeps the bottom tab bar visible while
 * viewing a subject, while Lesson/LessonResult stay on the root stack above the
 * tabs entirely, so the tab bar is hidden there.
 */
export type TopicStackParamList = {
  Home: undefined;
  Topic: { topicId: TopicId };
};

const Stack = createNativeStackNavigator<TopicStackParamList>();

export function createTopicStack(HomeComponent: ComponentType<any>) {
  return function TopicStackNavigator() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Home" component={HomeComponent} />
        <Stack.Screen name="Topic" component={TopicScreen} />
      </Stack.Navigator>
    );
  };
}
