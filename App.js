import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React from 'react';
import MainNavigator from './src';
import Store, { StoreProvider } from './src/store/store';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const store = new Store()
/* Create a new store */

export default function App() {
  return (
    <StoreProvider store={store}>
      <ActionSheetProvider>
        <MainNavigator />
      </ActionSheetProvider>
    </StoreProvider>
  );
}


