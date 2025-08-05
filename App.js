import React from 'react';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import HomeScreen from './src/screens/Home';
import SigninScreen from './src/screens/Authentificaion/Signin';
import SignupScreen from './src/screens/Authentificaion/Signup';
import ForgotPasswordScreen from './src/screens/Authentificaion/ForgetPassword';
import MainScreen from './src/screens/Main';
import { persistor, store } from './src/shared';
import CloseListScreen from './src/screens/OlderAdult/closeListScreen';
import OlderRequestScreen from './src/screens/CloseAdult/OlderRequestScreen';
import RelateScreen from './src/screens/OlderAdult/RelateScreen';
import SettingsScreen from './src/screens/CloseAdult/SettingsScreen';
import ProfileCloseScreen from './src/screens/CloseAdult/ProfileScreen';
import ProfileOlderScreen from './src/screens/OlderAdult/ProfileScreen';
import SettingsOlderScreen from './src/screens/OlderAdult/SettingsScreen';
import DeceasedRequestScreen from './src/screens/CloseAdult/DeceasedRequestScreen';
import MemoriesScreen from './src/screens/CloseAdult/MemoriesScreen';
const Stack = createNativeStackNavigator();

// ✅ Wrapper to access Redux inside Navigator setup
const RootNavigation = () => {
  const isAuthenticated = useSelector(
    state => state.authentification.isLoggedIn,
  );
  const initialRoute = isAuthenticated ? 'Main' : 'Home';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerLeft: () => null,
            gestureEnabled: false,
            title: 'Memoria',
          }}
        />
        <Stack.Screen name="Relate" component={RelateScreen} />
        <Stack.Screen name="CloseList" component={CloseListScreen} />
        <Stack.Screen name="OlderRequests" component={OlderRequestScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="SettingsOlder" component={SettingsOlderScreen} />
        <Stack.Screen name="ProfileClose" component={ProfileCloseScreen} />
        <Stack.Screen name="ProfileOlder" component={ProfileOlderScreen} />
        <Stack.Screen name="DeceasedRequest" component={DeceasedRequestScreen} />
        <Stack.Screen name="Memories" component={MemoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
