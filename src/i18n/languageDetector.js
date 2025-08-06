const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    import('@react-native-async-storage/async-storage').then(AsyncStorage => {
      AsyncStorage.default.getItem('user-language').then(language => {
        const detectedLanguage = language || 'en';
        callback(detectedLanguage);
      }).catch(() => {
        callback('en'); // fallback
      });
    });
  },
  init: () => {},
  cacheUserLanguage: (lng) => {
    import('@react-native-async-storage/async-storage').then(AsyncStorage => {
      AsyncStorage.default.setItem('user-language', lng);
    });
  },
};

export default languageDetector;
