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
import { useSelector } from 'react-redux';
import {
  getDeceasedHistory,
  getDeceasedInvitations,
  updateDeceasedStatus,
} from '../../../shared/slice/CloseAdult/CloseAdultService';
import { store } from '../../../shared';
import { setDeceasedRequest } from '../../../shared/slice/CloseAdult/CloseAdultSlice';

const DeceasedRequestScreen = () => {
  const { t } = useTranslation();
  const currentUser = useSelector(state => state.authentification.loggedInUser);
  const deceasedRequest = useSelector(
    state => state.closeAdult.deceasedRequest,
  );

  const [view, setView] = useState('requests');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedOlderId, setSelectedOlderId] = useState(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  console.log(history);

  useEffect(() => {
    fetchDeceasedRequest();
    fetchDeceasedHistory();
  }, []);

  const fetchDeceasedRequest = async () => {
    try {
      const response = await getDeceasedInvitations(currentUser.id);
      const deceasedInvitation = response?.invitations || [];
      store.dispatch(
        setDeceasedRequest({ deceasedRequest: deceasedInvitation }),
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', t('errors.loadingFailed'), t('errors.tryAgainLater'));
    }
  };

  const fetchDeceasedHistory = async () => {
    try {
      const res = await getDeceasedHistory(currentUser.id);
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
        deceasedStatus: selectedAction,
        IDClose: currentUser.id,
        verificationCode: code,
      };

      const response = await updateDeceasedStatus(payload);

      if (response.success) {
        showToast(
          'success',
          t('success.title'),
          selectedAction === 'ACCEPTED'
            ? t('success.deceasedAccepted')
            : t('success.deceasedDenied'),
        );
        setModalVisible(false);
        fetchDeceasedRequest();
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
    const status = item.deceasedStatus;
    const relation = item.relation;
    const sentAt = new Date(item.deceasedSentAt).toLocaleString();
    const updatedAt = item.updatedAt
      ? new Date(item.deceasedUpdatedAt).toLocaleString()
      : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>🕊️</Text>
          <View>
            <Text style={styles.name}>{older.fullName}</Text>
            <Text style={styles.email}>{older.email}</Text>
            <Text style={styles.relation}>
              {t('deceased.relation')}: {relation}
            </Text>
          </View>
        </View>

        <Text style={styles.date}>
          📩 {t('deceased.sentAt')}: {sentAt}
        </Text>
        {updatedAt && (status === 'ACCEPTED' || status === 'DENIED') && (
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

        {status === 'PENDING' && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => promptCode(older.id, 'ACCEPTED')}
            >
              <Text style={styles.actionText}>
                ✅ {t('actions.confirmDeath')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => promptCode(older.id, 'DENIED')}
            >
              <Text style={styles.actionText}>
                ❌ {t('actions.cancelDeath')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('deceased.title')}</Text>

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
        deceasedRequest.length === 0 ? (
          <Text style={styles.noData}>{t('deceased.noRequests')}</Text>
        ) : (
          <FlatList
            data={deceasedRequest}
            keyExtractor={item => item.IDOlderAdult.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )
      ) : history.length === 0 ? (
        <Text style={styles.noData}>{t('deceased.noHistory')}</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
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
                  <Text style={styles.emoji}>🕊️</Text>
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

      {/* Modal for code input */}
      <Modal isVisible={modalVisible}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{t('modal.deceasedTitle')}</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder={t('modal.deceasedPlaceholder')}
            keyboardType="numeric"
            editable={!isLoading}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirmCode}
              disabled={isLoading}
            >
              <Text style={styles.actionText}>{t('modal.confirm')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => setModalVisible(false)}
              disabled={isLoading}
            >
              <Text style={styles.actionText}>{t('modal.cancel')}</Text>
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
    padding: 16,
    backgroundColor: '#f0f4ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 30,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#64748b',
  },
  relation: {
    fontSize: 14,
    color: '#2563eb',
  },
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
  date: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  confirmBtn: {
    backgroundColor: '#10b981',
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  rejectBtn: {
    backgroundColor: '#ef4444',
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    color: '#6b7280',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default DeceasedRequestScreen;
