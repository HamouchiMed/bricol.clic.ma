import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainScreen from './screens/MainScreen';
import ProviderDetailScreen from './screens/ProviderDetailScreen';
import CategoryResultsScreen from './screens/CategoryResultsScreen';
import VerificationScreen from './screens/VerificationScreen';
import ProviderVerificationScreen from './screens/ProviderVerificationScreen';
import AppGuideScreen from './screens/AppGuideScreen';
import MissionDetailScreen from './screens/MissionDetailScreen';
import AllServicesScreen from './screens/AllServicesScreen';
import MyInterventionsScreen from './screens/MyInterventionsScreen';
import FavoriteProvidersScreen from './screens/FavoriteProvidersScreen';
import SettingsScreen from './screens/SettingsScreen';
import MyServicesScreen from './screens/MyServicesScreen';
import PrestataireDashboard from './screens/PrestataireDashboard';
import MissionsHistoryScreen from './screens/MissionsHistoryScreen';
import ProviderProfileScreen from './screens/ProviderProfileScreen';
import FinancialDashboard from './screens/FinancialDashboard';
import CustomDrawerContent from './screens/CustomDrawerContent';
import PrestataireDrawerContent from './screens/PrestataireDrawerContent';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function PrestataireDrawerNavigator() {
  return (
    <Drawer.Navigator 
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <PrestataireDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={PrestataireDashboard} 
        options={{ title: 'Tableau de bord' }}
      />
      <Drawer.Screen 
        name="Profil" 
        component={ProviderProfileScreen} 
        options={{ title: 'Mon Profil' }}
      />
    </Drawer.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Accueil" 
        component={MainScreen} 
        options={{ title: 'Accueil' }}
      />
      <Drawer.Screen 
        name="Mon profil" 
        component={SettingsScreen} 
        options={{ title: 'Mon profil' }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Dashboard" component={DrawerNavigator} />
          <Stack.Screen name="PrestataireDashboard" component={PrestataireDrawerNavigator} />
          <Stack.Screen name="AllServices" component={AllServicesScreen} />
          <Stack.Screen name="ProviderDetail" component={ProviderDetailScreen} />
          <Stack.Screen name="CategoryResults" component={CategoryResultsScreen} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="ProviderVerification" component={ProviderVerificationScreen} />
          <Stack.Screen name="AppGuide" component={AppGuideScreen} />
          <Stack.Screen name="MissionDetail" component={MissionDetailScreen} />
          <Stack.Screen name="AllMissions" component={MissionsHistoryScreen} />
          <Stack.Screen name="FinancialDashboard" component={FinancialDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
