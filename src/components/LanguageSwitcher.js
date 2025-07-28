import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import i18n from '../i18n'; // import initialized instance
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
      const { t } = useTranslation();
    
  useEffect(() => {
    const onChange = (lng) => setCurrentLang(lng);
    i18n.on('languageChanged', onChange);
    return () => {
      i18n.off('languageChanged', onChange);
    };
  }, []);

  const toggleLanguage = () => {
    const next = currentLang === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(next);
  };


  return (
    <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
      <Text style={styles.text}>{currentLang.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#6366f1',
    padding: 10,
    borderRadius: 20,
    zIndex: 1000,
    elevation: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher;
