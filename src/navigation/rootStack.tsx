import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@src/model';
import React from 'react';
import {SplashScreen} from '../screens';
import {BottomTabs} from './bottomTabsStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_left'}}
      initialRouteName="splashScreen">
      <Stack.Screen name="splashScreen" component={SplashScreen} />
      <Stack.Screen name="bottomTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default RootStack;
