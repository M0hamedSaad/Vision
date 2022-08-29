import {COLORS, normalize} from '@src/utils';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
const HIGHT_TOAST = normalize(40);

interface props {
  onPress?: () => void;
}
export const Toast = forwardRef(
  (props: props, forwardedRef?: React.Ref<any>) => {
    const {onPress} = props;
    const animated = useRef(new Animated.Value(0)).current;
    const duration = 300;
    const REACH_TO = normalize(100);
    const DELAY = 3000;
    const [message, setMessage] = useState('');

    interface Options {}

    useImperativeHandle(forwardedRef, () => ({
      showToast(message: string, options?: Options) {
        setMessage(message);
        setTimeout(() => {
          startAnimation();
        }, 0);
      },
      hideToast() {
        setTimeout(() => {
          Animated.spring(animated, {
            toValue: 0,
            delay: 0,
            useNativeDriver: true,
          }).start();
        }, 0);
      },
    }));

    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(animated, {
          toValue: -REACH_TO - HIGHT_TOAST,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animated, {
          toValue: 0,
          delay: DELAY,
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View
        ref={forwardedRef}
        style={[styles.container, {transform: [{translateY: animated}]}]}>
        <View style={styles.messageContainer}>
          <Text style={{color: '#fff'}}>{message}</Text>
          {onPress && (
            <TouchableOpacity style={styles.btn} onPress={onPress}>
              <Text style={styles.btnText}>{'Undo'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    bottom: -HIGHT_TOAST,
    backgroundColor: COLORS.SECONDARY,
    alignSelf: 'center',
    borderRadius: normalize(4),
  },
  messageContainer: {
    height: HIGHT_TOAST,
    width: normalize(300),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: normalize(16),
  },
  btn: {
    backgroundColor: COLORS.THIRD,
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
  },
});
