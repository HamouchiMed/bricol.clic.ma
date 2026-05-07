import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LogOut, Briefcase, DollarSign, Settings } from 'lucide-react-native';
import api from '../api';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  text: '#ffffff',
  textLight: '#cbd5e1',
};

export default function PrestataireDrawerContent(props) {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await api.getToken();
        if (token) {
          const userId = token.split('-')[2];
          const data = await api.getProviderProfile(userId);
          setProvider(data);
        }
      } catch (err) {
        console.log('Error fetching drawer profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <User size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{provider?.nom || 'Prestataire Pro'}</Text>
          <Text style={styles.userEmail}>{provider?.email || 'pro@bricol.clic'}</Text>
        </View>

        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 80, paddingBottom: 40, paddingHorizontal: 20, backgroundColor: COLORS.secondary, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { color: COLORS.text, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  userEmail: { color: COLORS.textLight, fontSize: 14 },
  drawerItems: { marginTop: 10, paddingHorizontal: 10 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, width: '100%' },
  logoutText: { marginLeft: 15, fontSize: 16, color: '#ef4444', fontWeight: '600' },
});
