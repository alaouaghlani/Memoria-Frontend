import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  forgetPassword,
  updatePassword,
  verifyCode,
} from '../../../shared/slice/Auth/AuthService';
import { useTranslation } from 'react-i18next';

const ForgotPasswordScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const handleSendEmail = async () => {
    if (!email) {
      showToast('error', t('toast.error'), t('forgotPassword.enterEmail'));
      return;
    }
    setLoading(true);
    try {
      const response = await forgetPassword({ email });
      if (response.success) {
        setStep(2);
      } else {
        showToast('error', t('toast.error'), response.msg || t('toast.unknownError'));
      }
    } catch (error) {
      showToast('error', t('toast.error'), t('forgotPassword.emailNotExist'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      showToast('error', t('toast.error'), t('forgotPassword.enterCode'));
      return;
    }
    setLoading(true);
    try {
      const response = await verifyCode({ email, code });
      if (response.success) {
        setStep(3);
      } else {
        showToast('error', t('toast.error'), response.msg || t('forgotPassword.invalidCode'));
      }
    } catch (error) {
      showToast('error', t('toast.error'), t('forgotPassword.invalidCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showToast('error', t('toast.error'), t('forgotPassword.fillBothFields'));
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', t('toast.error'), t('forgotPassword.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      const response = await updatePassword({ email, password });
      showToast('success', t('toast.success'), t('forgotPassword.passwordReset'));
      navigation.navigate('Login');
    } catch (error) {
      showToast('error', t('toast.error'), t('forgotPassword.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forgotPassword.title')}</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder={t('forgotPassword.emailPlaceholder')}
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
              {loading ? t('forgotPassword.sending') : t('forgotPassword.sendCode')}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.label}>{t('forgotPassword.codeSent')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('forgotPassword.codePlaceholder')}
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
              {loading ? t('forgotPassword.verifying') : t('forgotPassword.verifyCode')}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder={t('forgotPassword.newPassword')}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder={t('forgotPassword.confirmPassword')}
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
              {loading ? t('forgotPassword.changing') : t('forgotPassword.changePassword')}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step > 1 && (
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text style={styles.link}>{t('forgotPassword.restart')}</Text>
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
