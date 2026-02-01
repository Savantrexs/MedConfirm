import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '../contexts/AppContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
        <Stack.Screen name="add-medication" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
      </Stack>
    </AppProvider>
  );
}