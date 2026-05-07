import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Phone, MapPin, Mail, Save, Edit3, ShieldCheck } from 'lucide-react-native';

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

export default function ProviderProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ahmed B.',
    phone: '06 00 00 00 00',
    email: 'ahmed.plombier@bricol.clic',
    address: 'Sidi Maârouf, Casablanca',
    bio: 'Plombier expert avec plus de 8 ans d\'expérience dans le domaine de la rénovation sanitaire et dépannage urgent.',
  });

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Succès', 'Profil mis à jour avec succès.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save size={24} color={COLORS.primary} /> : <Edit3 size={24} color={COLORS.secondary} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <User size={50} color={COLORS.primary} />
          </View>
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={16} color={COLORS.success} />
            <Text style={styles.verifiedText}>Vérifié</Text>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput 
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={profile.name}
              onChangeText={(text) => setProfile({...profile, name: text})}
              editable={isEditing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput 
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={profile.phone}
              onChangeText={(text) => setProfile({...profile, phone: text})}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput 
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={profile.email}
              onChangeText={(text) => setProfile({...profile, email: text})}
              editable={isEditing}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Adresse</Text>
            <TextInput 
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={profile.address}
              onChangeText={(text) => setProfile({...profile, address: text})}
              editable={isEditing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            <TextInput 
              style={[styles.input, styles.textArea, !isEditing && styles.disabledInput]}
              value={profile.bio}
              onChangeText={(text) => setProfile({...profile, bio: text})}
              editable={isEditing}
              multiline
            />
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.secondary },
  scrollContent: { padding: 24 },
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, gap: 4 },
  verifiedText: { color: COLORS.success, fontSize: 12, fontWeight: '700' },
  form: { gap: 16 },
  field: { gap: 8 },
  label: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
  input: { backgroundColor: COLORS.white, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, fontSize: 16 },
  disabledInput: { backgroundColor: '#f1f5f9', color: COLORS.textLight },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { marginTop: 24, backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
