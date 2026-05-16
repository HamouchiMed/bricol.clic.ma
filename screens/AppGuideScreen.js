import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, CheckCircle2, ArrowRight } from 'lucide-react-native';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
};

export default function AppGuideScreen({ navigation }) {
  const steps = [
    { title: 'Recherchez un service', desc: 'Utilisez la barre de recherche ou les catégories pour trouver l\'expert dont vous avez besoin.', icon: <Search size={32} color={COLORS.primary} /> },
    { title: 'Comparez les experts', desc: 'Consultez les profils, les avis et la distance des prestataires pour faire le meilleur choix.', icon: <MapPin size={32} color={COLORS.primary} /> },
    { title: 'Réservez en un clic', desc: 'Confirmez votre demande et suivez l\'intervention de votre prestataire en temps réel.', icon: <CheckCircle2 size={32} color={COLORS.primary} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Bienvenue sur Bricol.clic</Text>
        <Text style={styles.subtitle}>Voici comment tirer le meilleur parti de votre application :</Text>
        
        {steps.map((step, index) => (
          <View key={step.id ? `${step.source || 'item'}-${step.id}-${index}` : `idx-${index}`} style={styles.stepCard}>
            <View style={styles.iconContainer}>{step.icon}</View>
            <View style={styles.info}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] })}>
          <Text style={styles.buttonText}>Commencer</Text>
          <ArrowRight size={20} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.secondary, marginBottom: 12 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 40 },
  stepCard: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 20, borderRadius: 20, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  iconContainer: { backgroundColor: '#dbeafe', padding: 16, borderRadius: 16, marginRight: 20 },
  info: { flex: 1 },
  stepTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 4 },
  stepDesc: { fontSize: 14, color: COLORS.textLight, lineHeight: 20 },
  button: { backgroundColor: COLORS.primary, height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, gap: 8 },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
