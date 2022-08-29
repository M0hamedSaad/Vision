import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {FONTS, IMAGES} from '@src/assets';
import {COLORS, normalize, styleGuide} from '@src/utils';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const {width} = Dimensions.get('window');
//icon style ..
const style = StyleSheet.create({
  icon: {
    width: normalize(17),
    height: normalize(17),
    resizeMode: 'contain',
  },
});

// tab icon ..
const bottomTabIcons = {
  Home: {
    active: <Image source={IMAGES.ACTIVE_HOME} style={style.icon} />,
    inactive: <Image source={IMAGES.HOME} style={style.icon} />,
  },
  Archives: {
    active: <Image source={IMAGES.ACTIVE_ARCHIVE} style={style.icon} />,
    inactive: <Image source={IMAGES.ARCHIVE} style={style.icon} />,
  },
  Favorites: {
    active: <Image source={IMAGES.ACTIVE_FAV} style={style.icon} />,
    inactive: <Image source={IMAGES.FAV} style={style.icon} />,
  },
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            hitSlop={{bottom: 10, right: 10, top: 10, left: 10}}
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styleGuide.row}
            onLongPress={onLongPress}>
            <View style={styleGuide.center}>
              {isFocused
                ? bottomTabIcons[label as keyof typeof bottomTabIcons].active
                : bottomTabIcons[label as keyof typeof bottomTabIcons].inactive}
              {isFocused && <View style={styles.activeTab} />}
            </View>

            {isFocused && (
              <Text
                style={{
                  color: isFocused ? '#fff' : '#000',
                  fontFamily: FONTS.REGULAR,
                  fontSize: normalize(11),
                  marginStart: normalize(11),
                }}>
                {label.toString()}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.SECONDARY,
    bottom: normalize(40),
    borderRadius: normalize(24),
    paddingVertical: normalize(11),
    position: 'absolute',

    left: normalize(31.5),
    width: width - normalize(31.5 * 2),
    ...styleGuide.shadow,
  },

  activeTab: {
    width: normalize(4),
    height: normalize(4),
    borderRadius: normalize(4),
    backgroundColor: COLORS.PRIMARY,
    marginTop: normalize(4),

    // position: 'absolute',
  },
});
