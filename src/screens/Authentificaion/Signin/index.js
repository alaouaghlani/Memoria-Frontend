import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { store } from '../../../shared';
import { login, updateLastActivity } from '../../../shared/slice/Auth/AuthService';
import {
  setToken,
  setLoggedInUser,
} from '../../../shared/slice/Auth/AuthSlice';

const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // ✅ added
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError('Veuillez remplir tous les champs.');
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await login({ email, password });

      if (response?.data?.signinToken) {
        store.dispatch(setToken({ token: response.data.signinToken }));
        store.dispatch(setLoggedInUser({ user: response.data.user }));
        navigation.navigate('Main');
        await updateLastActivity({email:email})
      } else {
        setError('Identifiants invalides.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Pas encore de compte ? Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1f2937',
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
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 15,
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

export default SigninScreen;
