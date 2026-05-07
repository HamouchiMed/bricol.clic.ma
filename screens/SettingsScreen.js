import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, ChevronLeft, Save, Edit2 } from 'lucide-react-native';
import api from '../api';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  border: '#e2e8f0',
};

export default function SettingsScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ nom: '', email: '', phone: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await api.getToken();
      if (token) {
        const data = await api.getClientProfile(token);
        setProfile(data);
        setFormData({ nom: data.nom || '', email: data.email || '', phone: data.phone || '' });
      }
    } catch (err) {
      console.log('Error fetching client profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nom || !formData.email) {
      Alert.alert('Erreur', 'Le nom et l\'email sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      const token = await api.getToken();
      await api.updateClientProfile(token, formData);
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      Alert.alert('Succès', 'Votre profil a été mis à jour.');
    } catch (err) {
      console.log('Error updating profile:', err);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon profil</Text>
        <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
          {saving ? <ActivityIndicator size="small" color={COLORS.primary} /> : 
           isEditing ? <Save size={24} color={COLORS.primary} /> : <Edit2 size={24} color={COLORS.primary} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.nom ? profile.nom.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <User size={20} color={COLORS.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nom complet</Text>
              {isEditing ? (
                <TextInput style={styles.input} value={formData.nom} onChangeText={(t) => setFormData({...formData, nom: t})} placeholder="Votre nom" />
              ) : (
                <Text style={styles.infoValue}>{profile?.nom || 'Non renseigné'}</Text>
              )}
            </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Mail size={20} color={COLORS.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Adresse email</Text>
              {isEditing ? (
                <TextInput style={styles.input} value={formData.email} onChangeText={(t) => setFormData({...formData, email: t})} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" />
              ) : (
                <Text style={styles.infoValue}>{profile?.email || 'Non renseignée'}</Text>
              )}
            </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Phone size={20} color={COLORS.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Numéro de téléphone</Text>
              {isEditing ? (
                <TextInput style={styles.input} value={formData.phone} onChangeText={(t) => setFormData({...formData, phone: t})} placeholder="06XXXXXXXX" keyboardType="phone-pad" />
              ) : (
                <Text style={styles.infoValue}>{profile?.phone || 'Non renseigné'}</Text>
              )}
            </View>
          </View>
        </View>

        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary },
  backButton: { padding: 4, marginLeft: -4 },
  content: { padding: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: COLORS.white, shadowColor: COLORS.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  avatarText: { fontSize: 36, fontWeight: '700', color: COLORS.primary },
  infoCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, shadowColor: COLORS.secondary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { marginRight: 16 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 13, color: COLORS.textLight, marginBottom: 4 },
  infoValue: { fontSize: 16, color: COLORS.text, fontWeight: '500' },
  input: { fontSize: 16, color: COLORS.text, borderBottomWidth: 1, borderBottomColor: COLORS.primary, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  editButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  editButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' }
});
