import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  ChevronLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Camera,
  CheckCircle2,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  X,
  Circle,
  Clock,
  ShieldCheck,
  Trash2,
  RefreshCw,
} from 'lucide-react-native';

const COLORS = {
  primary: '#2563eb',
  secondary: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  danger: '#ef4444',
};

export default function ProviderVerificationScreen({ navigation, route }) {
  const { isNewUser, providerData } = route.params || {};
  const [step, setStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState('cin'); 
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nom: providerData?.name?.includes(' ') ? providerData.name.split(' ').slice(1).join(' ') : '',
    prenom: providerData?.name?.includes(' ') ? providerData.name.split(' ')[0] : providerData?.name || '',
    phone: providerData?.phone || '',
    location: '',
    documentUri: null,
    documentType: null,
    selfieUri: null,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setFormData({ ...formData, documentUri: result.assets[0].uri, documentType: 'image' });
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });
    if (!result.canceled) {
      setFormData({ ...formData, documentUri: result.assets[0].uri, documentType: 'pdf' });
    }
  };

  const handleTakePhoto = async (mode = 'cin') => {
    if (!permission || !permission.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        Alert.alert('Permission requise', 'Accès caméra refusé.');
        return;
      }
    }
    setCameraMode(mode);
    setShowCamera(true);
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (step === 3 || cameraMode === 'selfie') {
          setFormData({ ...formData, selfieUri: photo.uri });
          setShowCamera(false);
        } else {
          setShowCamera(false);
          setFormData({ ...formData, documentUri: photo.uri, documentType: 'image' });
          Alert.alert('Succès', 'Document capturé !');
        }
      } catch (e) {
        Alert.alert('Erreur', 'Impossible de capturer la photo');
      }
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.nom || !formData.prenom || !formData.phone || !formData.location)) {
      Alert.alert('Champs requis', 'Veuillez remplir toutes vos informations.');
      return;
    }
    
    if (step === 2 && !formData.documentUri) {
      Alert.alert('Document requis', 'Veuillez télécharger votre document d\'identité.');
      return;
    }

    if (step === 1) {
        setStep(2);
        setCameraMode('cin');
    } else if (step === 2) {
        setStep(3);
        setCameraMode('selfie');
        if (!permission || !permission.granted) {
            requestPermission();
        }
    } else if (step === 3) {
        if (!formData.selfieUri) {
            Alert.alert('Photo requise', 'Veuillez prendre un selfie pour la vérification.');
            return;
        }
        setStep(4);
    }
  };

  const removeDocument = () => {
    setFormData({ ...formData, documentUri: null, documentType: null });
  };

  const retakeSelfie = () => {
    setFormData({ ...formData, selfieUri: null });
  };

  const renderStepIndicator = () => (
    <View style={styles.indicatorContainer}>
      {[1, 2, 3, 4].map((s) => (
        <View key={s} style={styles.stepWrapper}>
          <View
            style={[
              styles.stepCircle,
              step >= s ? styles.stepCircleActive : styles.stepCircleInactive,
            ]}
          >
            {step > s ? (
              <CheckCircle2 size={16} color={COLORS.white} />
            ) : (
              <Text style={[styles.stepNumber, step >= s ? styles.textWhite : styles.textLight]}>
                {s}
              </Text>
            )}
          </View>
          {s < 4 && (
            <View
              style={[
                styles.stepLine,
                step > s ? styles.stepLineActive : styles.stepLineInactive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Informations Personnelles</Text>
      <Text style={styles.stepDescription}>
        Veuillez entrer vos informations exactes telles qu'elles figurent sur votre carte d'identité.
      </Text>

        <View style={styles.inputGroup}>
          <View style={styles.inputWrapper}>
            <User size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={formData.nom}
              onChangeText={(text) => setFormData({ ...formData, nom: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <User size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={formData.prenom}
              onChangeText={(text) => setFormData({ ...formData, prenom: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Phone size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <MapPin size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Adresse exacte (Ville, Quartier)"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
          </View>
        </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Document d'identité</Text>
      <Text style={styles.stepDescription}>
        Téléchargez ou scannez votre CIN (Carte d'identité nationale) ou votre passeport.
      </Text>

      <View style={styles.uploadOptions}>
        <TouchableOpacity style={styles.uploadCardSmall} onPress={() => handleTakePhoto('cin')}>
          <Camera size={32} color={COLORS.primary} />
          <Text style={styles.uploadCardText}>Prendre Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadCardSmall} onPress={pickImage}>
          <ImageIcon size={32} color={COLORS.primary} />
          <Text style={styles.uploadCardText}>Galerie Photo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.documentPicker} onPress={pickDocument}>
        <FileText size={24} color={COLORS.textLight} />
        <Text style={styles.documentPickerText}>Choisir un fichier PDF</Text>
        <Upload size={20} color={COLORS.primary} />
      </TouchableOpacity>

      {formData.documentUri && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Document sélectionné :</Text>
          <View style={styles.previewCard}>
            {formData.documentType === 'image' ? (
              <Image source={{ uri: formData.documentUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.pdfPreview}>
                <FileText size={48} color={COLORS.primary} />
                <Text style={styles.pdfText}>Document PDF</Text>
              </View>
            )}
            <TouchableOpacity style={styles.removeButton} onPress={removeDocument}>
              <Trash2 size={20} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Vérification faciale</Text>
      <Text style={styles.stepDescription}>
        {formData.selfieUri 
          ? "Vérifiez votre photo avant la soumission." 
          : "Placez votre visage dans le cadre pour la vérification."}
      </Text>

      <View style={styles.selfieContainer}>
        <View style={styles.selfieFrame}>
           <View style={styles.selfieCircle}>
              {formData.selfieUri ? (
                <Image source={{ uri: formData.selfieUri }} style={StyleSheet.absoluteFill} />
              ) : (
                permission && permission.granted ? (
                  <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="front"
                    ref={cameraRef}
                  />
                ) : (
                  <TouchableOpacity onPress={requestPermission} style={styles.permissionPlaceholder}>
                      <Camera size={40} color={COLORS.textLight} />
                      <Text style={styles.permissionText}>Autoriser la caméra</Text>
                  </TouchableOpacity>
                )
              )}
           </View>
        </View>
        
        {!formData.selfieUri && permission && permission.granted && (
           <TouchableOpacity 
             style={styles.embeddedCaptureButton} 
             onPress={capturePhoto}
           >
             <View style={styles.embeddedCaptureInner} />
           </TouchableOpacity>
        )}

        {formData.selfieUri && (
          <TouchableOpacity 
            style={styles.retakeButton} 
            onPress={retakeSelfie}
          >
            <RefreshCw size={20} color={COLORS.white} />
            <Text style={styles.retakeButtonText}>Reprendre la photo</Text>
          </TouchableOpacity>
        )}
        
        {!formData.selfieUri && (
          <Text style={styles.selfieInstruction}>
            {permission && permission.granted 
              ? "Positionnez votre visage et appuyez sur le bouton" 
              : "Nous avons besoin d'accéder à votre caméra"}
          </Text>
        )}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <View style={styles.reviewContainer}>
        <View style={styles.reviewIconContainer}>
           <Clock size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.reviewTitle}>Vérification en cours</Text>
        <Text style={styles.reviewDescription}>
          Votre demande de vérification a été soumise avec succès.
        </Text>
        <View style={styles.infoBox}>
          <ShieldCheck size={20} color={COLORS.primary} />
          <Text style={styles.infoBoxText}>
            Notre équipe examine actuellement vos documents. Vous recevrez une notification dès que votre profil sera validé (généralement sous 24h).
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          {step < 4 && (
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backButton}>
              <ChevronLeft size={28} color={COLORS.secondary} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
             {step === 4 ? 'Statut' : 'Vérification'}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {renderStepIndicator()}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
             <TouchableOpacity 
               style={[styles.nextButton, step === 3 && !formData.selfieUri && { opacity: 0.5 }, styles.flexGrow]} 
               onPress={() => {
                 if (step === 4) {
                   navigation.reset({
                     index: 0,
                     routes: [{ name: 'PrestataireDashboard' }],
                   });
                 } else {
                   nextStep();
                 }
               }}
               disabled={step === 3 && !formData.selfieUri}
             >
               <Text style={styles.nextButtonText}>
                 {step === 4 ? "Démarrer" : step === 3 ? 'Soumettre' : 'Continuer'}
               </Text>
               <ArrowRight size={20} color={COLORS.white} />
             </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      <Modal visible={showCamera} animationType="slide" transparent={false}>
        <View style={styles.cameraContainer}>
          <CameraView 
            style={StyleSheet.absoluteFill} 
            facing="back"
            ref={cameraRef}
          >
            <View style={styles.overlayContainer}>
               <View style={styles.overlayTop} />
               <View style={styles.overlayRow}>
                  <View style={styles.overlaySide} />
                  <View style={styles.cinHole} />
                  <View style={styles.overlaySide} />
               </View>
               <View style={styles.overlayBottom}>
                  <Text style={styles.overlayText}>CADRE DE LA CIN</Text>
                  <Text style={styles.overlaySubtext}>Alignez votre carte ici</Text>
               </View>
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.closeButton}>
                <X size={30} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={capturePhoto} style={styles.shutterButton}>
                 <Circle size={70} color={COLORS.white} />
              </TouchableOpacity>
              <View style={{ width: 40 }} />
            </View>
          </CameraView>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepCircleInactive: {
    backgroundColor: COLORS.border,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  textWhite: {
    color: COLORS.white,
  },
  textLight: {
    color: COLORS.textLight,
  },
  stepLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  stepLineInactive: {
    backgroundColor: COLORS.border,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  uploadCardSmall: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  uploadCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  documentPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
    gap: 12,
  },
  documentPickerText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  previewSection: {
    marginTop: 12,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  pdfPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  pdfText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  selfieContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  selfieFrame: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  selfieCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 120,
    overflow: 'hidden',
    backgroundColor: COLORS.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  permissionText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  embeddedCaptureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  embeddedCaptureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  retakeButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  selfieInstruction: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  reviewContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  reviewIconContainer: {
    marginBottom: 24,
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  reviewDescription: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 18,
    gap: 14,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  footer: {
    padding: 18,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  flexGrow: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  overlayRow: {
    flexDirection: 'row',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  cinHole: {
    width: 300,
    height: 190,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    paddingTop: 16,
  },
  overlayText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  overlaySubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
  shutterButton: {
    padding: 4,
  },
});
