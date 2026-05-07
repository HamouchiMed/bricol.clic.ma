import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Droplet, Zap, Wrench, Paintbrush, Home, ChevronLeft, CalendarDays, Sofa } from 'lucide-react-native';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  gray: '#e2e8f0',
};

const ALL_CATEGORIES = [
  { id: '1', name: 'Plomberie', icon: <Droplet size={24} color={COLORS.primary} /> },
  { id: '2', name: 'Électricité', icon: <Zap size={24} color={COLORS.primary} /> },
  { id: '3', name: 'Carpentry', icon: <Wrench size={24} color={COLORS.primary} /> },
  { id: '4', name: 'Peinture', icon: <Paintbrush size={24} color={COLORS.primary} /> },
  { id: '5', name: 'Ménage', icon: <Home size={24} color={COLORS.primary} /> },
  { id: '6', name: 'Déménagement', icon: <Home size={24} color={COLORS.primary} /> },
  { id: '7', name: 'Jardinage', icon: <Home size={24} color={COLORS.primary} /> },
  { id: '8', name: 'Climatisation', icon: <Zap size={24} color={COLORS.primary} /> },
  { id: '9', name: 'Serrurerie', icon: <Wrench size={24} color={COLORS.primary} /> },
  { id: '10', name: 'Chauffage', icon: <Zap size={24} color={COLORS.primary} /> },
  { id: '11', name: 'Coiffeur', icon: <Home size={24} color={COLORS.primary} /> },
  { id: '12', name: 'Mécanique', icon: <Wrench size={24} color={COLORS.primary} /> },
  { id: '13', name: 'Informatique', icon: <Zap size={24} color={COLORS.primary} /> },
  { id: '14', name: 'Cuisine', icon: <Home size={24} color={COLORS.primary} /> },
  { id: '15', name: 'Décoration', icon: <Paintbrush size={24} color={COLORS.primary} /> },
  { id: '16', name: 'Construction', icon: <Wrench size={24} color={COLORS.primary} /> },
  { id: '17', name: 'Électromécanique', icon: <Wrench size={24} color={COLORS.primary} /> },
  { id: '18', name: 'Organisation des événements', icon: <CalendarDays size={24} color={COLORS.primary} /> },
  { id: '19', name: 'Tapissier / mobilier', icon: <Sofa size={24} color={COLORS.primary} /> },
];

export default function AllServicesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Tous les services</Text>
      </View>
      <FlatList
        data={ALL_CATEGORIES}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('CategoryResults', { categoryName: item.name })}
          >
            <View style={styles.iconContainer}>{item.icon}</View>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    margin: 8,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  iconContainer: {
    marginBottom: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
});
