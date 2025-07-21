import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { forgetPassword, updatePassword, verifyCode } from '../../../shared/slice/Auth/AuthService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre email.');
      return;
    }
    setLoading(true);
    try {
      const response = await forgetPassword({ email: email });
      if (response.success) {
        setStep(2);
      } else {
        Alert.alert(response.msg);
      }
    } catch (error) {
      Alert.alert('Erreur',"This email doesn't exist.");
      
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Erreur', 'Veuillez entrer le code de vérification.');
      return;
    }
    setLoading(true);
    const data = {
      email: email,
      code: code,
    };
    try {
      const response = await verifyCode(data);
      if (response.success) {
        setStep(3);
      } else {
        Alert.alert(response.msg);
      }
    } catch (error) {
      console.log(error);
      
      Alert.alert('Erreur', 'Code invalide.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir les deux champs.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    const data = {
      email: email,
      password: password,
    };
    try {
      const reponse = await updatePassword(data);

      Alert.alert('Succès', 'Mot de passe réinitialisé.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Votre email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSendEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Envoi...' : 'Envoyer le code'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.label}>Un code vous a été envoyé par email.</Text>
          <TextInput
            style={styles.input}
            placeholder="Code de vérification"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyCode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Vérification...' : 'Vérifier le code'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Changement...' : 'Changer le mot de passe'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step > 1 && (
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text style={styles.link}>Recommencer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#374151',
  },
  input: {
    backgroundColor: '#f9fafb',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 15,
    color: '#111827',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: '#6366f1',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;
