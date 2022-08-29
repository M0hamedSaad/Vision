import {NavigationContainer} from '@react-navigation/native';
import {RootStack} from '@src/navigation';
import React from 'react';
import {StatusBar} from 'react-native';
import {} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {persistor, store} from '@src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle={'light-content'} backgroundColor="#000" />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
