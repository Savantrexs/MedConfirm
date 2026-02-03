import React, { useEffect, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme';

// This redirects to add-medication when Add tab is pressed, then goes back to Today
export default function AddRedirect() {
  const router = useRouter();
  const theme = useTheme();
  const [hasRedirected, setHasRedirected] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Only redirect once when this screen is focused
      if (!hasRedirected) {
        setHasRedirected(true);
        const timer = setTimeout(() => {
          router.push('/add-medication');
          // After opening the modal, go back to Today tab
          setTimeout(() => {
            router.replace('/(tabs)/today');
          }, 100);
        }, 50);

        return () => clearTimeout(timer);
      }
      return () => {};
    }, [hasRedirected])
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