import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, MapPin, CheckCircle2, Clock } from 'lucide-react-native';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  textLight: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
};

const ALL_MISSIONS = [
  { id: '1', service: 'Réparation fuite évier', client: 'Ahmed B.', date: '04 Mai 2026', address: 'Sidi Maârouf', status: 'En cours' },
  { id: '2', service: 'Installation robinetterie', client: 'Youssef S.', date: '02 Mai 2026', address: 'Maarif', status: 'Terminé' },
  { id: '3', service: 'Débouchage canalisations', client: 'Karim T.', date: '30 Avril 2026', address: 'Anfa', status: 'Terminé' },
  { id: '4', service: 'Réparation chauffe-eau', client: 'Fatima Z.', date: '28 Avril 2026', address: 'Bouskoura', status: 'Terminé' },
  { id: '5', service: 'Installation salle de bain', client: 'Omar D.', date: '20 Avril 2026', address: 'Gauthier', status: 'Terminé' },
  { id: '6', service: 'Dépannage plomberie', client: 'Salma K.', date: '05 Mai 2026', address: 'Zerktouni', status: 'En cours' },
];

export default function MissionsHistoryScreen({ navigation, route }) {
  const initialTab = route.params?.initialTab || 'en_cours';
  const [activeTab, setActiveTab] = useState(initialTab);

  const filteredMissions = ALL_MISSIONS.filter(m => 
    activeTab === 'en_cours' ? m.status === 'En cours' : m.status === 'Terminé'
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Missions</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'en_cours' && styles.activeTab]}
          onPress={() => setActiveTab('en_cours')}
        >
          <Text style={[styles.tabText, activeTab === 'en_cours' && styles.activeTabText]}>En cours</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'termine' && styles.activeTab]}
          onPress={() => setActiveTab('termine')}
        >
          <Text style={[styles.tabText, activeTab === 'termine' && styles.activeTabText]}>Terminé</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMissions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('MissionDetail')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.clientInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.client.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.serviceText}>{item.service}</Text>
                  <Text style={styles.clientName}>Client: {item.client}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, item.status === 'Terminé' ? styles.statusBadgeDone : styles.statusBadgePending]}>
                <Text style={[styles.statusText, item.status === 'Terminé' ? styles.statusTextDone : styles.statusTextPending]}>
                  {item.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.footerRow}>
               <View style={styles.locationContainer}>
                <MapPin size={14} color={COLORS.textLight} />
                <Text style={styles.infoText}>{item.address}</Text>
              </View>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.secondary },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 20 },
  tab: { paddingVertical: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 15, fontWeight: '600', color: COLORS.textLight },
  activeTabText: { color: COLORS.primary },
  list: { padding: 24 },
  card: { 
    backgroundColor: COLORS.white, 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 0,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  serviceText: { fontSize: 16, fontWeight: '800', color: COLORS.secondary, flex: 1, marginRight: 10 },
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
  clientName: { fontSize: 13, color: COLORS.textLight, marginTop: 2, fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  statusBadgePending: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  statusBadgeDone: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  statusText: { fontSize: 12, fontWeight: '700' },
  statusTextPending: { color: '#b45309' },
  statusTextDone: { color: COLORS.success },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: COLORS.secondary, fontWeight: '500' },
  dateText: { fontSize: 12, color: COLORS.textLight, fontStyle: 'italic' },
});
