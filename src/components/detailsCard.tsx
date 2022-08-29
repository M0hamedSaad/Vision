import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, normalize, styleGuide} from '@src/utils';
import {IRepo} from '@src/model/repo.model';
import {IMAGES} from '@src/assets';

interface props {
  item?: IRepo;
  closeModal: () => void;
}
export const DetailsCard = ({item, closeModal}: props) => {
  return (
    <View style={styles.container}>
      <Image blurRadius={22} style={styles.overLay} source={IMAGES.BLUR} />
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overLay}
        onPress={closeModal}
      />
      <View style={styles.card}>
        <View style={[styleGuide.row, {marginBottom: normalize(20)}]}>
          <Image
            style={styles.userImage}
            source={{uri: item?.owner.avatar_url}}
          />
          <Text style={[styleGuide.Medium, {color: COLORS.PRIMARY}]}>
            {item?.owner.login}
          </Text>
        </View>

        <Text
          style={[
            styleGuide.Medium,
            {fontSize: normalize(15), color: COLORS.WHITE},
          ]}>
          {item?.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: normalize(292),
    // height: normalize(187),
    paddingVertical: normalize(24),
    paddingHorizontal: normalize(14),
    borderRadius: normalize(12),
    backgroundColor: COLORS.SECONDARY,
    zIndex: 1,
  },
  blurView: {
    position: 'absolute',
    bottom: 0,
    width: normalize(375),
    height: normalize(200),
    opacity: 0.5,
  },
  overLay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000099',
  },
  userImage: {
    backgroundColor: COLORS.THIRD,
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(44),
    marginEnd: normalize(12),
  },
});
