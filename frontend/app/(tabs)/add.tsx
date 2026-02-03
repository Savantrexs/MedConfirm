import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme';

// This redirects to add-medication when Add tab is pressed
export default function AddRedirect() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // Small delay to let the tab switch animation complete
    const timer = setTimeout(() => {
      router.push('/add-medication');
    }, 50);

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