import React from 'react';
import { Platform, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  console.log('Platform.OS:', Platform.OS);
  console.log('Platform constants:', Platform.constants);

  if (Platform.OS === 'web') {
    const AppWeb = require('./src/web/AppWeb').default;
    return <AppWeb />;
  }

  const Routes = require('./src/routes').default;
  return (
    <>
      <StatusBar style="auto" />
      <Routes />
    </>
  );
}