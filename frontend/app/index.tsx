import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../utils/theme';

export default function Index() {
  const router = useRouter();
  const { onboardingComplete, loading } = useApp();
  const theme = useTheme();

  useEffect(() => {
    if (!loading) {
      if (onboardingComplete) {
        router.replace('/(tabs)/today');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [loading, onboardingComplete]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});