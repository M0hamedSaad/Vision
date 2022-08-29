import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from '@src/model';
import {ArchiveScreen, FavoriteScreen, HomeScreen} from '@src/screens';
import {CustomTabBar} from './customTabBar';
import React from 'react';
const Tab = createBottomTabNavigator<RootStackParamList>();

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      // backBehavior="history"
      defaultScreenOptions={{tabBarHideOnKeyboard: true}}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="homeScreen"
        options={{tabBarLabel: 'Home'}}
        component={HomeScreen}
      />
      <Tab.Screen
        name="archiveScreen"
        options={{tabBarLabel: 'Archives'}}
        component={ArchiveScreen}
      />
      <Tab.Screen
        name="favoriteScreen"
        options={{tabBarLabel: 'Favorites'}}
        component={FavoriteScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
