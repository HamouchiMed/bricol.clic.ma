import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, MapPin, SlidersHorizontal, Search } from 'lucide-react-native';
import api from '../api';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  accent: '#fbbf24',
  border: '#e2e8f0',
};

export default function CategoryResultsScreen({ navigation, route }) {
  const { categoryName, isSearch, searchQuery: initialSearchQuery } = route.params || {};
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery || '');

  useEffect(() => {
    fetchProviders();
  }, [categoryName, isSearch, initialSearchQuery]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      let data;
      if (isSearch && initialSearchQuery) {
        data = await api.search(initialSearchQuery);
      } else {
        data = await api.getPrestatairesByMetier(categoryName);
      }
      const formatted = data.map(p => ({
        ...p,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 100),
        distance: (Math.random() * 5).toFixed(1) + ' km',
        price: (100 + Math.floor(Math.random() * 400)) + ' MAD'
      }));
      setProviders(formatted);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalSearch = () => {
    if (localSearchQuery.trim().length > 0) {
      navigation.setParams({ 
        isSearch: true, 
        searchQuery: localSearchQuery.trim(), 
        categoryName: 'Recherche' 
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           <Text style={styles.headerTitle}>{isSearch ? 'Résultats de recherche' : categoryName}</Text>
           <Text style={styles.headerSubtitle}>{providers.length} prestataires trouvés</Text>
        </View>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.filterRow}>
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textLight} />
          <TextInput 
            placeholder="Rechercher..." 
            style={styles.searchInput}
            placeholderTextColor={COLORS.textLight}
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            onSubmitEditing={handleLocalSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {/* Results List */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={providers}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('ProviderDetail', { provider: { ...item, profession: item.metier || categoryName } })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.nom ? item.nom.charAt(0) : '?'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nom}</Text>
                <View style={styles.ratingRow}>
                  <Star size={14} color={COLORS.accent} fill={COLORS.accent} />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)} ({item.reviews} avis)</Text>
                </View>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color={COLORS.textLight} />
                    <Text style={styles.metaText}>{item.distance}</Text>
                  </View>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: COLORS.textLight }}>
                {isSearch ? 'Aucun prestataire trouvé pour cette recherche.' : 'Aucun prestataire trouvé pour cette catégorie.'}
              </Text>
            </View>
          }
        />
      )}
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
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
