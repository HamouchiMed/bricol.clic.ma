import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Wallet, TrendingUp, Clock, ArrowRight } from 'lucide-react-native';
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

export default function FinancialDashboard({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data);
      
      // Calculate total balance from transactions
      const total = data.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
      setBalance(total);
    } catch (err) {
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gains et Paiements</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Main Balance */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Solde total</Text>
              <Text style={styles.balanceValue}>{balance.toLocaleString()} MAD</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <TrendingUp size={24} color={COLORS.success} />
                <Text style={styles.statLabel}>Cette semaine</Text>
                <Text style={styles.statValue}>0 MAD</Text>
              </View>
              <View style={styles.statCard}>
                <Clock size={24} color={COLORS.primary} />
                <Text style={styles.statLabel}>En attente</Text>
                <Text style={styles.statValue}>0 MAD</Text>
              </View>
            </View>

            {/* Recent Transactions */}
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <View style={styles.transactionsContainer}>
              {transactions.length > 0 ? (
                transactions.map(tx => (
                  <View key={tx.id} style={styles.txRow}>
                    <View style={styles.txIcon}>
                      <Wallet size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.txAmount}>+{tx.amount} MAD</Text>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: COLORS.textLight, padding: 20 }}>
                  Aucune transaction récente
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.secondary },
  scrollContent: { padding: 24 },
  balanceCard: { backgroundColor: COLORS.secondary, padding: 30, borderRadius: 24, alignItems: 'center', marginBottom: 24 },
  balanceLabel: { color: COLORS.textLight, fontSize: 16 },
  balanceValue: { color: COLORS.white, fontSize: 36, fontWeight: '800', marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: COLORS.white, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  statLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 8 },
  statValue: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 16 },
  transactionsContainer: { backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1, marginLeft: 16 },
  txTitle: { fontSize: 15, fontWeight: '600', color: COLORS.secondary },
  txDate: { fontSize: 12, color: COLORS.textLight },
  txAmount: { fontSize: 15, fontWeight: '700', color: COLORS.success },
});
