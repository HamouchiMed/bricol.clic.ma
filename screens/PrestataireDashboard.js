import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Menu, Bell, CheckCircle2, TrendingUp, User, MapPin } from 'lucide-react-native';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  border: '#e2e8f0',
};

export default function PrestataireDashboard({ navigation }) {
  const [provider, setProvider] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProviderData();
    }, [])
  );

  const fetchProviderData = async () => {
    try {
      const token = await api.getToken();
      if (!token) throw new Error('No token found');
      
      const userId = token.split('-')[2];
      console.log('Fetching provider for user ID:', userId);

      const data = await api.getProviderProfile(userId);
      setProvider(data);
      
      // Fetch missions
      const missionsData = await api.getProviderMissions(data.id);
      setMissions(missionsData);
    } catch (err) {
      console.error('Error fetching provider profile:', err);
      Alert.alert('Erreur', 'Impossible de charger votre profil.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{flex: 1}} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Menu size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Mon Tableau de Bord</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.scrollContent}>
        <Text style={styles.welcomeText}>Bonjour, <Text style={{fontWeight: 'bold'}}>{provider?.nom || 'Prestataire'}</Text></Text>
        <Text style={styles.professionText}>{provider?.metier || 'Professionnel'}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{missions.length}</Text>
            <Text style={styles.statLabel}>Missions</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle2 size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{missions.filter(m => m.status === 'Terminé').length}</Text>
            <Text style={styles.statLabel}>Terminées</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Missions en cours</Text>
        
        <FlatList
          data={missions}
          keyExtractor={(item, index) => item.id ? `mission-${item.source || 'default'}-${item.id}-${index}` : `mission-idx-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.jobCard} onPress={() => navigation.navigate('MissionDetail', { mission: item })}>
              <View style={styles.cardHeader}>
                <View style={styles.clientInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.client_name ? item.client_name.charAt(0) : '?'}</Text>
                  </View>
                  <View>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    <Text style={styles.clientName}>Client: {item.client_name || 'N/A'}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Terminé' ? '#10b981' : (item.status === 'En route' ? '#3b82f6' : '#fbbf24') }]}>
                  <Text style={[styles.statusText, { color: COLORS.white }]}>
                    {item.status || 'En attente'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: COLORS.textLight, marginTop: 20 }}>
              Aucune mission pour le moment.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 24, 
    marginTop: -20 
  },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.secondary },
  welcomeText: { fontSize: 18, color: COLORS.secondary, marginBottom: 20, paddingHorizontal: 24 },
  scrollContent: { paddingHorizontal: 24, flex: 1 },
  list: { paddingBottom: 24 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.white, padding: 20, borderRadius: 16, alignItems: 'center', marginHorizontal: 8, borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 24, fontWeight: '800', color: COLORS.secondary, marginVertical: 8 },
  statLabel: { fontSize: 12, color: COLORS.textLight },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 16, paddingHorizontal: 24 },
  professionText: { fontSize: 16, color: COLORS.primary, fontWeight: '500', marginBottom: 20, paddingHorizontal: 24, marginTop: -15 },
  jobCard: { 
    backgroundColor: COLORS.white, 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clientInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: COLORS.primary + '15', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  jobTitle: { fontSize: 16, fontWeight: '800', color: COLORS.secondary },
  clientName: { fontSize: 13, color: COLORS.textLight, marginTop: 2, fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 0 },
  statusText: { fontSize: 12, fontWeight: '700' },
});
