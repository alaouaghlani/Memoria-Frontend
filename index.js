import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import Toast, { BaseToast } from 'react-native-toast-message';
import LanguageSwitcher from './src/components/LanguageSwitcher';
import './src/i18n/i18n'
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#10b981',
        height: 80, // Bigger toast height
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
      }}
      text2Style={{
        fontSize: 16,
        color: '#374151',
      }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#ef4444',
        height: 80,
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
      }}
      text2Style={{
        fontSize: 16,
        color: '#374151',
      }}
    />
  ),
};

const Root = () => (
  <>
    <App />
    <Toast config={toastConfig} topOffset={60} />
    <LanguageSwitcher />
  </>
);

AppRegistry.registerComponent(appName, () => Root);
