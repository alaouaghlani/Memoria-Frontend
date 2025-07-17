import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/images/memoria-logo.png')}
        style={styles.logo}
        resizeMode="cover"
      />

      {/* App Title */}
      <Text style={styles.title}>Memoria</Text>

      {/* Slogan */}
      <Text style={styles.slogan}>IA au service du souvenir.</Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.buttonSecondaryText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 6,
  },
  slogan: {
    fontSize: 16,
    color: '#4b5563',
    fontStyle: 'italic',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonSecondary: {
    borderColor: '#6366f1',
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen;
