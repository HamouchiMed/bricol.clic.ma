import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  textLight: '#64748b',
  border: '#e2e8f0',
};

const INITIAL_SERVICES = [
  { id: '1', name: 'Plomberie', enabled: true },
  { id: '2', name: 'Électricité', enabled: true },
  { id: '3', name: 'Carpentry', enabled: false },
  { id: '4', name: 'Peinture', enabled: true },
  { id: '5', name: 'Ménage', enabled: false },
];

export default function MyServicesScreen({ navigation }) {
  const [services, setServices] = useState(INITIAL_SERVICES);

  const toggleService = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Services</Text>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item, index) => item.id ? `${item.source || 'item'}-${item.id}-${index}` : `idx-${index}`}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleService(item.id)}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
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
  list: { padding: 24 },
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  serviceName: { fontSize: 16, fontWeight: '600', color: COLORS.secondary },
});
