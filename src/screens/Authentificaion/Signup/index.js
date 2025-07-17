import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { signup } from '../../../shared/slice/Auth/AuthService'; // ✅ your API function

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    type: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSignup = async () => {
    const { fullName, email, password, gender, dateOfBirth, type } = form;

    if (!fullName || !email || !password || !gender || !dateOfBirth || !type) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const payload = {
      fullName,
      email,
      password,
      dateOfBirth,
      gender: gender.trim().toUpperCase(),
      type,
    };

    try {
      setIsLoading(true);
      const response = await signup(payload); // ✅ call your API
      console.log(response);

      navigation.navigate('Login');
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Erreur', 'La création du compte a échoué.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={form.fullName}
        onChangeText={text => handleChange('fullName', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={form.password}
        onChangeText={text => handleChange('password', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Date de naissance (YYYY-MM-DD)"
        value={form.dateOfBirth}
        onChangeText={text => handleChange('dateOfBirth', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Genre (Homme / Femme)"
        value={form.gender}
        onChangeText={text => handleChange('gender', text)}
      />

      <Text style={styles.label}>Type de compte</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            form.type === 'Close' && styles.typeButtonSelected,
          ]}
          onPress={() => handleChange('type', 'Close')}
        >
          <Text
            style={[
              styles.typeButtonText,
              form.type === 'Close' && styles.typeButtonTextSelected,
            ]}
          >
            Proche
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            form.type === 'OlderAdult' && styles.typeButtonSelected,
          ]}
          onPress={() => handleChange('type', 'OlderAdult')}
        >
          <Text
            style={[
              styles.typeButtonText,
              form.type === 'OlderAdult' && styles.typeButtonTextSelected,
            ]}
          >
            Personne âgée
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Création...' : 'Créer le compte'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 30,
    textAlign: 'center',
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
  label: {
    fontWeight: '600',
    marginBottom: 10,
    color: '#374151',
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#6366f1',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#6366f1',
  },
  typeButtonText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: '#ffffff',
  },
  buttonPrimary: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
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
    fontWeight: '500',
    fontSize: 15,
  },
});

export default SignupScreen;
