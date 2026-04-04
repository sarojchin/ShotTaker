import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.onBackground,
        headerTitleStyle: {
          ...Typography.labelLg,
          color: Colors.onBackground,
        },
        tabBarStyle: {
          backgroundColor: Colors.surfaceElevated,
          borderTopWidth: 0,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
          elevation: 0,
          shadowColor: Colors.onSurface,
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.04,
          shadowRadius: 40,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          ...Typography.labelSm,
          fontSize: 10,
          letterSpacing: 0.8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'TODAY',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sunny-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'CHALLENGES',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="aperture-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'LEADERS',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
