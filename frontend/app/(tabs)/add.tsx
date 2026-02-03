import React, { useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme';

// This redirects to add-medication modal when Add tab is pressed
export default function AddRedirect() {
  const router = useRouter();
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      // Redirect to add-medication modal
      const timer = setTimeout(() => {
        router.push('/add-medication');
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

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