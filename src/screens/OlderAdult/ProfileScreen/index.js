import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { updateOlderProfile } from '../../../shared/slice/OlderAdult/OlderAdultService';
import { store } from '../../../shared';
import { setLoggedInUser } from '../../../shared/slice/Auth/AuthSlice';

const ProfileOlderScreen = () => {
  const { t } = useTranslation();
  const user = useSelector(state => state.authentification.loggedInUser);

  const [fullName, setFullName] = useState(user?.fullName || '');

  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [userStatus, setUserStatus] = useState(user?.userStatus || '');

  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpdateProfile = async () => {
    if (!email || !fullName || !dateOfBirth || !gender || !userStatus) {
      Alert.alert(t('profile.error'), t('profile.fillAllFields'));
      return;
    }
    const data = {
      email: email,
      fullName: fullName,
      dateOfBirth: dateOfBirth,
      gender: gender,
      userStatus: userStatus,
    };
    try {
      const res = await updateOlderProfile(data);

      if (res.success) {
        store.dispatch(setLoggedInUser({ user: res.older }));
        Toast.show({
          type: 'success',
          text1: t('profile.success'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('profile.error'),
          text2: res.msg || '',
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: t('profile.error'),
        text2: err?.response?.data?.msg || err.message,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('profile.title')}</Text>

      <Text style={styles.label}>{t('profile.fullName')}</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <Text style={styles.label}>{t('profile.email')}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <Text style={styles.label}>{t('profile.dateOfBirth')}</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        <Text>{dateOfBirth || t('profile.selectDate')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDateOfBirth(selectedDate.toISOString().split('T')[0]);
            }
          }}
        />
      )}

      <Text style={styles.label}>{t('profile.gender')}</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={gender} onValueChange={setGender}>
          <Picker.Item label={t('profile.selectGender')} value="" />
          <Picker.Item label={t('profile.male')} value="MALE" />
          <Picker.Item label={t('profile.female')} value="FEMALE" />
        </Picker>
      </View>

      <Text style={styles.label}>{t('profile.userStatus')}</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={userStatus} onValueChange={setUserStatus}>
          <Picker.Item label={t('profile.selectStatus')} value="" />
          <Picker.Item label={t('profile.active')} value="ACTIVE" />
          <Picker.Item label={t('profile.suspended')} value="SUSPENDED" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
        <Text style={styles.saveText}>{t('profile.save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileOlderScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4ff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    overflow: 'hidden',
  },
  switchRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
