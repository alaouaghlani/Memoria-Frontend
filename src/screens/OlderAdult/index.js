import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const OlderAdultScreen = ({ navigation, handleLogout, user }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.subtext}>Bienvenue, {user.fullName}</Text>
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Memories')}
    >
      <Text style={styles.cardTitle}>🧠 Mes souvenirs</Text>
    </TouchableOpacity>
    {/* Add other OlderAdult-specific buttons here */}
    <TouchableOpacity
      style={[styles.card, styles.logoutCard]}
      onPress={handleLogout}
    >
      <Text style={[styles.cardTitle, { color: '#dc2626' }]}>
        🚪 Se déconnecter
      </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Relate')}>
  <Text style={styles.cardTitle}>➕ Relier à un proche âgé</Text>
</TouchableOpacity>
  </ScrollView>
);
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f0f4ff',
    flexGrow: 1,
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

export default OlderAdultScreen;
