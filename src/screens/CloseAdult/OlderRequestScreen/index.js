import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';

import {
  getOlderAdultRequest,
  getRequestAdultHistory,
  updateOlderRequest,
} from '../../../shared/slice/CloseAdult/CloseAdultService';
import { store } from '../../../shared';
import { setOlderRequest } from '../../../shared/slice/CloseAdult/CloseAdultSlice';
import { useSelector } from 'react-redux';

const OlderRequestScreen = () => {
  const { t } = useTranslation();
  const currentUser = useSelector(state => state.authentification.loggedInUser);
  const olderRequest = useSelector(state => state.closeAdult.olderRequest);

  const [view, setView] = useState('requests');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedOlderId, setSelectedOlderId] = useState(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  console.log(history);

  useEffect(() => {
    fetchRequestAdult();
    fetchRequestAdultHistory();
  }, []);

  const fetchRequestAdult = async () => {
    try {
      const response = await getOlderAdultRequest(currentUser._id);
      const olderAdults = response?.close?.olderAdults || [];
      store.dispatch(setOlderRequest({ olderRequest: olderAdults }));
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', t('errors.loadingFailed'), t('errors.tryAgainLater'));
    }
  };

  const fetchRequestAdultHistory = async () => {
    try {
      const res = await getRequestAdultHistory(currentUser._id);
      const historyData = res?.data || [];
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching history:', error);
      showToast('error', t('errors.loadingFailed'), t('errors.tryAgainLater'));
    }
  };

  const showToast = (type, text1, text2) => {
    Toast.show({ type, text1, text2 });
  };

  const promptCode = (olderId, action) => {
    setSelectedAction(action);
    setSelectedOlderId(olderId);
    setCode('');
    setModalVisible(true);
  };

  const handleConfirmCode = async () => {
    if (!code) {
      showToast(
        'error',
        t('validation.missingCode'),
        t('validation.enterCode'),
      );
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        IDOlderAdult: selectedOlderId,
        status: selectedAction,
        IDClose: currentUser._id,
        verificationCode: code,
      };

      const response = await updateOlderRequest(payload);

      if (response.success) {
        showToast(
          'success',
          t('success.title'),
          selectedAction === 'ACCEPTED'
            ? t('success.accepted')
            : t('success.denied'),
        );
        setModalVisible(false);
        fetchRequestAdult();
      } else {
        showToast(
          'error',
          t('error.incorrectCode'),
          response.msg || t('error.tryAgain'),
        );
      }
    } catch (err) {
      console.error(err);
      showToast('error', t('error.serverError'), t('error.tryAgain'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const older = item.IDOlderAdult;
    const status = item.heritageStatus;
    const relation = item.relation;
    const sentAt = new Date(item.sentAt).toLocaleString();
    const updatedAt = item.updatedAt
      ? new Date(item.updatedAt).toLocaleString()
      : null;

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{older.fullName}</Text>
        <Text style={styles.email}>{older.email}</Text>
        <Text style={styles.relation}>
          {t('request.relation')}: {relation}
        </Text>

        <Text style={styles.dateText}>
          📩 {t('request.sentAt')}: {sentAt}
        </Text>

        {(status === 'ACCEPTED' || status === 'DENIED') && updatedAt && (
          <Text style={styles.dateText}>
            🕓 {t('request.updatedAt')}: {updatedAt}
          </Text>
        )}

        <View
          style={[
            styles.statusBadge,
            status === 'ACCEPTED'
              ? styles.accepted
              : status === 'DENIED'
              ? styles.denied
              : styles.pending,
          ]}
        >
          <Text style={styles.statusText}>
            {status === 'ACCEPTED'
              ? t('status.accepted')
              : status === 'DENIED'
              ? t('status.denied')
              : t('status.pending')}
          </Text>
        </View>

        {status === 'PENDING' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => promptCode(older._id, 'ACCEPTED')}
            >
              <Text style={styles.buttonText}>✅ {t('actions.accept')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => promptCode(older._id, 'DENIED')}
            >
              <Text style={styles.buttonText}>❌ {t('actions.decline')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('screen.title')}</Text>
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            view === 'requests' && styles.activeToggle,
          ]}
          onPress={() => {
            setView('requests');
          }}
        >
          <Text
            style={[
              styles.toggleText,
              view === 'requests' && styles.activeToggleText,
            ]}
          >
            {t('deceased.requests')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            view === 'history' && styles.activeToggle,
          ]}
          onPress={() => {
            setView('history');
            // fetchDeceasedHistory();
          }}
        >
          <Text
            style={[
              styles.toggleText,
              view === 'history' && styles.activeToggleText,
            ]}
          >
            {t('deceased.history')}
          </Text>
        </TouchableOpacity>
      </View>
      {/* View Content */}
      {view === 'requests' ? (
        olderRequest.length === 0 ? (
          <Text style={styles.noData}>{t('screen.noRequests')}</Text>
        ) : (
          <FlatList
            data={olderRequest}
            keyExtractor={item => item.IDOlderAdult._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )
      ) : history.length === 0 ? (
        <Text style={styles.noData}>{t('deceased.noHistory')}</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            const older = item.IDOlderAdult;
            const status = item.status;
            const sentAt = new Date(item.sentAt).toLocaleString();
            const updatedAt = item.updatedAt
              ? new Date(item.updatedAt).toLocaleString()
              : null;
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.name}>{older.fullName}</Text>
                    <Text style={styles.email}>{older.email}</Text>
                  </View>
                </View>
                <Text style={styles.date}>
                  📩 {t('deceased.sentAt')}: {sentAt}
                </Text>
                {updatedAt &&
                  (status === 'ACCEPTED' || status === 'DENIED') && (
                    <Text style={styles.date}>
                      🕓 {t('deceased.updatedAt')}: {updatedAt}
                    </Text>
                  )}
              <View
                style={[
                  styles.badge,
                  status === 'ACCEPTED'
                    ? styles.badgeAccepted
                    : status === 'DENIED'
                    ? styles.badgeDenied
                    : styles.badgePending,
                ]}
              >
                <Text style={styles.badgeText}>
                  {t(`status.${status?.toLowerCase()}`)}
                </Text>
              </View>
              </View>
            );
          }}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('modal.title')}</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder={t('modal.placeholder')}
            keyboardType="numeric"
            editable={!isLoading}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmCode}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>{t('modal.confirm')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>{t('modal.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 4, color: '#555' },
  relation: { fontSize: 14, color: '#2563eb', marginBottom: 8 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  accepted: { backgroundColor: '#d1fae5' },
  pending: { backgroundColor: '#e0f2fe' },
  denied: { backgroundColor: '#fee2e2' },
    badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
  },
  badgeAccepted: {
    backgroundColor: '#d1fae5',
  },
  badgeDenied: {
    backgroundColor: '#fee2e2',
  },
  badgePending: {
    backgroundColor: '#e0f2fe',
  },
  statusText: { fontSize: 12, fontWeight: '500' },
  noData: { textAlign: 'center', marginTop: 40, color: '#666' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  acceptButton: {
    backgroundColor: '#34d399',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  declineButton: {
    backgroundColor: '#f87171',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#9ca3af',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    color: '#334155',
    fontWeight: '500',
  },
  activeToggle: {
    backgroundColor: '#3b82f6',
  },
  activeToggleText: {
    color: '#fff',
  },
});

export default OlderRequestScreen;
