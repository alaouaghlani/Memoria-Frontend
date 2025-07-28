import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { designateHeirs } from '../../shared/slice/OlderAdult/OlderAdultService';
import { useTranslation } from 'react-i18next';

const RelateScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const currentUser = useSelector(state => state.authentification.loggedInUser);

  const showToast = (type, text1, text2) => {
    Toast.show({ type, text1, text2 });
  };

  const handleRelate = async () => {
    if (!email || !relation) {
      showToast('error', t('common.error'), t('relateScreen.fillAllFields'));
      return;
    }

    const data = [{ email, relation }];
    try {
      const response = await designateHeirs(data, currentUser._id);

      if (response.success) {
        showToast('success', t('common.success'), t('relateScreen.linkSuccess'));
        navigation.goBack();
      } else {
        showToast('error', t('common.error'), response.message || t('common.genericError'));
      }
    } catch (error) {
      showToast('error', t('common.error'), t('relateScreen.linkError'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('relateScreen.title')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('relateScreen.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder={t('relateScreen.relationPlaceholder')}
        value={relation}
        onChangeText={setRelation}
      />

      <TouchableOpacity style={styles.button} onPress={handleRelate}>
        <Text style={styles.buttonText}>{t('relateScreen.relateButton')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RelateScreen;
