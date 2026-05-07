import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoriteProvidersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Prestataires Favoris</Text>
      <Text style={styles.text}>Retrouvez vos experts préférés ici.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  text: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 10,
  },
});
