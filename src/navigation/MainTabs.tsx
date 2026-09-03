import React from 'react';
import { Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LearnScreen } from '../screens/LearnScreen';
import { QuestsScreen } from '../screens/QuestsScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

export type MainTabParamList = {
  Learn: undefined;
  Quests: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Learn: '📚',
  Quests: '🎯',
  Account: '👤',
};

export function MainTabs() {
  const { scale, isTablet } = useResponsive();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: isTablet ? 70 : 58,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 1,
              shadowRadius: 6,
            },
            android: { elevation: 8 },
            default: {},
          }),
        },
        tabBarLabelStyle: { fontSize: rs(12, scale), fontWeight: '700' },
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: rs(20, scale), color }}>{TAB_ICONS[route.name as keyof MainTabParamList]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Quests" component={QuestsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
