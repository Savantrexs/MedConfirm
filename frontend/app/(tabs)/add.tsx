import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme';

// This is a redirect screen - tapping the Add tab navigates to the modal
export default function AddRedirect() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // Navigate to add-medication modal
    router.push('/add-medication');
    
    // After a short delay, go back to today tab
    const timer = setTimeout(() => {
      router.replace('/(tabs)/today');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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