import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

const OlderAdultScreen = ({ navigation, handleLogout, user }) => {
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning';
    if (hour < 18) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
            <LinearGradient
colors={['#43cea2', '#185a9d']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerContent}>
                <Image
                  source={
                    user.avatarUrl
                      ? { uri: user.avatarUrl }
                      : require('../../assets/images/avatar-placeholder.png')
                  }
                  style={styles.avatarImage}
                />
                <View>
                  <Text style={styles.greetingText}>{getGreeting()},</Text>
                  <Text style={styles.usernameText}>{user.fullName}</Text>
                </View>
              </View>
            </LinearGradient>

      <View style={styles.menuContainer}>
        <MenuCard
          icon="book-open"
          title={t('older.memories')}
          onPress={() => navigation.navigate('MemoriesOlder')}
        />
        <MenuCard
          icon="user-plus"
          title={t('older.relate')}
          onPress={() => navigation.navigate('Relate')}
        />
        <MenuCard
          icon="list-alt"
          title={t('older.closeList')}
          onPress={() => navigation.navigate('CloseList')}
        />
        <MenuCard
          icon="cog"
          title={t('closeScreen.settings')}
          onPress={() => navigation.navigate('SettingsOlder')}
        />
        <MenuCard
          icon="user-circle"
          title={t('closeScreen.profile')}
          onPress={() => navigation.navigate('ProfileOlder')}
        />
      </View>

      <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
        <View style={styles.cardContent}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>{t('older.logout')}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const MenuCard = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.cardContent}>
      <FontAwesome5 name={icon} size={20} color="#4f46e5" />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4ff',
    padding: 24,
    alignItems: 'center',
  },
   headerGradient: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // borderWidth: 2,
    // borderColor: '#fff',
  },

  greetingText: {
    fontSize: 16,
    color: '#f3f4f6',
    marginBottom: 4,
  },

  usernameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },

  menuContainer: {
    width: '100%',
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
  },
  logoutCard: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626',
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
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
