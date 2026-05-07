import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Phone, 
  CircleUser,
  Hammer,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { checkBackendHealth } from '../api';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f0f4f8',
  text: '#0f172a',
  textLight: '#64748b',
  danger: '#ef4444',
  white: '#ffffff',
  accent: '#fbbf24',
  lightBlue: '#dbeafe',
  borderLight: '#e2e8f0',
};

const LoginScreen = ({ navigation }) => {
  const [role, setRole] = useState('client');
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loginMethod === 'email' && (!email || !password)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    if (loginMethod === 'phone' && (!phone || !password)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    try {
      const credentials = loginMethod === 'email' ? { email, password } : { phone, password };
      const data = await api.login(credentials);
      
      await api.saveToken(data.token);
      
      if (data.user.role === 'client') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'PrestataireDashboard' }],
        });
      }
    } catch (e) {
      Alert.alert('Erreur', e.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    Alert.alert('Social Login', `Connecting with ${platform}...`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Hammer size={40} color={COLORS.white} />
            </View>
            <Text style={styles.appName}>Bricol.<Text style={styles.appNameAccent}>clic</Text></Text>
            <Text style={styles.tagline}>L'expert à portée de clic</Text>
          </View>

          {/* Card Container */}
          <View style={styles.card}>
            {/* Role Switcher */}
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

            {/* Form section */}
            <View style={styles.formContainer}>
              {loginMethod === 'email' ? (
                <View style={styles.inputWrapper}>
                  <Mail size={22} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              ) : (
                <View style={styles.inputWrapper}>
                  <Phone size={22} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Numéro de téléphone"
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              )}

              <View style={styles.inputWrapper}>
                <Lock size={22} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  placeholderTextColor={COLORS.textLight}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? (
                    <Eye size={22} color={COLORS.primary} />
                  ) : (
                    <EyeOff size={22} color={COLORS.textLight} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Text>
                {!loading && <ArrowRight size={20} color={COLORS.white} />}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Ou continuer avec</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => setLoginMethod(loginMethod === 'email' ? 'phone' : 'email')}
              >
                {loginMethod === 'email' ? (
                  <>
                    <Phone size={24} color={COLORS.primary} />
                    <Text style={styles.socialButtonText}>Téléphone</Text>
                  </>
                ) : (
                  <>
                    <Mail size={24} color={COLORS.primary} />
                    <Text style={styles.socialButtonText}>Email</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.registerText}> Inscrivez-vous</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  appNameAccent: {
    color: COLORS.primary,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
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
    marginBottom: 32,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    transition: 'all 0.3s ease',
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
    color: COLORS.textLight,
  },
  roleTabTextActive: {
    color: COLORS.primary,
  },
  formContainer: {
    marginBottom: 28,
    gap: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 64,
    transition: 'all 0.3s ease',
  },
  inputIcon: {
    marginRight: 14,
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
  loginButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 12,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.borderLight,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderRadius: 14,
    height: 60,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
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
  registerText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;