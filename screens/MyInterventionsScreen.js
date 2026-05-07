import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Phone, 
  MessageSquare,
  Calendar
} from 'lucide-react-native';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

const INTERVENTIONS = [
  {
    id: '1',
    service: 'Plomberie',
    provider: 'Ahmed B.',
    date: 'Aujourd\'hui, 14:30',
    status: 'en_route',
    price: 'Sur devis',
    address: 'Sidi Maârouf, Casablanca',
  },
  {
    id: '2',
    service: 'Électricité',
    provider: 'Youssef M.',
    date: 'Demain, 10:00',
    status: 'planifié',
    price: '250 MAD',
    address: 'Bouskoura, Casablanca',
  },
  {
    id: '3',
    service: 'Peinture',
    provider: 'Hassan K.',
    date: '25 Avril 2026',
    status: 'terminé',
    price: '1500 MAD',
    address: 'Maarif, Casablanca',
  },
  {
    id: '4',
    service: 'Ménage',
    provider: 'Fatima Z.',
    date: '20 Avril 2026',
    status: 'annulé',
    price: '300 MAD',
    address: 'Anfa, Casablanca',
  },
];

const StatusBadge = ({ status }) => {
  const configs = {
    en_route: { label: 'En route', color: COLORS.warning, icon: <Clock size={14} color={COLORS.warning} /> },
    planifié: { label: 'Planifié', color: COLORS.info, icon: <Calendar size={14} color={COLORS.info} /> },
    terminé: { label: 'Terminé', color: COLORS.success, icon: <CheckCircle2 size={14} color={COLORS.success} /> },
    annulé: { label: 'Annulé', color: COLORS.danger, icon: <AlertCircle size={14} color={COLORS.danger} /> },
  };

  const config = configs[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.color + '15' }]}>
      {config.icon}
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

export default function MyInterventionsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('en_cours');

  const filteredData = INTERVENTIONS.filter(item => {
    if (activeTab === 'en_cours') return item.status === 'en_route' || item.status === 'planifié';
    return item.status === 'terminé' || item.status === 'annulé';
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Interventions</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'en_cours' && styles.activeTab]}
          onPress={() => setActiveTab('en_cours')}
        >
          <Text style={[styles.tabText, activeTab === 'en_cours' && styles.activeTabText]}>En cours</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'historique' && styles.activeTab]}
          onPress={() => setActiveTab('historique')}
        >
          <Text style={[styles.tabText, activeTab === 'historique' && styles.activeTabText]}>Historique</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.serviceText}>{item.service}</Text>
                <Text style={styles.providerText}>avec {item.provider}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <Calendar size={16} color={COLORS.textLight} />
                <Text style={styles.infoText}>{item.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <MapPin size={16} color={COLORS.textLight} />
                <Text style={styles.infoText} numberOfLines={1}>{item.address}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.priceText}>{item.price}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.iconAction}>
                  <MessageSquare size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconAction}>
                  <Phone size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune intervention trouvée.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  providerText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.background,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
});