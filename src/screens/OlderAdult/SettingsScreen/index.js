import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { updateAuthorizationForTransmission } from '../../../shared/slice/OlderAdult/OlderAdultService'; // Adjust path if needed
import { store } from '../../../shared';
import { setLoggedInUser } from '../../../shared/slice/Auth/AuthSlice';

const SettingsOlderScreen = () => {
  const { t } = useTranslation();
  const user = useSelector(state => state.authentification.loggedInUser);
  console.log(user);

  const [authorizationForTransmission, setAuthorizationForTransmission] =
    useState(user?.authorizationForTransmission || false);

  useEffect(() => {
    setAuthorizationForTransmission(
      user?.authorizationForTransmission || false,
    );
  }, [user?.authorizationForTransmission]);

  const showToast = (type, text1, text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const handleToggleAuthorization = async newValue => {
    try {
      const res = await updateAuthorizationForTransmission({
        authorizationForTransmission: newValue,
        email: user.email,
      });

      if (res.success) {
        setAuthorizationForTransmission(newValue);
        if (res.older) {
          store.dispatch(setLoggedInUser({ user: res.older }));
        }
        showToast('success', t('settings.success'));
      } else {
        showToast('error', t('settings.error'), res.msg || '');
      }
    } catch (error) {
      console.error(error);
      showToast('error', t('settings.error'), error.message || '');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      {/* Single Switch for Authorization for Transmission */}
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.relation}>
            {t('settings.authorizationForTransmission')}
          </Text>
        </View>
        <Switch
          value={authorizationForTransmission}
          onValueChange={handleToggleAuthorization}
        />
      </View>
    </ScrollView>
  );
};

export default SettingsOlderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  info: {
    flex: 1,
  },
  relation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  id: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});
