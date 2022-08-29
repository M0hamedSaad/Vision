import {COLORS, normalize, styleGuide} from '@src/utils';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface tabBtn {
  activeIcon?: ImageSourcePropType;
  inActiveIcon?: ImageSourcePropType;
  name: string;
  value: string;
}
interface props {
  onPress?: () => void;
  setSelectedTab: (type: string) => void;
  selectedTab?: string;
  tabs: tabBtn[];
}
export const Tabs = ({onPress, setSelectedTab, selectedTab, tabs}: props) => {
  const onPressTab = (type: string) => {
    setSelectedTab(type);
    // onPress();
  };
  return (
    <View style={styles.tabsContainer}>
      {tabs.map(i => (
        <TouchableOpacity
          key={i.value}
          style={[styles.tab, i.value == selectedTab && styles.activeTab]}
          onPress={() => onPressTab(i.value)}>
          {i.activeIcon && i.value == selectedTab ? (
            <Image style={styles.icon} source={i.activeIcon} />
          ) : i.inActiveIcon ? (
            <Image style={styles.icon} source={i.inActiveIcon} />
          ) : null}
          <Text
            style={[
              styleGuide.Bold,
              i.value == selectedTab ? styles.activeText : {color: '#fff'},
            ]}>
            {i.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    width: normalize(343),
    alignSelf: 'center',
    height: normalize(52),
    marginBottom: normalize(24),
    borderRadius: normalize(12),
    backgroundColor: COLORS.SECONDARY,
    flexDirection: 'row',
  },
  tab: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    borderRadius: normalize(12),
  },
  icon: {
    width: normalize(17),
    height: normalize(17),
    marginEnd: normalize(10),
  },
  activeText: {
    color: '#000',
  },
  activeTab: {
    backgroundColor: COLORS.PRIMARY,
  },
});
