import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { store } from '../../../shared';
import {
  login,
  updateLastActivity,
} from '../../../shared/slice/Auth/AuthService';
import {
  setToken,
  setLoggedInUser,
} from '../../../shared/slice/Auth/AuthSlice';

const SigninScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError(t('signin.fillAllFields'));
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await login({ email, password });

      if (response?.data?.signinToken) {
        store.dispatch(setToken({ token: response.data.signinToken }));
        store.dispatch(setLoggedInUser({ user: response.data.user }));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
        await updateLastActivity({ email });
      } else {
        setError(t('signin.invalidCredentials'));
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(t('signin.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('signin.title')}</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder={t('signin.emailPlaceholder')}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={t('signin.passwordPlaceholder')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>{t('signin.forgotPassword')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? t('signin.loggingIn') : t('signin.login')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>{t('signin.noAccount')}</Text>
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
