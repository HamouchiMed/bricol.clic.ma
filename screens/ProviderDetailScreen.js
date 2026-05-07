import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Share2,
} from 'lucide-react-native';
import api from '../api';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  accent: '#fbbf24',
  success: '#10b981',
  border: '#e2e8f0',
};

export default function ProviderDetailScreen({ navigation, route }) {
  const { provider } = route.params;
  
  // Use data from provider or defaults if not present
  const displayProvider = {
    name: provider.nom || provider.name || 'Prestataire',
    profession: provider.profession || provider.metier || 'Expert',
    rating: provider.rating || 4.5,
    reviews: provider.reviews || 0,
    completedJobs: provider.completedJobs || Math.floor(Math.random() * 500),
    experience: provider.experience || 'Plusieurs années',
    location: provider.location || 'Marrakech',
    bio: provider.bio || 'Professionnel qualifié disponible pour vos travaux de bricolage et rénovation.',
    services: provider.services || [
      'Installation et maintenance',
      'Dépannage rapide',
      'Consultation',
    ],
    price: provider.price || '150 MAD',
    phone: provider.telephone || ''
  };

  const handleWhatsApp = () => {
    const phone = displayProvider.phone.replace(/[^0-9]/g, ''); 
    const url = `whatsapp://send?phone=${phone}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'WhatsApp n\'est pas installé sur votre appareil.');
    });
  };

  const handleBook = async () => {
    try {
      const token = await api.getToken();
      if (!token) {
        Alert.alert('Erreur', 'Veuillez vous connecter pour réserver.');
        return;
      }
      
      // Fetch current user info or decode token if possible.
      // Since token format is ambiguous, let's fetch client ID by user_id
      // For now, let's assume we can get user data or infer ID
      // Given the previous fix, let's search for client_id associated with current user
      
      // Temporary patch: assume we can get userId from somewhere. 
      // If not, we might need a profile endpoint.
      
      // Assuming for now user's ID is the last part as a fallback, 
      // but let's try to make it robust by fetching current user profile
      const clientData = await api.getClientProfile(token);
      const clientId = clientData.id;

      if (!clientId) {
         Alert.alert('Erreur', 'Impossible de trouver votre profil client.');
         return;
      }
      
      const providerId = provider.id;
      if (!providerId) {
        Alert.alert('Erreur', 'Prestataire invalide.');
        return;
      }
      
      await api.createMission(clientId, providerId, `Mission avec ${displayProvider.name}`);
      Alert.alert('Succès', 'Votre demande de mission a été envoyée.');
    } catch (err) {
      console.error('Error creating mission:', err);
      Alert.alert('Erreur', 'Impossible de créer la mission: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Image Area */}
        <View style={styles.headerImageContainer}>
          <View style={styles.placeholderImage}>
             <Text style={styles.placeholderInitial}>{displayProvider.name.charAt(0)}</Text>
          </View>
          
          <SafeAreaView style={styles.headerActions}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleButton}>
              <ChevronLeft size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content Area */}
        <View style={styles.contentCard}>
          <View style={styles.mainInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{displayProvider.name}</Text>
              <ShieldCheck size={24} color={COLORS.success} fill={COLORS.success + '20'} />
            </View>
            <Text style={styles.profession}>{displayProvider.profession}</Text>
            
            {displayProvider.phone && (
              <View style={styles.phoneRow}>
                <Phone size={16} color={COLORS.primary} />
                <Text style={styles.phoneText}>{displayProvider.phone}</Text>
              </View>
            )}
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.bioText}>{displayProvider.bio}</Text>
          </View>

          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services proposés</Text>
            <View style={styles.servicesGrid}>
              {displayProvider.services.map((service, index) => (
                <View key={index} style={styles.serviceTag}>
                  <CheckCircle2 size={16} color={COLORS.primary} />
                  <Text style={styles.serviceTagText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
          <MessageSquare size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Réserver maintenant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerImageContainer: {
    height: 250,
    width: '100%',
    backgroundColor: '#dbeafe',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderInitial: {
    fontSize: 80,
    fontWeight: '800',
    color: COLORS.primary,
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  mainInfo: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  profession: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  phoneText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 16,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textLight,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  serviceTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.secondary,
  },
  portfolioScroll: {
    marginLeft: -24,
    paddingLeft: 24,
  },
  portfolioItem: {
    marginRight: 16,
  },
  portfolioPlaceholder: {
    width: 150,
    height: 100,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioText: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    height: 56,
    width: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
