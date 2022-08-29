import {IMAGES} from '@src/assets';
import {IRepo} from '@src/model/repo.model';
import {COLORS, normalize, styleGuide} from '@src/utils';
import React, {memo} from 'react';
import {
  Animated,
  I18nManager,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
interface props {
  item: IRepo;
  likeFn: (item: IRepo) => void;
  disLikeFn: (item: IRepo) => void;
  archiveFn: (item: IRepo) => void;
  onPress: (item: IRepo) => void;
  isArchive: boolean;
}

export const RepoCard = memo(
  ({item, likeFn, disLikeFn, archiveFn, onPress, isArchive}: props) => {
    // get total language values
    const sumLangValues = Object.values(item.languages).reduce(
      (a, b) => a + b,
      0,
    );

    const width = normalize(343);
    const gestureDelay = 50;
    const pan = new Animated.ValueXY();
    const opacity = new Animated.Value(1);

    const panResponder = PanResponder.create({
      // press
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        //return true if user is swiping, return false if it's a single click
        return isArchive
          ? !(gestureState.dx === 0 && gestureState.dy === 0)
          : false;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > gestureDelay) {
          pan.setValue({x: gestureState.dx - gestureDelay, y: 0});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        Animated.timing(pan, {
          toValue: {x: gestureState.dx > width / 2 ? width : 0, y: 0},
          useNativeDriver: true,
          duration: 500,
        }).start();

        if (gestureState.dx > width / 2) {
          setTimeout(() => {
            Animated.timing(opacity, {
              toValue: 0,
              useNativeDriver: true,
              duration: 500,
            }).start();
            setTimeout(() => {
              archiveFn(item);
            }, 0);
          }, 500);
        }
      },
    });

    const animateArchive = () => {
      Animated.parallel([
        Animated.timing(pan, {
          toValue: {x: width, y: 0},
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          useNativeDriver: true,
          duration: 500,
        }),
      ]).start(() => {
        archiveFn(item);
      });
    };

    return (
      <Animated.View
        style={{
          opacity: opacity,
          transform: [{translateX: pan.x}],
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onLongPress={() => onPress(item)}
          style={styles.cardContainer}>
          {/**repo details container */}

          <Animated.View
            style={
              {
                // transform: [{translateX: pan.x}],
              }
            }
            {...panResponder.panHandlers}>
            <TouchableHighlight onLongPress={() => onPress(item)}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                style={styles.repoContainer}
                colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}>
                {/**user info container */}

                <View style={[styleGuide.rowBetween, styles.userInfoContainer]}>
                  <View style={styleGuide.row}>
                    <Image
                      style={styles.userImage}
                      source={{uri: item.owner.avatar_url}}
                    />
                    <Text style={styleGuide.Medium}>{item.owner.login}</Text>
                  </View>

                  {isArchive && (
                    <TouchableOpacity
                      style={styles.archiveContainer}
                      onPress={animateArchive}>
                      <Image
                        style={styles.archiveIcon}
                        source={IMAGES.ARCHIVE}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/**repo description */}
                <Text style={styleGuide.Medium}>{item.description}</Text>

                {/**like / dislike container */}
                <View style={[styleGuide.row, styles.likeDisLikeContainer]}>
                  <TouchableOpacity
                    style={[styles.likeContainer, styleGuide.row]}
                    onPress={() => likeFn(item)}>
                    <Image style={styles.likeIcon} source={IMAGES.LIKE} />
                    <Text style={[styleGuide.Regular]}>{'Like'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => disLikeFn(item)}
                    style={[styles.likeContainer, styleGuide.row]}>
                    <Image style={styles.likeIcon} source={IMAGES.DISLIKE} />
                    <Text style={styleGuide.Regular}>{'Dislike'}</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableHighlight>
          </Animated.View>
          {/**languages container */}
          {Object.keys(item?.languages).length > 0 && (
            <View style={styles.languagesContainer}>
              {Object.keys(item.languages).map(lang => {
                const rate = (item.languages[lang] / sumLangValues) * 100;
                const activeBarWidth = (rate / 100) * normalize(177);
                return (
                  <View
                    key={lang}
                    style={[
                      styleGuide.rowBetween,
                      {marginBottom: normalize(12)},
                    ]}>
                    <Text style={[styleGuide.Medium, styles.langName]}>
                      {lang}
                    </Text>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.activeProgressBar,
                          {width: activeBarWidth},
                        ]}>
                        <View
                          style={[
                            styles.progressCircle,
                            {left: activeBarWidth},
                          ]}
                        />
                      </View>
                    </View>
                    <Text
                      style={[
                        styleGuide.Medium,
                        styles.langName,
                        styles.langPercentage,
                      ]}>
                      {Math.trunc(rate)}%
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: normalize(16),
    marginBottom: normalize(24),
  },
  repoContainer: {
    paddingTop: normalize(14),
    borderRadius: normalize(16),
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(18),
  },
  userInfoContainer: {
    marginBottom: normalize(12),
  },
  userImage: {
    backgroundColor: COLORS.THIRD,
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(44),
    marginEnd: normalize(12),
  },

  languagesContainer: {
    paddingVertical: normalize(16),
    borderRadius: normalize(16),
    paddingHorizontal: normalize(18),
  },
  archiveContainer: {
    width: normalize(29),
    height: normalize(29),
    borderRadius: normalize(29),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  archiveIcon: {
    width: normalize(14),
    height: normalize(14),
  },
  likeIcon: {
    width: normalize(12),
    height: normalize(12),
    marginEnd: normalize(10),
  },
  likeContainer: {
    marginEnd: normalize(40),
  },
  langName: {
    fontSize: normalize(13),
    color: COLORS.WHITE,
    width: normalize(71),
    marginEnd: normalize(16),
  },
  langPercentage: {
    width: normalize(28),
    marginStart: normalize(16),
  },

  progressBarContainer: {
    width: normalize(177),
    height: normalize(3),
    backgroundColor: COLORS.THIRD,
  },
  activeProgressBar: {
    backgroundColor: COLORS.PRIMARY,
    height: '100%',
  },
  likeDisLikeContainer: {
    marginTop: normalize(12),
  },
  progressCircle: {
    width: normalize(10),
    height: normalize(10),
    position: 'absolute',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: normalize(10),
    borderWidth: 0.5,
    borderColor: COLORS.WHITE,
    top: normalize(-3.5),
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
  },
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'flex-end',
  },
});
