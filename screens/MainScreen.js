import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Search, Wrench, Zap, Droplet, Paintbrush, Home, Star, MapPin, Menu, ArrowRight, Bell, Scissors, Snowflake, Flower2, Monitor, CalendarDays, Lamp, Grid3X3 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import api from '../api';

const COLORS = {
  primary: '#2563eb', // Professional blue
  secondary: '#1e293b', // Slate blue/dark
  background: '#f8fafc',
  text: '#0f172a',
  textLight: '#64748b',
  white: '#ffffff',
  accent: '#fbbf24', // Amber
  gray: '#e2e8f0',
};

const CATEGORIES = [
  { id: '0', name: 'Tous', icon: <Grid3X3 size={24} color={COLORS.primary} /> },
  { id: '1', name: 'Plombier', icon: <Droplet size={24} color={COLORS.primary} /> },
  { id: '2', name: 'Électricité', icon: <Zap size={24} color={COLORS.primary} /> },
  { id: '3', name: 'Coiffeur', icon: <Scissors size={24} color={COLORS.primary} /> },
  { id: '4', name: 'Climatisation', icon: <Snowflake size={24} color={COLORS.primary} /> },
  { id: '5', name: 'Jardinage', icon: <Flower2 size={24} color={COLORS.primary} /> },
  { id: '6', name: 'Peintre', icon: <Paintbrush size={24} color={COLORS.primary} /> },
  { id: '7', name: 'Informatique', icon: <Monitor size={24} color={COLORS.primary} /> },
  { id: '8', name: 'Organisation événements', icon: <CalendarDays size={24} color={COLORS.primary} /> },
  { id: '9', name: 'Lampes', icon: <Lamp size={24} color={COLORS.primary} /> },
  { id: '10', name: 'Mécanique', icon: <Wrench size={24} color={COLORS.primary} /> },
  { id: '11', name: 'Ménage', icon: <Home size={24} color={COLORS.primary} /> },
];

export default function MainScreen({ navigation }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeMissions, setActiveMissions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchProviders();
    }, [])
  );

  const fetchProviders = async () => {
    try {
      const data = await api.getPrestataires();
      const formatted = data.map(p => ({
        ...p,
        profession: p.metier,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 100),
        distance: (Math.random() * 5).toFixed(1) + ' km'
      }));
      setProviders(formatted);
      
      const token = await api.getToken();
      if (token) {
        try {
          const missionsData = await api.getClientMissions(token);
          // Show all missions, including Terminé
          setActiveMissions(missionsData);
        } catch (mErr) {
          console.log('Error fetching active missions:', mErr);
        }
      }
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProviders();
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Menu size={28} color={COLORS.secondary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Verification')}>
              <BlurView intensity={60} tint="light" style={[styles.verifyButton, { backgroundColor: 'rgba(37, 99, 235, 0.7)' }]}>
                <Star size={16} color={COLORS.white} />
                <Text style={styles.verifyButtonText}>Vérifier votre identité</Text>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bellButton}
              onPress={() => navigation.navigate('CategoryResults', { isSearch: true, searchQuery: '', categoryName: 'Recherche' })}
            >
              <Search size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.title}>De quel service avez-vous besoin ?</Text>
          </View>
        </View>


        {/* Active Missions */}
        {activeMissions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vos Réservations</Text>
            {activeMissions.map((mission, index) => (
              <View key={mission.id ? `${mission.source || 'item'}-${mission.id}-${index}` : `idx-${index}`} style={styles.activeMissionCard}>
                <View style={styles.activeMissionHeader}>
                  <Text style={styles.activeMissionTitle}>{mission.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: mission.status === 'Terminé' ? '#10b981' : (mission.status === 'En route' ? '#3b82f6' : '#fbbf24') }]}>
                    <Text style={styles.statusText}>{mission.status}</Text>
                  </View>
                </View>
                <Text style={styles.activeMissionProvider}>Prestataire: {mission.provider_name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Catégories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllServices')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.id ? `${item.source || 'item'}-${item.id}-${index}` : `idx-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => navigation.navigate('CategoryResults', { categoryName: item.name })}
              >
                <View style={styles.categoryIconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Featured Providers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prestataires recommandés</Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : (
            providers.map((provider, index) => (
              <TouchableOpacity
                key={provider.id ? `${provider.source || 'item'}-${provider.id}-${index}` : `idx-${index}`}
                style={styles.providerCard}
                onPress={() => navigation.navigate('ProviderDetail', { provider })}
              >
                <View style={styles.providerAvatar}>
                  <Text style={styles.providerInitials}>{(provider.nom || '?').charAt(0)}</Text>
                </View>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.nom}</Text>
                  <Text style={styles.providerProfession}>{provider.profession}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuButton: {
    padding: 4,
  },
  bellButton: {
    padding: 4,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    overflow: 'hidden',
  },
  verifyButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  titleContainer: {
    marginTop: 8,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
    marginTop: -20,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: 32,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    color: COLORS.textLight,
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryName: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeMissionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderLeftWidth: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activeMissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeMissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  activeMissionProvider: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  providerInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  providerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  providerProfession: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  providerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 4,
  },
});
