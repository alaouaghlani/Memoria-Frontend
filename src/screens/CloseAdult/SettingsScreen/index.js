import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { updateConsent } from '../../../shared/slice/CloseAdult/CloseAdultService';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const user = useSelector(state => state.authentification.loggedInUser);
  const [olderAdults, setOlderAdults] = useState(user?.olderAdults || []);

  // Update local state if user.olderAdults changes
  useEffect(() => {
    setOlderAdults(user?.olderAdults || []);
  }, [user?.olderAdults]);

  const showToast = (type, text1, text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const handleToggleConsent = async (consentGiven, IDOlderAdult) => {
    try {
      const res = await updateConsent({
        IDClose: user._id,
        IDOlderAdult,
        consentGiven,
      });

      if (res.success) {
        // Update local olderAdults state to reflect the new consentGiven value
        setOlderAdults(prev =>
          prev.map(older =>
            older.IDOlderAdult === IDOlderAdult
              ? { ...older, consentGiven }
              : older
          )
        );
        showToast('success', t('settings.success'));
      } else {
        showToast('error', t('settings.error'), res.message || '');
      }
    } catch (error) {
      console.error(error);
      showToast('error', t('settings.error'), error.message || '');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      {olderAdults.length === 0 ? (
        <Text style={styles.noData}>{t('settings.noData')}</Text>
      ) : (
        olderAdults.map((older, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.relation}>
                {t('settings.relation')}: {older.relation}
              </Text>
              <Text style={styles.id}>
                ID: {older.IDOlderAdult.slice(-6)}
              </Text>
            </View>
            <Switch
              value={older.consentGiven}
              onValueChange={(value) =>
                handleToggleConsent(value, older.IDOlderAdult)
              }
            />
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default SettingsScreen;

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
