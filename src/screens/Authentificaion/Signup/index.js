import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
console.log(form);

  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderOptions, setShowGenderOptions] = useState(false);

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

    // ✅ Convert from "DD/MM/YYYY" to "YYYY-MM-DD" before sending
  let formattedDate = dateOfBirth;
if (formattedDate.includes('/')) {
  const [day, month, year] = formattedDate.split('/');
  formattedDate = `${year}/${month}/${day}`; // ✅ Your required format
}

    const payload = {
      fullName,
      email,
      password,
      dateOfBirth: formattedDate,
      gender: gender.trim().toUpperCase(),
      type,
    };

    try {
      setIsLoading(true);
      await signup(payload);
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

      {/* Full name */}
      <TextInput
        style={styles.input}
        placeholder={t('signup.fullName')}
        value={form.fullName}
        onChangeText={text => handleChange('fullName', text)}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder={t('signup.email')}
        keyboardType="email-address"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder={t('signup.password')}
        secureTextEntry
        value={form.password}
        onChangeText={text => handleChange('password', text)}
      />

      {/* Date of birth */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder={t('signup.dob')}
          value={form.dateOfBirth ? form.dateOfBirth : ''}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.dateOfBirth ? new Date(form.dateOfBirth) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              // 🔹 Store display value as "DD/MM/YYYY"
              const formattedDate = selectedDate
                .toLocaleDateString('en-GB')
                .replace(/-/g, '/');
              handleChange('dateOfBirth', formattedDate);
            }
          }}
        />
      )}

      {/* Gender selector */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowGenderOptions(!showGenderOptions)}
      >
        <Text style={{ color: form.gender ? '#111827' : '#9ca3af' }}>
          {form.gender ? t(`signup.${form.gender.toLowerCase()}`) : t('signup.gender')}
        </Text>
      </TouchableOpacity>

      {showGenderOptions && (
        <View style={styles.genderOptions}>
          {['Male', 'Female'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderOption,
                form.gender === option && styles.genderOptionSelected,
              ]}
              onPress={() => {
                handleChange('gender', option);
                setShowGenderOptions(false);
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  form.gender === option && styles.genderTextSelected,
                ]}
              >
                {t(`signup.${option.toLowerCase()}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Account type */}
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

      {/* Signup button */}
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
  genderOptions: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 15,
  },
  genderOption: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#6366f1',
  },
  genderText: {
    color: '#111827',
  },
  genderTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
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
