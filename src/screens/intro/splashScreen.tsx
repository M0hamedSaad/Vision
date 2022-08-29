import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IMAGES} from '@src/assets';
import {RootStackParamList} from '@src/model';
import {normalize, styleGuide} from '@src/utils';
import Lottie from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
const {createAnimatableComponent} = Animatable;
const AnimatableView = createAnimatableComponent(View);

type Props = NativeStackScreenProps<RootStackParamList, 'splashScreen'>;

export const SplashScreen = ({navigation, route}: Props) => {
  const [isShowLottie, setIsShowLottie] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();

  // on animation logo end
  const onAnimationEnd = () => {
    setIsShowLottie(true);
  };

  useEffect(() => {
    if (isShowLottie)
      setTimerId(
        setTimeout(() => {
          navigation.replace('bottomTabs');
        }, 2000),
      );
    return () => clearTimeout(timerId);
  }, [isShowLottie]); // when lottie show , wait 1500 ms and go to home page

  return (
    <View style={[styleGuide.screenContainer, styleGuide.center]}>
      {isShowLottie ? (
        <AnimatableView animation={'fadeInUp'}>
          <Lottie
            autoPlay
            loop={false}
            style={styles.logo}
            source={IMAGES.LOTTIE}
          />
        </AnimatableView>
      ) : (
        <AnimatableView
          animation={'zoomOut'}
          onAnimationEnd={onAnimationEnd}
          delay={2000}
          duration={1000}>
          <Image
            style={styles.logo}
            source={IMAGES.LOGO}
            resizeMode="contain"
          />
        </AnimatableView>
      )}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  logo: {
    width: normalize(180),
    height: normalize(180),
  },
});
