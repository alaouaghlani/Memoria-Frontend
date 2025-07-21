import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, AppState, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { persistor, store } from '../../shared';
import { useFocusEffect } from '@react-navigation/native';
import OlderAdultScreen from '../OlderAdult';
import CloseScreen from '../CloseAdult';
import { updateLastActivity } from '../../shared/slice/Auth/AuthService';
import { disconnect } from '../../shared/slice/Auth/AuthSlice';

const MainScreen = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const user = useSelector(state => state.authentification.loggedInUser);
  const token = useSelector(state => state.authentification.token);
  const email = user?.email;
  const kind = user?.kind;

  // last activity on focus
  useFocusEffect(
    useCallback(() => {
      if (token && email) {
        updateLastActivity({ email });
      }
    }, [token, email])
  );

  // last activity on app foreground
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (token && email) {
          updateLastActivity({ email });
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [token, email]);

  const handleLogout = async () => {
    store.dispatch(disconnect());
    await persistor.purge();
    navigation.replace('Login');
  };

  if (kind === "OlderAdult") {
    return <OlderAdultScreen navigation={navigation} handleLogout={handleLogout} user={user} />;
  }

  if (kind === "Close") {
    return <CloseScreen navigation={navigation} handleLogout={handleLogout} user={user} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtext}>Utilisateur non reconnu</Text>
      <TouchableOpacity style={[styles.card, styles.logoutCard]} onPress={handleLogout}>
        <Text style={[styles.cardTitle, { color: '#dc2626' }]}>🚪 Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f0f4ff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#6366f1',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  logoutCard: {
    backgroundColor: '#fff0f0',
    borderColor: '#dc2626',
    borderWidth: 1,
  },
});

export default MainScreen;
