import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { getCloseAdult, designateHeirs } from '../../../shared/slice/OlderAdult/OlderAdultService';
import { store } from '../../../shared';
import { setCloseList } from '../../../shared/slice/OlderAdult/OlderAdultSlice';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const CloseListScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const currentUser = useSelector(state => state.authentification.loggedInUser);
  const closeList = useSelector(state => state.olderAdult.closeList);

  useEffect(() => {
    fetchCloseList();
  }, []);

  const fetchCloseList = async () => {
    try {
      const response = await getCloseAdult(currentUser.id);
      store.dispatch(setCloseList({ closeList: response.data }));
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', t('closeList.resendError'), t('closeList.serverError'));
    }
  };

  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const handleResendRequest = async (item) => {
    if (!item.email || !item.olderAdults?.[0]?.relation) {
      showToast('error', t('closeList.resendError'), t('relate.error'));
      return;
    }

    const data = [{ email: item.email, relation: item.olderAdults[0].relation }];

    try {
      const response = await designateHeirs(data, currentUser.id);
      if (response.success) {
        showToast('success', t('closeList.resendSuccess'), '');
        fetchCloseList();
      } else {
        showToast('error', t('closeList.resendError'), response.message || '');
      }
    } catch (error) {
      console.error(error);
      showToast('error', t('closeList.resendError'), t('relate.serverError'));
    }
  };

  const renderItem = ({ item }) => {
    const relation = item.olderAdults?.[0]?.relation || 'N/A';
    const status = item.olderAdults?.[0]?.heritageStatus || 'UNKNOWN';

    let badgeStyle = styles.pending;
    let statusLabel = t('closeList.status.pending');

    if (status === 'ACCEPTED') {
      badgeStyle = styles.accepted;
      statusLabel = t('closeList.status.accepted');
    } else if (status === 'DENIED') {
      badgeStyle = styles.denied;
      statusLabel = t('closeList.status.denied');
    }

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.relation}>{t('closeList.relation')}: {relation}</Text>
        <View style={[styles.statusBadge, badgeStyle]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>

        {status === 'DENIED' && (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => handleResendRequest(item)}
          >
            <Text style={styles.resendButtonText}>{t('closeList.resend')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('closeList.title')}</Text>

      {closeList.length === 0 ? (
        <Text style={styles.noData}>{t('closeList.noData')}</Text>
      ) : (
        <FlatList
          data={closeList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    color: '#1f2937',
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  relation: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  accepted: {
    backgroundColor: '#d1fae5',
  },
  pending: {
    backgroundColor: '#e0f2fe',
  },
  denied: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '500',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 40,
  },
  resendButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  resendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CloseListScreen;
