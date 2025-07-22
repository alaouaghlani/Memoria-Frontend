import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { designateHeirs } from '../../shared/slice/OlderAdult/OlderAdultService';

const RelateScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const currentUser = useSelector(state => state.authentification.loggedInUser);

  const handleRelate = async () => {
    if (!email || !relation) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    const data = [{ email: email, relation: relation }];
    try {
      const response = await designateHeirs(data,currentUser._id);

      if (response.success) {
        Alert.alert('Succès', 'Lien créé avec succès.');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', response.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le lien.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relier à un proche </Text>

      <TextInput
        style={styles.input}
        placeholder="Email du proche"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Relation (ex: fille, ami...)"
        value={relation}
        onChangeText={setRelation}
      />

      <TouchableOpacity style={styles.button} onPress={handleRelate}>
        <Text style={styles.buttonText}>Relier</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RelateScreen;
