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
import RelateScreen from './src/screens/RelateScreen';

const Stack = createNativeStackNavigator();

// ✅ Wrapper to access Redux inside Navigator setup
const RootNavigation = () => {
  const isAuthenticated = useSelector(state => state.authentification.isLoggedIn);
  const initialRoute = isAuthenticated ? 'Main' : 'Home';
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Relate" component={RelateScreen} />
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
