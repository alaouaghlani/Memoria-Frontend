import React, { useEffect } from 'react';
import axios from 'axios';
import {
  ScrollView,
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

// 🔹 Firebase + Notifee imports
import {
  getMessaging,
  getToken,
  getInitialNotification,
  onNotificationOpenedApp,
  onMessage,
  onTokenRefresh,
  deleteToken
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import notifee, { EventType } from '@notifee/react-native';
import { updatefcmtoken } from '../../shared/slice/CloseAdult/CloseAdultService';
import { useSelector } from 'react-redux';

const CloseScreen = ({ navigation, handleLogout, user }) => {
  const { t } = useTranslation();
  const currentUser = useSelector(state => state.authentification.loggedInUser);

  useEffect(() => {
    const initFCM = async () => {
      try {
        const messaging = getMessaging(getApp());

        // ✅ Get FCM token
        const token = await getToken(messaging);
        console.log('✅ FCM Token:', token);

        // 🔄 Token refresh listener
        const unsubscribeToken = onTokenRefresh(messaging, newToken => {
          (async () => {
            try {
              const payload = {
                idClose: currentUser.id,
                token: newToken,
              };
              const response = await updatefcmtoken(payload);
              console.log('aaaaa', response);

              console.log('🔄 New FCM Token:', newToken);
            } catch (err) {
              console.error(err);
              showToast('error', t('error.serverError'), t('error.tryAgain'));
            }
          })();
        });

        // 📢 Create Notifee channel (Android required)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });

        // 📩 Background notification click
        const unsubscribeBackground = onNotificationOpenedApp(
          messaging,
          remoteMessage => {
            console.log('[Background click]', remoteMessage);
          },
        );

        // 📩 Quit state notification click
        const initialMessage = await getInitialNotification(messaging);
        if (initialMessage) {
          console.log('[Quit state]', initialMessage);
        }

        // 📩 Foreground message
        const unsubscribeForeground = onMessage(
          messaging,
          async remoteMessage => {
            console.log('[Foreground] Message:', remoteMessage);

            // Show local notification with Notifee
            await notifee.displayNotification({
              title: remoteMessage.notification?.title,
              body: remoteMessage.notification?.body,
              android: { channelId },
              data: remoteMessage.data,
            });
          },
        );

        // 📌 Foreground notification click
        const unsubscribeNotifee = notifee.onForegroundEvent(
          ({ type, detail }) => {
            if (type === EventType.PRESS) {
              console.log(
                '[Foreground click] Notification:',
                detail.notification,
              );
            }
          },
        );

        return () => {
          unsubscribeToken();
          unsubscribeBackground();
          unsubscribeForeground();
          unsubscribeNotifee();
        };
      } catch (err) {
        console.error('🔥 FCM Init error:', err);
      }
    };

    const unsubscribePromise = initFCM();

    return () => {
      unsubscribePromise.then(unsub => unsub && unsub());
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning';
    if (hour < 18) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  // 🔘 Test notification button (will call API later)
  const handleTestNotification = async () => {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging); // get device FCM token

      const response = await axios.post(
        'https://192.168.1.2:9000/memoria/sendnotification', // use http unless your server has SSL
        {
          token,
          title: 'Hello from Memoria',
          body: 'This is a test notification!',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.data.success) {
        Alert.alert('✅ Success', 'Notification sent!');
      } else {
        Alert.alert(
          '⚠️ Error',
          response.data.msg || 'Failed to send notification',
        );
      }
    } catch (err) {
      console.error('Notification Error:', err);
      Alert.alert('🔥 Error', err.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
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
          icon="inbox"
          title={t('closeScreen.viewRequests')}
          onPress={() => navigation.navigate('OlderRequests')}
        />
        <MenuCard
          icon="dove"
          title={t('closeScreen.DeceasedRequest')}
          onPress={() => navigation.navigate('DeceasedRequest')}
        />
        <MenuCard
          icon="book-open"
          title={t('closeScreen.Memories')}
          onPress={() => navigation.navigate('Memories')}
        />
        <MenuCard
          icon="user-circle"
          title={t('closeScreen.profile')}
          onPress={() => navigation.navigate('ProfileClose')}
        />
        <MenuCard
          icon="cog"
          title={t('closeScreen.settings')}
          onPress={() => navigation.navigate('Settings')}
        />

        {/* 🔘 Test Notification Button */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#e0e7ff' }]}
          onPress={handleTestNotification}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="bell" size={20} color="#4338ca" />
            <Text style={styles.cardTitle}>🔔 Test Notification</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Button
        title="🔄 Forcer Token Refresh"
        onPress={async () => {
          const refreshToken = async () => {
            const messaging = getMessaging(getApp());

            // Supprime le token existant
            await deleteToken(messaging); // ✅ API modulaire
            const newToken = await getToken(messaging); // ✅ API modulaire

            console.log('✅ Nouveau token généré :', newToken);
          };
          await refreshToken();
        }}
      />
      <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
        <View style={styles.cardContent}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>{t('closeScreen.logout')}</Text>
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
    borderWidth: 2,
    borderColor: '#fff',
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
  },
});

export default CloseScreen;
