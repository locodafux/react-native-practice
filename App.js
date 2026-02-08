import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import BooksScreen from './screens/BooksScreen';
import AddBookScreen from './screens/AddBookScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';


const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function BooksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BooksList" component={BooksScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AddBook"
        component={AddBookScreen}
        options={{ title: 'Add Book', headerShown: true }}
      />

      <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state.userToken == null ? <AuthStack /> : <BooksStack />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
