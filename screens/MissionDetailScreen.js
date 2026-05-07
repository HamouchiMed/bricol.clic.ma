import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, User, Clock, CheckCircle2, Phone, MessageSquare } from 'lucide-react-native';
import api from '../api';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
};

export default function MissionDetailScreen({ navigation, route }) {
  const mission = route.params?.mission || {
    id: null,
    title: 'Réparation Plomberie',
    client: 'Client par défaut',
    address: 'Non spécifié',
    time: 'Non spécifié',
    description: 'Aucune description disponible.',
    status: 'En attente'
  };
  const [missionStatus, setMissionStatus] = useState(mission.status || 'En attente');

  const updateStatus = async (status) => {
    try {
      if (mission.id) {
        await api.updateMissionStatus(mission.id, status);
      }
      setMissionStatus(status);
      Alert.alert('Succès', `Statut mis à jour : ${status}`);
    } catch (err) {
      console.log('Error updating status:', err);
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut.');
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = mission.phone || mission.client_phone;
    if (phoneNumber) {
      // Clean the phone number (remove spaces, ensure country code)
      let formattedPhone = phoneNumber.replace(/\s+/g, '');
      // If it starts with 0 (like 06), we could assume Morocco (+212)
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+212' + formattedPhone.substring(1);
      }
      Linking.openURL(`whatsapp://send?phone=${formattedPhone}&text=Bonjour, je vous contacte concernant la mission: ${mission.title}`).catch(() => {
        Alert.alert('Erreur', 'WhatsApp ne semble pas être installé sur votre appareil.');
      });
    } else {
      Alert.alert('Erreur', 'Numéro de téléphone non disponible.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la mission</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{mission.title}</Text>
          <View style={styles.statusContainer}>
             <Text style={styles.statusLabel}>Statut actuel : </Text>
             <Text style={styles.statusValue}>{missionStatus}</Text>
          </View>
          <View style={styles.infoRow}>
            <User size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Client: {mission.client || mission.client_name} {mission.phone || mission.client_phone ? `\nTel: ${mission.phone || mission.client_phone}` : ''}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{mission.address}</Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Mettre à jour le statut</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => updateStatus('En route')}>
            <Text style={styles.primaryButtonText}>Je suis en route</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.successButton} onPress={() => updateStatus('Terminé')}>
            <CheckCircle2 size={20} color={COLORS.white} />
            <Text style={styles.successButtonText}>Terminer la mission</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton} onPress={openWhatsApp}>
          <MessageSquare size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.secondary },
  scrollContent: { padding: 24 },
  card: { backgroundColor: COLORS.white, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.secondary, marginBottom: 16 },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  statusLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textLight },
  statusValue: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  infoText: { fontSize: 16, color: COLORS.secondary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.secondary, marginTop: 16, marginBottom: 8 },
  description: { fontSize: 15, color: COLORS.textLight, lineHeight: 22 },
  actionSection: { gap: 12 },
  primaryButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  successButton: { flexDirection: 'row', backgroundColor: COLORS.success, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10 },
  successButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-around', padding: 24, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.white },
  iconButton: { padding: 16, backgroundColor: COLORS.background, borderRadius: 12 },
});
