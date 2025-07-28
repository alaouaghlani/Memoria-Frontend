import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { signup } from '../../../shared/slice/Auth/AuthService';
import { useTranslation } from 'react-i18next';

const SignupScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    type: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type, text1, text2) => {
    Toast.show({ type, text1, text2 });
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSignup = async () => {
    const { fullName, email, password, gender, dateOfBirth, type } = form;

    if (!fullName || !email || !password || !gender || !dateOfBirth || !type) {
      showToast('error', t('error'), t('signup.fillAllFields'));
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
      const response = await signup(payload);
      navigation.navigate('Login');
    } catch (err) {
      console.error('Signup error:', err);
      showToast('error', t('error'), t('signup.creationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('signup.title')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('signup.fullName')}
        value={form.fullName}
        onChangeText={text => handleChange('fullName', text)}
      />

      <TextInput
        style={styles.input}
        placeholder={t('signup.email')}
        keyboardType="email-address"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder={t('signup.password')}
        secureTextEntry
        value={form.password}
        onChangeText={text => handleChange('password', text)}
      />

      <TextInput
        style={styles.input}
        placeholder={t('signup.dob')}
        value={form.dateOfBirth}
        onChangeText={text => handleChange('dateOfBirth', text)}
      />

      <TextInput
        style={styles.input}
        placeholder={t('signup.gender')}
        value={form.gender}
        onChangeText={text => handleChange('gender', text)}
      />

      <Text style={styles.label}>{t('signup.accountType')}</Text>
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
            {t('signup.close')}
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
            {t('signup.older')}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? t('signup.creating') : t('signup.create')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>{t('signup.haveAccount')}</Text>
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
