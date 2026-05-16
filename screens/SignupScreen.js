import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Phone, ArrowRight, Hammer, ChevronLeft, Eye, EyeOff, Wrench, ChevronDown } from 'lucide-react-native';
import api from '../api';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f0f4f8',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  border: '#e2e8f0',
  lightBlue: '#dbeafe',
  borderLight: '#e2e8f0',
};

export default function SignupScreen({ navigation }) {
  const [role, setRole] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [showMetiers, setShowMetiers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    metier: '',
  });

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || (role === 'provider' && !formData.metier)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        metier: formData.metier,
        role: role
      };
      console.log('Sending signup payload:', payload);
      const data = await api.signup(payload);
      
      await api.saveToken(data.token);
      
      if (role === 'client') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ 
            name: 'ProviderVerification',
            params: { providerData: payload }
          }],
        });
      }
    } catch (e) {
      console.error('Signup error:', e);
      Alert.alert('Erreur', e.message || 'L\'inscription a échoué. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={28} color={COLORS.secondary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Hammer size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez Bricol.clic dès maintenant</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.roleSwitcher}>
              <TouchableOpacity
                style={[styles.roleTab, role === 'client' && styles.roleTabActive]}
                onPress={() => setRole('client')}
              >
                <Text style={[styles.roleTabText, role === 'client' && styles.roleTabTextActive]}>Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleTab, role === 'provider' && styles.roleTabActive]}
                onPress={() => setRole('provider')}
              >
                <Text style={[styles.roleTabText, role === 'provider' && styles.roleTabTextActive]}>Prestataire</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <User size={22} color={COLORS.primary} style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Nom complet" 
                  placeholderTextColor={COLORS.textLight}
                  value={formData.name} 
                  onChangeText={(t) => setFormData({...formData, name: t})} 
                />
              </View>
              <View style={styles.inputWrapper}>
                <Mail size={22} color={COLORS.primary} style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Adresse e-mail" 
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                  value={formData.email} 
                  onChangeText={(t) => setFormData({...formData, email: t})} 
                />
              </View>
              <View style={styles.inputWrapper}>
                <Phone size={22} color={COLORS.primary} style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Téléphone" 
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="phone-pad" 
                  value={formData.phone} 
                  onChangeText={(t) => setFormData({...formData, phone: t})} 
                />
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={22} color={COLORS.primary} style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Mot de passe" 
                  placeholderTextColor={COLORS.textLight}
                  secureTextEntry={!showPassword} 
                  value={formData.password} 
                  onChangeText={(t) => setFormData({...formData, password: t})} 
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? (
                    <Eye size={22} color={COLORS.primary} />
                  ) : (
                    <EyeOff size={22} color={COLORS.textLight} />
                  )}
                </TouchableOpacity>
              </View>

              {role === 'provider' && (
                <View style={styles.metierDropdownContainer}>
                  <TouchableOpacity 
                    style={styles.inputWrapper} 
                    onPress={() => setShowMetiers(true)}
                  >
                    <Wrench size={22} color={COLORS.primary} style={styles.icon} />
                    <Text style={[styles.input, !formData.metier && {color: COLORS.textLight}]}>
                      {formData.metier || 'Sélectionnez votre métier'}
                    </Text>
                    <ChevronDown size={22} color={COLORS.textLight} />
                  </TouchableOpacity>
                  
                  <Modal
                    visible={showMetiers}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowMetiers(false)}
                    style={{ zIndex: 9999, elevation: 9999 }}
                  >
                    <TouchableOpacity 
                      style={styles.modalOverlay} 
                      activeOpacity={1} 
                      onPress={() => setShowMetiers(false)}
                    >
                      <View style={styles.dropdownList}>
                        <ScrollView style={{maxHeight: 400}}>
                          {categories.map((cat, idx) => (
                            <TouchableOpacity
                              key={`${cat}-${idx}`}
                              style={styles.dropdownItem}
                              onPress={() => {
                                setFormData({ ...formData, metier: cat });
                                setShowMetiers(false);
                              }}
                            >
                              <Text style={styles.dropdownItemText}>{cat}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.signupButton, loading && styles.signupButtonDisabled]} 
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.signupButtonText}>
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </Text>
              {!loading && <ArrowRight size={20} color={COLORS.white} />}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}> Connectez-vous</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  container: { 
    flex: 1 
  },
  scrollContent: { 
    padding: 20,
    paddingTop: 12,
    flexGrow: 1,
  },
  backButton: { 
    marginBottom: 20,
    padding: 8,
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 28,
  },
  logoContainer: { 
    backgroundColor: COLORS.lightBlue, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 16,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: COLORS.secondary, 
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: { 
    fontSize: 14, 
    color: COLORS.textLight,
    fontWeight: '500',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  roleSwitcher: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.borderLight, 
    borderRadius: 14, 
    padding: 6, 
    marginBottom: 24 
  },
  roleTab: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 10 
  },
  roleTabActive: { 
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  roleTabText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: COLORS.textLight 
  },
  roleTabTextActive: { 
    color: COLORS.primary 
  },
  form: { 
    gap: 16, 
    marginBottom: 28 
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.lightBlue, 
    borderRadius: 14, 
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 18, 
    height: 60 
  },
  icon: { 
    marginRight: 14 
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: COLORS.text,
    fontWeight: '500',
  },
  signupButton: { 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    height: 60, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: { 
    color: COLORS.white, 
    fontSize: 16, 
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
  loginText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  metierDropdownContainer: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownList: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 8,
    maxHeight: 400,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
