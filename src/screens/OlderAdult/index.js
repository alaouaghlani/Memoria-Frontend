import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const OlderAdultScreen = ({ navigation, handleLogout, user }) => {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>
        👋 {t('older.welcome')}, {user.fullName}
      </Text>
      <Text style={styles.username}>{user.fullName}</Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Relate')}
        >
          <Text style={styles.cardTitle}>➕ {t('older.relate')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('CloseList')}
        >
          <Text style={styles.cardTitle}>📋 {t('older.closeList')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SettingsOlder')}
        >
          <Text style={styles.cardTitle}>⚙️ {t('closeScreen.settings')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ProfileOlder')}
        >
          <Text style={styles.cardTitle}>👤 {t('closeScreen.profile')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.card, styles.logoutCard]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>🚪 {t('older.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4ff',
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 18,
    color: '#4f46e5',
    marginBottom: 4,
    textAlign: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  menuContainer: {
    width: '100%',
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  logoutCard: {
    backgroundColor: '#fff0f0',
    borderColor: '#dc2626',
    borderWidth: 1,
    marginTop: 40,
    width: '100%',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    textAlign: 'center',
  },
});

export default OlderAdultScreen;
